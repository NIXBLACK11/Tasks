import { Router, } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import { Connection, clusterApiUrl } from '@solana/web3.js';

dotenv.config();

const router = Router();
const TENSOR_API_KEY = process.env.TENSOR_API_KEY;

const connection = new Connection(clusterApiUrl('devnet'));

router.get('/buyNFT', async (req: any, res: any) => {
    try {
        if (!TENSOR_API_KEY) {
            console.error("TENSOR_API_KEY is not defined");
            return res.status(500).json({ error: "Internal server error: API key is missing" });
        }

        const { buyer, mintAddress, ownerNFT, maxPrice } = req.query;

        if (!buyer || !mintAddress || !ownerNFT || !maxPrice) {
            return res.status(400).json({
                error: "Missing required parameters. Ensure 'buyer', 'mintAddress', 'ownerNFT', and 'maxPrice' are provided."
            });
        }

        const { blockhash } = await connection.getLatestBlockhash();

        const url = `https://api.devnet.tensordev.io/api/v1/tx/buy?buyer=${buyer}&mint=${mintAddress}&owner=${ownerNFT}&maxPrice=${maxPrice}&blockhash=${blockhash}`;

        const tensorResponse = await axios.get(url, {
            headers: {
                accept: 'application/json',
                'x-tensor-api-key': TENSOR_API_KEY
            }
        });

        return res.status(200).json({
            success: true,
            data: tensorResponse.data
        });
    } catch (err: any) {
        console.error('Error in buying NFT:', err.message);
        return res.status(500).json({
            error: "An error occurred while processing the NFT purchase",
            details: err.message
        });
    }
});

export default router;
