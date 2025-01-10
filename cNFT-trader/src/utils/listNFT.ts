import axios from "axios";
import { BASE_URL } from "../constants";

export const listNFT = async (
    mintAddress: string,
    NFTOwner: string,
    NFTprice: string,
    delegateSigner: string
): Promise<any> => {
    try {
        const url = `${BASE_URL}/listNFT`;

        const response = await axios.get(url, {
            params: {
                mintAddress,
                NFTOwner,
                NFTprice,
                delegateSigner
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