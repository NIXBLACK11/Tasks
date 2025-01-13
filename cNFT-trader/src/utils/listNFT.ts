import axios from "axios";
import { BASE_URL } from "../constants";

export const listNFT = async (
    mintAddress: string,
    NFTOwner: string,
    NFTprice: string
): Promise<any> => {
    try {
        const url = `${BASE_URL}/api/listNFT`;

        const response = await axios.get(url, {
            params: {
                mintAddress,
                NFTOwner,
                NFTprice
            },
            headers: {
                accept: 'application/json',
            },
        });

        return response.data;
    } catch (error: any) {
        console.error('Error in listNFT request:', error.message);
        throw new Error(error.response?.data?.error || 'Failed to list NFT');
    }
};