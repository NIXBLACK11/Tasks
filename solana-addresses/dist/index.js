"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
const web3_js_1 = require("@solana/web3.js");
const fileReader_1 = require("./fileReader");
const getSolana_1 = require("./getSolana");
const getUSDC_1 = require("./getUSDC");
const fs_1 = __importDefault(require("fs"));
const SOLANA_RPC_ENDPOINT = "https://api.mainnet-beta.solana.com";
exports.connection = new web3_js_1.Connection(SOLANA_RPC_ENDPOINT);
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const inputCSVPath = "./addresses.csv";
    const outputCSVPath = "./addresses.csv";
    const addresses = yield (0, fileReader_1.fileReader)(inputCSVPath);
    const results = [];
    for (const address of addresses) {
        try {
            const solBalance = yield (0, getSolana_1.getSolana)(address);
            const usdcBalance = yield (0, getUSDC_1.getUSDC)(address);
            results.push({ address, sol: solBalance, usdc: usdcBalance });
        }
        catch (error) {
            console.error(`Error processing wallet ${address}: ${error}`);
        }
    }
    const csvHeader = "address,SOL,USDC\n";
    const csvRows = results.map(({ address, sol, usdc }) => `${address},${sol},${usdc}`).join("\n");
    fs_1.default.writeFileSync(outputCSVPath, csvHeader + csvRows);
    console.log(`Results written to ${outputCSVPath}`);
});
main();
