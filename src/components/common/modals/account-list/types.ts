export interface Account {
    publicKey: string;
    accountName: string;
    parentAddress?: string;
}

export interface MyAccountsProps {
    open: boolean;
    handleClose(): void;
    style?: object;
    onSelection(v: Account): void;
}

export interface OptionRowPropsInterface {
    disabled?: boolean;
    className: string;
    onClick?(): void;
}

export interface PlainIconPropsInterface {
    bgColor?: string;
}
