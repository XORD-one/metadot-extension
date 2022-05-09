export interface ImportLinkInterface {
    color?: string;
}

export interface AccountInterface {
    address: string;
    name?: string;
    err: boolean;
    errMessage: string;
    accountFromMetadot?: boolean;
}
export interface MultisigViewProps {
    accountList: AccountInterface[];
    onChangeAddress(index: number, value: string): void;
    addAccount(): void;
    onRemoveAccount(index: number): void;
    handleOpenModal(index: number): void;
    onSubmit(): void;
}

export interface AccountBoxProps {
    name: string;
    address: string;
}
