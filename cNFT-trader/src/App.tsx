import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo } from 'react';

import '@solana/wallet-adapter-react-ui/styles.css';
import './App.css'
import './wallet.css'

import { Market } from './pages/Market';
import { User } from './pages/User';

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
					<Router>
						<Routes>
							<Route path="/" element={<User />} />
							<Route path="/market" element={<Market />} />
						</Routes>
					</Router>
				</WalletModalProvider>
			</WalletProvider>
		</ConnectionProvider>
	)
}

export default App
