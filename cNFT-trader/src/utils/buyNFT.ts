import axios from "axios";
import { BASE_URL } from "../constants";

export const buyNFT = async (
    buyer: string,
    mintAddress: string,
    ownerNFT: string,
    maxPrice: string
): Promise<any> => {
    try {
        const url = `${BASE_URL}/buyNFT`;

        const response = await axios.get(url, {
            params: {
                buyer,
                mintAddress,
                ownerNFT,
                maxPrice
            },
            headers: {
                accept: 'application/json',
            },
        });

        return response.data;
    } catch (error: any) {
        console.error('Error in buyNFT request:', error.message);
        throw new Error(error.response?.data?.error || 'Failed to buy NFT');
    }
};
