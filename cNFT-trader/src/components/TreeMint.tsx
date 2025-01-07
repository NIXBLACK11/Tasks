import { useState } from 'react';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { generateSigner, KeypairSigner, percentAmount } from '@metaplex-foundation/umi';
import { createTree, findLeafAssetIdPda, LeafSchema, mintToCollectionV1, mplBubblegum, parseLeafFromMintToCollectionV1Transaction } from '@metaplex-foundation/mpl-bubblegum';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { useWallet } from '@solana/wallet-adapter-react';
import { createNft, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

export const TreeMint = () => {
	const [treeAddress, setTreeAddess] = useState<KeypairSigner>();
	const [collectionAddress, setCollectionAddress] = useState<KeypairSigner>();
	const wallet = useWallet();
	const [loading, setLoading] = useState(false);
	const umi = createUmi('https://api.devnet.solana.com');
	umi.use(walletAdapterIdentity(wallet));
	umi.use(mplTokenMetadata());
	umi.use(mplBubblegum());

umi.use(dasApi());
	
	const signer = generateSigner(umi);

	const createBubblegumTree = async () => {
		try {
			setLoading(true);
			const merkleTree = generateSigner(umi);
			console.log('merkleTree', merkleTree.publicKey.toString());

			const builder = await createTree(umi, {
				merkleTree,
				maxDepth: 5, // Max depth for tree
				maxBufferSize: 8, // Buffer size
			});

			await builder.sendAndConfirm(umi);
			console.log('Bubblegum Tree Created!', merkleTree.publicKey);
			setTreeAddess(merkleTree);
		} catch (error) {
			console.error('Error creating Bubblegum Tree:', error);
		} finally {
			setLoading(false);
		}
  	};

	const createCollectionNFT = async () => {
		try {
		  	setLoading(true);
		  
			const collectionMint = generateSigner(umi)
			console.log('collection mint', collectionMint.publicKey.toString());

			await createNft(umi, {
				mint: collectionMint,
				name: 'My Collection',
				uri: 'https://raw.githubusercontent.com/NIXBLACK11/Tasks/refs/heads/main/cNFT-trader/test-collection.json',
				sellerFeeBasisPoints: percentAmount(5.5),
				isCollection: true,
			}).sendAndConfirm(umi)
			
			console.log('NFT Collection created', collectionMint.publicKey);
			setCollectionAddress(collectionMint);
		} catch (error) {
		  	console.error('Error creating Collection NFT:', error);
		} finally {
		  	setLoading(false);
		}
	};
	

	const mintCompressedNFT = async () => {
		try {
			setLoading(true);
			const leafOwner = signer.publicKey;

			const merkleTreeAddress = treeAddress?.publicKey;
			const collectionMint = collectionAddress?.publicKey;

			if (!merkleTreeAddress) {
			  throw new Error("Merkle Tree address is undefined. Ensure the tree is created correctly.");
			}

			if (!collectionMint) {
				throw new Error("Collection mint is undefined. Ensure the mint is created correctly.");
			}

			// For without collection
			// const { signature } = await mintV1(umi, {
			// 	leafOwner,
			// 	merkleTree: merkleTreeAddress,
			// 	metadata : {
			// 		name: 'Test transfer',
			// 		uri: 'https://raw.githubusercontent.com/NIXBLACK11/Tasks/refs/heads/main/cNFT-trader/test-cnft.json',
			// 		sellerFeeBasisPoints: 500, // 5% fee
			// 		collection: none(), // No collection
			// 		creators: [
			// 			{ address: signer.publicKey, verified: false, share: 100 },
			// 		],
			// 	},
			// }).sendAndConfirm(umi);
			// const leaf: LeafSchema = await parseLeafFromMintV1Transaction(umi, signature);

			const { signature } = await mintToCollectionV1(umi, {
				leafOwner,
				merkleTree: merkleTreeAddress,
				collectionMint: collectionMint,
				metadata : {
					name: 'Test Compressed NFT',
					uri: 'https://raw.githubusercontent.com/NIXBLACK11/Tasks/refs/heads/main/cNFT-trader/test-cnft.json',
					sellerFeeBasisPoints: 500, // 5% fee
					collection: { key: collectionMint, verified: false },
					creators: [
						{ address: signer.publicKey, verified: false, share: 100 },
					],
				},
			}).sendAndConfirm(umi)

			console.log('Compressed NFT Minted!',signature);

			const leaf: LeafSchema = await parseLeafFromMintToCollectionV1Transaction(umi, signature);
  			console.log('leaf', leaf);
		} catch (error) {
			console.error('Error minting cNFT:', error);
		} finally {
			setLoading(false);
		}
	};

  return (
		<div className='bg-cyan-300 p-4 rounded-lg'>
			<button className="bg-blue-500 rounded-lg p-4 m-2" onClick={createBubblegumTree} disabled={loading}>
				{loading ? 'Creating Bubblegum Tree...' : 'Create Bubblegum Tree'}
			</button>
			<button className="bg-blue-500 rounded-lg p-4 m-2" onClick={createCollectionNFT} disabled={loading}>
				{loading ? 'Creating Collection Tree...' : 'Create NFT Collection'}
			</button>
			<button className="bg-blue-500 rounded-lg p-4 m-2" onClick={mintCompressedNFT} disabled={loading}>
				{loading ? 'Minting Compressed NFT...' : 'Mint Compressed NFT'}
			</button>
		</div>
  );
};
