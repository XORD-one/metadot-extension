import '@polkadot/extension-inject/crossenv';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import type {
    RequestSignatures,
    TransportRequestMessage,
} from 'metadot-extension-base/background/types';

import handlers from 'metadot-extension-base/background/handlers';
import { PORT_CONTENT, PORT_EXTENSION } from 'metadot-extension-base/defaults';
import { AccountsStore } from 'metadot-extension-base/stores';
import { chrome } from '@polkadot/extension-inject/chrome';
import keyring from '@polkadot/ui-keyring';
import { assert } from '@polkadot/util';

// listen to all messages and handle appropriately
chrome.runtime.onConnect.addListener((port): void => {
    chrome.storage.local.set({ setIsWalletConncted: 'true' }, function () {
        console.log(`setIsWalletConncted is set to true`);
    });
    assert(
        [PORT_CONTENT, PORT_EXTENSION].includes(port.name),
        `Unknown connection from ${port.name}`
    );

    // message and disconnect handlers
    port.onMessage.addListener(
        (data: TransportRequestMessage<keyof RequestSignatures>) => {
            handlers(data, port);
        }
    );
    port.onDisconnect.addListener(() => {
        console.log(`Disconnected from ${port.name}`);
        chrome.storage.local.set({ setIsWalletConncted: 'false' }, function () {
            console.log(`setIsWalletConncted is set to false`);
        });
    });
});

// initialization crypto and keyring
cryptoWaitReady()
    .then((): void => {
        keyring.loadAll({ store: new AccountsStore(), type: 'sr25519' });
    })
    .catch((error): void => {
        console.error('initialization failed', error);
    });
