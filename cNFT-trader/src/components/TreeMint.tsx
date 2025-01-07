import { useState } from 'react';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { generateSigner } from '@metaplex-foundation/umi';
import { createTree } from '@metaplex-foundation/mpl-bubblegum';
import { mintV1 } from '@metaplex-foundation/mpl-bubblegum';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { useWallet } from '@solana/wallet-adapter-react';

export const TreeMint = () => {
	const wallet = useWallet();
	const [loading, setLoading] = useState(false);
	const umi = createUmi('https://api.devnet.solana.com');
	umi.use(walletAdapterIdentity(wallet));
	const signer = generateSigner(umi);

	const createBubblegumTree = async () => {
		try {
			setLoading(true);
			const merkleTree = generateSigner(umi);

			const builder = await createTree(umi, {
				merkleTree,
				maxDepth: 14, // Max depth for tree
				maxBufferSize: 64, // Buffer size
			});

			await builder.sendAndConfirm(umi);
			console.log('Bubblegum Tree Created!');
		} catch (error) {
			console.error('Error creating Bubblegum Tree:', error);
		} finally {
			setLoading(false);
		}
  	};

	const mintCompressedNFT = async () => {
		try {
			setLoading(true);
			const leafOwner = signer.publicKey;

			const metadata = {
				name: 'Test transfer',
				uri: 'https://example.com/my-cnft.json',
				sellerFeeBasisPoints: 500, // 5% fee
				collection: null, // No collection
				creators: [
				{ address: signer.publicKey, verified: false, share: 100 },
				],
			};

			await mintV1(umi, {
				leafOwner,
				merkleTree: signer.publicKey,
				metadata,
			}).sendAndConfirm(umi);

			console.log('Compressed NFT Minted!');
		} catch (error) {
			console.error('Error minting cNFT:', error);
		} finally {
			setLoading(false);
		}
	};

  return (
		<div>
		<h1>Create and Mint Compressed NFT</h1>
		<button onClick={createBubblegumTree} disabled={loading}>
			{loading ? 'Creating Bubblegum Tree...' : 'Create Bubblegum Tree'}
		</button>
		<button onClick={mintCompressedNFT} disabled={loading}>
			{loading ? 'Minting Compressed NFT...' : 'Mint Compressed NFT'}
		</button>
		</div>
  );
};
