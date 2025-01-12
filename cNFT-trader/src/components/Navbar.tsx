import { FaExternalLinkAlt } from "react-icons/fa";

export const Navbar = () => {
    return (
        <div className="top-0 left-0 w-full flex justify-around items-center text-white">
            <div className="flex flex-col items-center">
                <button 
                    onClick={() => window.open("https://raw.githubusercontent.com/NIXBLACK11/Tasks/refs/heads/main/cNFT-trader/test-collection.json", "_blank")}
                    className="flex items-center bg-[#512DA8] hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                >
                    [This is the json data of the NFT collection]
                    <FaExternalLinkAlt className="ml-2 text-white" />
                </button>
            </div>

            <div className="flex flex-col items-center">
                <button 
                    onClick={() => window.open("https://raw.githubusercontent.com/NIXBLACK11/Tasks/refs/heads/main/cNFT-trader/test-cnft.json", "_blank")}
                    className="flex items-center bg-[#512DA8] hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                >
                    [This is the json data of the cNFT]
                    <FaExternalLinkAlt className="ml-2 text-white" />
                </button>
            </div>
        </div>
    );
};
