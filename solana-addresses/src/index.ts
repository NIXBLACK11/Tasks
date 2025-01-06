import { Connection } from "@solana/web3.js";
import { fileReader } from "./fileReader";
import { getSolana } from "./getSolana";
import { getUSDC } from "./getUSDC";
import fs from "fs";

const SOLANA_RPC_ENDPOINT = "https://api.mainnet-beta.solana.com";
export const connection = new Connection(SOLANA_RPC_ENDPOINT);

const main = async () => {
    const inputCSVPath = "./addresses.csv";
    const outputCSVPath = "./addresses.csv";

    const addresses = await fileReader(inputCSVPath);

    const results: { address: string; sol: number; usdc: number }[] = [];

    for (const address of addresses) {
        try {
            const solBalance = await getSolana(address);

            const usdcBalance = await getUSDC(address);

            results.push({ address, sol: solBalance, usdc: usdcBalance });
        } catch (error) {
            console.error(`Error processing wallet ${address}: ${error}`);
        }
    }

    const csvHeader = "address,SOL,USDC\n";
    const csvRows = results.map(({ address, sol, usdc }) => `${address},${sol},${usdc}`).join("\n");

    fs.writeFileSync(outputCSVPath, csvHeader + csvRows);

    console.log(`Results written to ${outputCSVPath}`);
};

main();
