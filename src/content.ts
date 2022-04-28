import type { Message } from 'metadot-extension-base/types';
import {
    MESSAGE_ORIGIN_CONTENT,
    MESSAGE_ORIGIN_PAGE,
    PORT_CONTENT,
} from 'metadot-extension-base/defaults';
import { chrome } from '@polkadot/extension-inject/chrome';

// connect to the extension
const port = chrome.runtime.connect({ name: PORT_CONTENT });

// send any messages from the extension back to the page
port.onMessage.addListener((data): void => {
    window.postMessage({ ...data, origin: MESSAGE_ORIGIN_CONTENT }, '*');
});

// all messages from the page, pass them to the extension
window.addEventListener('message', ({ data, source }: Message): void => {
    if (source !== window || data.origin !== MESSAGE_ORIGIN_PAGE) {
        return;
    }

    port.postMessage(data);
});

// inject our data injector
const script = document.createElement('script');

script.src = chrome.runtime.getURL('page.js');

script.onload = (): void => {
    // remove the injecting tag when loaded
    if (script.parentNode) {
        script.parentNode.removeChild(script);
    }
};

(document.head || document.documentElement).appendChild(script);
