import { Connection, Transaction, VersionedTransaction } from "@solana/web3.js";
import { useWallet } from '@solana/wallet-adapter-react';
import { useState } from "react";

export const TransferNFT = () => {
    const [loading, _setLoading] = useState(false);
    const wallet = useWallet();
    const TENSOR_API_KEY = ""
    const COLLECTION_SLUG = "";
    const SOLANA_RPC = "https://api.devnet.solana.com";

    const transferNFT = async () => {
        if(!wallet || !wallet.publicKey) {
            return;
        }

        const options = {
            method: "GET",
            headers: {
              accept: "application/json",
              "x-tensor-api-key": TENSOR_API_KEY,
            },
        };
        
        const url = "https://api.devnet.tensordev.io/api/v1/mint/collection";
        
        const queryParams = new URLSearchParams();
        queryParams.append("slug", COLLECTION_SLUG);
        queryParams.append("sortBy", "ListingPriceAsc");
        queryParams.append("limit", "1");
        queryParams.append("onlyListings", "true");
        
        const fullUrl = `${url}?${queryParams.toString()}`;

        fetch(fullUrl, options)
            .then((response) => response.json())
            .then(async (response) => {
                const connection = new Connection(SOLANA_RPC);
                const blockhash = await connection.getLatestBlockhash();
                return { response, blockhash };
            })
            .then(async ({ response, blockhash }) => {
                const buyUrl = "https://api.devnet.tensordev.io/api/v1/tx/buy";
                const buyParams = new URLSearchParams();
                if(!wallet.publicKey) return;

                buyParams.append("buyer", wallet.publicKey.toString());
                buyParams.append("mint", response.mints[0].mint);
                buyParams.append("owner", response.mints[0].listing.seller);
                buyParams.append("maxPrice", response.mints[0].listing.price);
                buyParams.append("blockhash", blockhash.blockhash);

                const fullBuyUrl = `${buyUrl}?${buyParams.toString()}`;

                const buyResponse = await fetch(fullBuyUrl, options);
                return buyResponse.json();
            })
            .then(async (response) => {
                const connection = new Connection(SOLANA_RPC);
                // Deserialize the transactions
                const txsToSign = response.txs.map((tx: any) =>
                                                    tx.txV0
                                                ? VersionedTransaction.deserialize(response.txs[0].txV0.data)
                                                : Transaction.from(tx.tx.data)
                                                );

                txsToSign.map((tx: any) => tx.sign([wallet]));
                for (const tx of txsToSign) {
                    const sig = await connection.sendTransaction(tx);
                    await connection.confirmTransaction(sig, "confirmed" );
                    console.log(`Transaction confirmed. https://solscan.io/tx/${sig}`);
                }
            })
            .catch((err) => console.error(err));
    }

    return (
        <div className='bg-cyan-300 p-4 rounded-lg flex flex-col'>
			<div className='bg-cyan-400 rounded-lg flex flex-row'>
                <button className="bg-blue-500 rounded-lg p-4 m-2" onClick={transferNFT} disabled={loading}>
					{loading ? 'Buying cNFT...' : 'Buy cNFT'}
				</button>
            </div>
        </div>
    )
}