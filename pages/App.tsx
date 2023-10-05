// App.tsx
import React, { useMemo } from 'react';
import { useWallet, WalletProvider } from '@tronweb3/tronwallet-adapter-react-hooks';
import { WalletModalProvider } from '@tronweb3/tronwallet-adapter-react-ui';
import { WalletDisconnectedError, WalletError, WalletNotFoundError } from '@tronweb3/tronwallet-abstract-adapter';
import { TronLinkAdapter, LedgerAdapter } from '@tronweb3/tronwallet-adapters';
import SignDemo from './SignDemo';

function App() {
    function onError(e: WalletError) {
        if (e instanceof WalletNotFoundError) {
            // some alert for wallet not found
        } else if (e instanceof WalletDisconnectedError) {
            // some alert for wallet not connected
        } else {
            console.error(e.message);
        }
    }
    const adapters = useMemo(function () {
        const tronLink = new TronLinkAdapter();
        const ledger = new LedgerAdapter({
            accountNumber: 2,
        });
        return [tronLink, ledger];
    }, []);
    return (
        <WalletProvider onError={onError} adapters={adapters}>
            <WalletModalProvider>
                <SignDemo />
            </WalletModalProvider>
        </WalletProvider>
    );
}

export default App;