import { useState } from 'react';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { generateSigner, percentAmount, publicKey, PublicKey } from '@metaplex-foundation/umi';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { useWallet } from '@solana/wallet-adapter-react';
import { createNft, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { base58 } from '@metaplex-foundation/umi/serializers';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { createTree, mintToCollectionV1, mplBubblegum } from '@metaplex-foundation/mpl-bubblegum';

export const TreeMint = () => {
	const RPC_URL = import.meta.env.VITE_RPC_URL;
	const [treeAddress, setTreeAddess] = useState<PublicKey>();
	const [collectionAddress, setCollectionAddress] = useState<PublicKey>();
	const [transaction, setTransaction] = useState<string>();
	const wallet = useWallet();
	const [loading, setLoading] = useState(false);
	const umi = createUmi(RPC_URL);
	umi.use(walletAdapterIdentity(wallet));
	umi.use(mplTokenMetadata());
	umi.use(mplBubblegum());

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
			setTreeAddess(merkleTree.publicKey);
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
				name: 'test-collection',
				uri: 'https://raw.githubusercontent.com/NIXBLACK11/Tasks/refs/heads/main/cNFT-trader/test-collection.json',
				sellerFeeBasisPoints: percentAmount(5.5),
				isCollection: true,
			}).sendAndConfirm(umi)
			
			console.log('NFT Collection created', collectionMint.publicKey);
			setCollectionAddress(collectionMint.publicKey);
		} catch (error) {
		  	console.error('Error creating Collection NFT:', error);
		} finally {
		  	setLoading(false);
		}
	};
	

	const mintCompressedNFT = async () => {
		try {
			setLoading(true);

			const leafOwner = umi.identity.publicKey;

			const merkleTreeAddress = treeAddress;
			const collectionMint = collectionAddress;

			if (!merkleTreeAddress) {
			  throw new Error("Merkle Tree address is undefined. Ensure the tree is created correctly.");
			}

			if (!collectionMint) {
				throw new Error("Collection mint is undefined. Ensure the mint is created correctly.");
			}

			const { signature } = await mintToCollectionV1(umi, {
				leafOwner,
				merkleTree: merkleTreeAddress,
				collectionMint: collectionMint,
				metadata : {
					name: 'test-cnft',
					uri: 'https://raw.githubusercontent.com/NIXBLACK11/Tasks/refs/heads/main/cNFT-trader/test-cnft.json',
					sellerFeeBasisPoints: 500, // 5% fee
					collection: { key: collectionMint, verified: false },
					creators: [
						{ address: leafOwner, verified: false, share: 100 },
					],
				},
			}).sendAndConfirm(umi, {send: { skipPreflight: true}})

			const signatureString = base58.deserialize(signature);

			console.log("signature->", signatureString);
			// const leaf: LeafSchema = await parseLeafFromMintToCollectionV1Transaction(umi, signature);
			setTransaction(signatureString[0]);
			console.log('Compressed NFT Minted!',signature);
		} catch (error) {
			console.error('Error fetching cNFT:', error);
		} finally {
			setLoading(false);
			window.location.reload();
		}
	};

  return (
		<div className='bg-cyan-300 p-4 rounded-lg flex flex-col'>
			<div className='bg-cyan-400 rounded-lg flex flex-row'>
				<button className="bg-blue-500 hover:bg-blue-800 rounded-lg p-4 m-2" onClick={createBubblegumTree} disabled={loading}>
					{loading ? 'Creating Bubblegum Tree...' : 'Create Bubblegum Tree'}
				</button>
				<button className="bg-blue-500 hover:bg-blue-800 rounded-lg p-4 m-2" onClick={createCollectionNFT} disabled={loading}>
					{loading ? 'Creating Collection Tree...' : 'Create NFT Collection'}
				</button>
				<div className='flex flex-col'>
					<button className="bg-blue-500 hover:bg-blue-800 rounded-lg p-4 m-2" onClick={mintCompressedNFT} disabled={loading}>
						{loading ? 'Minting Compressed NFT...' : 'Mint Compressed NFT'}
					</button>
					<input
						type="text"
						className="p-2 m-2 rounded-lg border border-gray-300"
						placeholder="Enter Tree address:"
						value={treeAddress}
						onChange={(e) => setTreeAddess(publicKey(e.target.value))}
					/>
					<input
						type="text"
						className="p-2 m-2 rounded-lg border border-gray-300"
						placeholder="Enter Mint address:"
						value={collectionAddress}
						onChange={(e) => setCollectionAddress(publicKey(e.target.value))}
					/>
				</div>
			</div>
			<div className='bg-cyan-400 rounded-lg flex flex-col'>
				{treeAddress && (
					<div className="bg-blue-500 rounded-lg p-4 m-2 text-white flex items-center">
						Merkle Tree address:
						<a
							href={`https://explorer.solana.com/address/${treeAddress}?cluster=devnet`}
							target="_blank"
							rel="noopener noreferrer"
							className="underline flex items-center"
						>
							{treeAddress}
							<FaExternalLinkAlt className="ml-2" />
						</a>
					</div>
				)}

				{collectionAddress && (
					<div className="bg-blue-500 rounded-lg p-4 m-2 text-white flex items-center">
						NFT Collection address:
						<a
							href={`https://explorer.solana.com/address/${collectionAddress}?cluster=devnet`}
							target="_blank"
							rel="noopener noreferrer"
							className="underline flex items-center"
						>
							{collectionAddress}
							<FaExternalLinkAlt className="ml-2" />
						</a>
					</div>
				)}

				{transaction && (
					<div className="bg-blue-500 rounded-lg p-4 m-2 text-white flex items-center">
						cNFT will be avaiable at your phantom wallet:
						<a
							href={`https://explorer.solana.com/transaction/${transaction}?cluster=devnet`}
							target="_blank"
							rel="noopener noreferrer"
							className="underline flex items-center"
						>
							{transaction}
							<FaExternalLinkAlt className="ml-2" />
						</a>
					</div>
				)}
			</div>
		</div>
  );
};
