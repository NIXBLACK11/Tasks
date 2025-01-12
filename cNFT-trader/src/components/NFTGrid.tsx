// @ts-nocheck

import { useEffect, useState } from "react";
import { NFTData } from "../types";
import { useWallet } from "@solana/wallet-adapter-react";
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { NFTCard } from "./ui/NFTCard";

export const NFTGrid = () => {
	const RPC_URL = import.meta.env.VITE_RPC_URL;
	const [loading, setLoading] = useState<boolean>(false);
	const [nfts, setnfts] = useState<NFTData[]>([]);
	const wallet = useWallet();
	const umi = createUmi(RPC_URL);
	umi.use(walletAdapterIdentity(wallet));
	umi.use(dasApi());

	useEffect(() => {
		const getNFT = async () => {
			try {
				setLoading(true);
				const owner = wallet.publicKey?.toString();
				const rpcAssetList = await umi.rpc.getAssetsByOwner({ owner });

				if (!rpcAssetList || !rpcAssetList.items) {
					console.error('No assets found for this owner.');
				}
				
				const resp: NFTData[] = rpcAssetList.items.map((item: any) => ({
					id: item.id,
					jsonUri: item.content?.json_uri || "",
					image: item.content?.links?.image || "",
					groupKey: item.grouping?.[0]?.group_key || "", // Group key
					groupValue: item.grouping?.[0]?.group_value || "", // Group value
					owner: item.ownership?.owner || "", // Owner's wallet address
				}));
				
				setnfts(resp);
			} catch (error) {
				console.error('Error minting cNFT:', error);
			} finally {
				setLoading(false);
			}
		}

		getNFT();
	}, [wallet]);

    return (
		<div className="flex items-center justify-center">
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-10">
			{loading ? "loading..." : nfts
				.filter((nft) => nft.groupKey)
				.map((nft) => (
					<NFTCard key={nft.id} nft={nft} />
			))}
			</div>
		</div>
	);
};