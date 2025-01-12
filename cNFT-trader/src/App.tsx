import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import '@solana/wallet-adapter-react-ui/styles.css';
import './App.css'
import './wallet.css'

import { useMemo } from 'react';
import { clusterApiUrl } from '@solana/web3.js';
import { TreeMint } from './components/TreeMint';
import { Navbar } from './components/Navbar';
import { NFTGrid } from './components/NFTGrid';

function App() {
	const network = WalletAdapterNetwork.Devnet;

		const endpoint = useMemo(() => clusterApiUrl(network), [network]);
 
		const wallets = useMemo(
			() => [],
			[network]
		);
	return (
		<ConnectionProvider endpoint={endpoint}>
			<WalletProvider wallets={wallets} autoConnect>
				<WalletModalProvider>
					<div className='bg-[#0F0F10] min-h-screen min-w-screen flex flex-col overflow-x-hidden font-custom'>
						<div className='w-screen h-1/2 flex flex-col items-center pt-5 gap-2.5 bg-black'>
							<Navbar />
							<WalletMultiButton className="wallet-button font-custom" />
							<TreeMint />
							<NFTGrid />
						</div>
					</div>
				</WalletModalProvider>
			</WalletProvider>
		</ConnectionProvider>
	)
}

export default App
