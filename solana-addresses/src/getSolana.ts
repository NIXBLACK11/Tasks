import { PublicKey } from "@solana/web3.js";
import { connection } from ".";

export const getSolana = async (walletAddress: string): Promise<number> => {
    try {
        const publicKey = new PublicKey(walletAddress);
        const balance = await connection.getBalance(publicKey);
        return balance / 1e9;
    } catch (error) {
        console.error(`Error fetching SOL balance for ${walletAddress}: ${error}`);
        return 0;
    }
}