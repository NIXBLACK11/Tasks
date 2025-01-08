import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import '@solana/wallet-adapter-react-ui/styles.css';
import './App.css'

import { useMemo } from 'react';
import { clusterApiUrl } from '@solana/web3.js';
import { TreeMint } from './components/TreeMint';
import { TransferNFT } from './components/TransferNFT';

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
					<div className='bg-black h-screen w-screen flex flex-col'>
						<div className='w-screen h-1/2 flex flex-col items-center pt-20 gap-2.5 bg-[#0A0A0A]'>
							<WalletMultiButton />
							<TreeMint />
						</div>
						<div className='w-screen h-1/2 flex flex-col items-center pt-20 gap-2.5 bg-[#0F0F10]'>
							<WalletMultiButton />
							<TransferNFT />
						</div>
					</div>
				</WalletModalProvider>
			</WalletProvider>
		</ConnectionProvider>
	)
}

export default App
