export interface Props {
    name: string;
    amount: string;
    shortName: string;
    balanceInUsd: number;
    logo: string;
}

export interface ViewProps {
    tokenLogo: JSX.Element;
    chainName: string;
    AssetDetails: JSX.Element;
    apiInitializationStarts: boolean;
}
