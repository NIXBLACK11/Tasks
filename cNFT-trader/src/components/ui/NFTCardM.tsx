import React, { useState } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { NFTData } from '../../types';
import { Transaction, VersionedTransaction } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { buyNFT } from '../../utils/buyNFT';

interface NFTCardProps {
	nft: NFTData;
	onList?: (id: string, price: number) => void;
	onDelist?: (id: string) => void;
}

export const NFTCardM: React.FC<NFTCardProps> = ({ nft }) => {
	const wallet = useWallet();
	const { connection } = useConnection();
	const [showModal, setShowModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [price, setPrice] = useState('');

	const buyNFTFunc = async () => {
		try {
			const response = await buyNFT(
				wallet.publicKey?.toString() || "null",
				nft.id,
				nft.owner,
				price
			);

			const txsToSign = response.data.txs.map((tx: any) =>
				tx.txV0
					? VersionedTransaction.deserialize(tx.txV0.data)
					: Transaction.from(tx.tx.data)
			);

			if (!wallet || !wallet.signAllTransactions) {
				console.log("Wallet not connected");
				return;
			}

			const txsSigned = await wallet.signAllTransactions(txsToSign);

			for (const tx of txsSigned) {
				if (tx instanceof VersionedTransaction) {
					const sig = await connection.sendTransaction(tx);
					await connection.confirmTransaction(sig);
				} else {
					throw new Error("Transaction is not of type VersionedTransaction");
				}
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	}

	return (
		<>
			<div className="bg-[#0A0A0A] rounded-lg overflow-hidden shadow hover:shadow-xl transition-shadow duration-300 border-cyan-400 border flex flex-col justify-center items-center">
				<div className="relative w-full h-48">
					<img
						src={nft.image || "/api/placeholder/400/400"}
						alt={`NFT ${nft.id}`}
						className="w-full h-full object-contain"
					/>
				</div>
				
				<div className="m-4">
					<div className="flex items-center justify-between mb-2 text-white">
						<h3 className="font-bold text-sm">NFT #{nft.id}</h3>
						<a
							href={nft.jsonUri}
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-500 hover:text-blue-700"
						>
							<FaExternalLinkAlt size={16} className='text-[#512DA8]' />
						</a>
					</div>
					{nft.groupKey && (
						<p className="text-sm text-gray-600 mb-1">
							{nft.groupKey}: {nft.groupValue}
						</p>
					)}
				</div>
				<button
					className='rounded-lg bg-[#512DA8] text-white px-4 py-2 m-2'
					onClick={() => {
						buyNFTFunc();
					}}
				>
					{loading ? "Buying cNFT..." : "Buy cNFT"}
				</button>
			</div>

			{showModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
						<h3 className="text-lg font-bold mb-4">Set Listing Price</h3>
						<input
							type="number"
							value={price}
							onChange={(e) => setPrice(e.target.value)}
							placeholder="Enter max price"
							className="w-full px-3 py-2 border rounded mb-4"
							min="0"
							step="0.01"
						/>
						<div className="flex gap-2">
							<button
								onClick={() => {
										setShowModal(false);
								}}
								className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
							>
								Confirm
							</button>
							<button
								onClick={() => {
									setShowModal(false);
									setPrice('');
								}}
								className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};