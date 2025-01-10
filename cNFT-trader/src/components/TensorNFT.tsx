import { ListNFT } from "./ListNFT"

export const TensorNFT = () => {
    return (
        <div className="mt-10 flex justify-center items-center bg-black">
            <div className="grid grid-cols-3 gap-4 p-8">
                <div className="border p-4 rounded-lg bg-white shadow-md">
                    <ListNFT />
                </div>
                <div className="border p-4 rounded-lg bg-white shadow-md">
                    {/* <Nftmint /> */}
                </div>
                <div className="border p-4 rounded-lg bg-white shadow-md">
                    {/* <Nftmint /> */}
                </div>
            </div>
        </div>
    )
}