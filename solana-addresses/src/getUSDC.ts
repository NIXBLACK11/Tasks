import { PublicKey } from "@solana/web3.js";
import { connection } from ".";

const USDC_MINT_ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

export const getUSDC = async (walletAddress: string): Promise<number> => {
    try {
        const publicKey = new PublicKey(walletAddress);
        const tokenAccounts = await connection.getTokenAccountsByOwner(publicKey, {
            mint: new PublicKey(USDC_MINT_ADDRESS),
        });

        let totalBalance = 0;
        for (const account of tokenAccounts.value) {
            const accountInfo = await connection.getParsedAccountInfo(
                new PublicKey(account.pubkey)
            );
            const data = accountInfo.value?.data as any;
            const tokenAmount = data.parsed?.info?.tokenAmount?.uiAmount ?? 0;
            totalBalance += tokenAmount;
        }
        return totalBalance;
    } catch (error) {
        console.error(`Error fetching USDC balance for ${walletAddress}: ${error}`);
        return 0;
    }
};
