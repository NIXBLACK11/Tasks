import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { Navbar } from "../components/Navbar"
import { TreeMint } from "../components/TreeMint"
import { NFTGrid } from "../components/NFTGrid"

export const User = () => {
    return (
        <div className='bg-[#0F0F10] min-h-screen min-w-screen flex flex-col overflow-x-hidden font-custom'>
            <div className='w-screen h-1/2 flex flex-col items-center pt-5 gap-2.5'>
                <Navbar />
                <WalletMultiButton className="wallet-button font-custom" />
                <TreeMint />
                <NFTGrid />
            </div>
        </div>
    )
}