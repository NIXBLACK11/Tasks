// @ts-nocheck

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";

import { NFTData } from "../types";
import { NFTCardM } from "../components/ui/NFTCardM";

export const Market = () => {
    const RPC_URL = import.meta.env.VITE_RPC_URL;
    const [collectionAddress, setCollectionAddress] = useState("");
    const [loading, setLoading] = useState<boolean>(false);
    const [nfts, setnfts] = useState<NFTData[]>([]);
    const wallet = useWallet();
    const umi = createUmi(RPC_URL);
    umi.use(walletAdapterIdentity(wallet));
    umi.use(dasApi());

    const fetchNFTCollection = async () => {
        try {
            setLoading(true);
            const rpcAssetList = await umi.rpc.getAssetsByGroup({
                groupKey: 'collection',
                groupValue: collectionAddress,
            });

            if (!rpcAssetList || !rpcAssetList.items) {
                console.error('No assets found for this owner.');
            }
            console.log(rpcAssetList);
            
            const resp: NFTData[] = rpcAssetList.items.map((item: any) => ({
                id: item.id,
                jsonUri: item.content?.json_uri || "",
                image: item.content?.links?.image || "",
                groupKey: item.grouping?.[0]?.group_key || "", // Group key
                groupValue: item.grouping?.[0]?.group_value || "", // Group value
                owner: item.ownership?.owner || "", // Owner's wallet address
            }));
            
            setnfts(resp);
            console.log(resp);
        } catch (error) {
            console.error('Error minting cNFT:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleInputChange = (event: any) => {
        setCollectionAddress(event.target.value);
    };

    return (
        <div className="bg-[#0F0F10] min-h-screen min-w-screen flex flex-col overflow-x-hidden font-custom items-center">
            <h1 className="m-6 text-5xl text-white">NFT Marketplace</h1>
            <WalletMultiButton />

            <div className="mt-8 flex justify-center flex-col items-center">
                <label htmlFor="collectionAddress" className="block text-white text-lg mb-2">
                    Enter NFT Collection Address:
                </label>
                <div>
                    <input
                        type="text"
                        id="collectionAddress"
                        value={collectionAddress}
                        onChange={handleInputChange}
                        placeholder="Enter Collection Address"
                        className="p-2 rounded-md text-black w-80 m-2"
                    />
                    <button 
                        className="rounded-lg text-white m-2 bg-gray-800 hover:bg-gray-600 p-2"
                        onClick={() => {
                            fetchNFTCollection();
                        }}
                    >
                        { loading ? "Searching cNFTs..." : "Search cNFTs" }
                    </button>
                </div>
            </div>

            {collectionAddress && (
                <p className="text-white mt-4">
                    Current Collection Address: <span className="font-bold">{collectionAddress}</span>
                </p>
            )}

            <div className="flex items-center justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-10">
                {loading ? "loading..." : nfts
                    .filter((nft) => nft.groupKey)
                    .map((nft) => (
                        <NFTCardM key={nft.id} nft={nft} />
                ))}
                </div>
            </div>
        </div>
    );
};
