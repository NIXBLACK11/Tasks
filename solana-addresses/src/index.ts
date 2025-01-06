import { Connection } from "@solana/web3.js";
import { fileReader } from "./fileReader";
import { getSolana } from "./getSolana";
import { getUSDC } from "./getUSDC";
import fs from "fs";

const SOLANA_RPC_ENDPOINT = "https://api.mainnet-beta.solana.com";
export const connection = new Connection(SOLANA_RPC_ENDPOINT);

const main = async () => {
    const inputCSVPath = "./addresses.csv";
    const outputCSVPath = "out.csv";

    // Read wallet addresses from the CSV
    const addresses = await fileReader(inputCSVPath);

    // Initialize an array to store the results
    const results: { address: string; sol: number; usdc: number }[] = [];

    for (const address of addresses) {
        try {
            // Fetch SOL balance
            const solBalance = await getSolana(address);

            // Fetch USDC balance
            const usdcBalance = await getUSDC(address);

            // Add to results
            results.push({ address, sol: solBalance, usdc: usdcBalance });
        } catch (error) {
            console.error(`Error processing wallet ${address}: ${error}`);
        }
    }

    // Write results to the output CSV
    const csvHeader = "address,SOL,USDC\n";
    const csvRows = results.map(({ address, sol, usdc }) => `${address},${sol},${usdc}`).join("\n");

    fs.writeFileSync(outputCSVPath, csvHeader + csvRows);

    console.log(`Results written to ${outputCSVPath}`);
};

main();
