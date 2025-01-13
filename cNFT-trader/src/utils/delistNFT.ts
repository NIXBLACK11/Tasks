import axios from "axios";
import { BASE_URL } from "../constants";

export const delistNFT = async (
    mintAddress: string,
    NFTOwner: string
): Promise<any> => {
    try {
        const url = `${BASE_URL}/api/delistNFT`;

        const response = await axios.get(url, {
            params: {
                mintAddress,
                NFTOwner
            },
            headers: {
                accept: 'application/json',
            },
        });

        return response.data;
    } catch (error: any) {
        console.error('Error in delistNFT request:', error.message);
        throw new Error(error.response?.data?.error || 'Failed to delist NFT');
    }
};
