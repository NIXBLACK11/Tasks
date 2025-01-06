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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUSDC = void 0;
const web3_js_1 = require("@solana/web3.js");
const _1 = require(".");
const USDC_MINT_ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const getUSDC = (walletAddress) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        const publicKey = new web3_js_1.PublicKey(walletAddress);
        const tokenAccounts = yield _1.connection.getTokenAccountsByOwner(publicKey, {
            mint: new web3_js_1.PublicKey(USDC_MINT_ADDRESS),
        });
        let totalBalance = 0;
        for (const account of tokenAccounts.value) {
            const accountInfo = yield _1.connection.getParsedAccountInfo(new web3_js_1.PublicKey(account.pubkey));
            const data = (_a = accountInfo.value) === null || _a === void 0 ? void 0 : _a.data;
            const tokenAmount = (_e = (_d = (_c = (_b = data.parsed) === null || _b === void 0 ? void 0 : _b.info) === null || _c === void 0 ? void 0 : _c.tokenAmount) === null || _d === void 0 ? void 0 : _d.uiAmount) !== null && _e !== void 0 ? _e : 0;
            totalBalance += tokenAmount;
        }
        return totalBalance;
    }
    catch (error) {
        console.error(`Error fetching USDC balance for ${walletAddress}: ${error}`);
        return 0;
    }
});
exports.getUSDC = getUSDC;
