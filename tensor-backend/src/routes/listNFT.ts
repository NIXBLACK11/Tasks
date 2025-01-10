import { Router } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import { Connection, clusterApiUrl } from '@solana/web3.js';

dotenv.config();

const router = Router();
const TENSOR_API_KEY = process.env.TENSOR_API_KEY;

const connection = new Connection(clusterApiUrl('devnet'));

router.get('/listNFT', async (req: any, res: any) => {
    try {
        if (!TENSOR_API_KEY) {
            console.error("TENSOR_API_KEY is not defined");
            return res.status(500).json({ error: "Internal server error: API key is missing" });
        }

        const { mintAddress, NFTOwner, NFTprice, delegateSigner } = req.query;

        if (!mintAddress || !NFTOwner || !NFTprice || !delegateSigner) {
            return res.status(400).json({
                error: "Missing required parameters. Ensure 'mintAddress', 'NFTOwner', 'NFTprice', and 'delegateSigner' are provided."
            });
        }

        const { blockhash } = await connection.getLatestBlockhash();

        const url = `https://api.devnet.tensordev.io/api/v1/tx/list?mint=${mintAddress}&owner=${NFTOwner}&price=${NFTprice}&blockhash=${blockhash}&delegateSigner=${delegateSigner}`;

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
        console.error('Error in listing NFT:', err.message);
        return res.status(500).json({
            error: "An error occurred while fetching NFT data",
            details: err.message
        });
    }
});

export default router;
