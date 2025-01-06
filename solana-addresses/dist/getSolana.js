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
exports.getSolana = void 0;
const web3_js_1 = require("@solana/web3.js");
const _1 = require(".");
const getSolana = (walletAddress) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const publicKey = new web3_js_1.PublicKey(walletAddress);
        const balance = yield _1.connection.getBalance(publicKey);
        return balance / 1e9;
    }
    catch (error) {
        console.error(`Error fetching SOL balance for ${walletAddress}: ${error}`);
        return 0;
    }
});
exports.getSolana = getSolana;
