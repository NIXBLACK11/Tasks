import React, { useState } from 'react';
import { Transaction, VersionedTransaction } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { buyNFT } from '../../utils/buyNFT';

export const BuyNFT = () => {
    const wallet = useWallet();
    const { connection } = useConnection();
    const [formData, setFormData] = useState({
        buyer: '',
        mintAddress: '',
        ownerNFT: '',
        maxPrice: ''
    });

    const [status, setStatus] = useState<{
        type: 'success' | 'error' | null;
        message: string;
    }>({ type: null, message: '' });

    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus({ type: null, message: '' });

        try {
            const response = await buyNFT(
                formData.buyer,
                formData.mintAddress,
                formData.ownerNFT,
                formData.maxPrice
            );

            setStatus({ 
                type: 'success', 
                message: 'NFT purchase initiated successfully!' 
            });

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

            setStatus({ 
                type: 'success', 
                message: 'NFT purchased successfully!' 
            });
        } catch (error) {
            setStatus({ 
                type: 'error', 
                message: error instanceof Error ? error.message : 'An error occurred' 
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Buy NFT</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        type="text"
                        placeholder="Buyer"
                        name="buyer"
                        value={formData.buyer}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Mint Address"
                        name="mintAddress"
                        value={formData.mintAddress}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="NFT Owner"
                        name="ownerNFT"
                        value={formData.ownerNFT}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Max Price"
                        name="maxPrice"
                        value={formData.maxPrice}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {status.type && (
                    <div className={`p-4 rounded-md ${
                        status.type === 'error' 
                            ? 'bg-red-50 text-red-700' 
                            : 'bg-green-50 text-green-700'
                    }`}>
                        {status.message}
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Processing...' : 'Buy NFT'}
                </button>
            </form>
        </div>
    );
};
