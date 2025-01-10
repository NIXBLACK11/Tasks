import React, { useState } from 'react';
import { listNFT } from '../utils/listNFT';

export const ListNFT = () => {
    const [formData, setFormData] = useState({
        mintAddress: '',
        NFTOwner: '',
        NFTprice: '',
        delegateSigner: ''
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
            const result = await listNFT(
                formData.mintAddress,
                formData.NFTOwner,
                formData.NFTprice,
                formData.delegateSigner
            );
            setStatus({ 
                type: 'success', 
                message: 'NFT listed successfully!' 
            });
            console.log(result);
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
            <h2 className="text-2xl font-bold mb-6">List NFT</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
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
                        name="NFTOwner"
                        value={formData.NFTOwner}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="NFT Price"
                        name="NFTprice"
                        value={formData.NFTprice}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Delegate Signer"
                        name="delegateSigner"
                        value={formData.delegateSigner}
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
                    {isLoading ? 'Listing...' : 'List NFT'}
                </button>
            </form>
        </div>
    );
};