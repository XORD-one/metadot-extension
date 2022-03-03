import type { KeyringPair } from '@polkadot/keyring/types';

type Sender = KeyringPair | string;

export interface AuthtModalProps {
    open: boolean;
    handleClose(e?: any): void;
    style?: object;
    onConfirm(publicKey: string, password: string): Promise<boolean>;
    publicKey: string;
    setOpenAuthModalHandler?(): void;
}

export interface AuthtModalViewProps {
    style?: object;
    open: boolean;
    onClose(): void;
    styledInput?: any;
    passwordError?: string;
    btnCancel?: any;
    btnConfirm?: any;
}