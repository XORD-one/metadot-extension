import React from 'react';

import { useSelector } from 'react-redux';

import SwapView from './view';
import SelectTokenModal from '../common/modals/selectToken';
import { Token } from '../common/modals/selectToken/types';
import { AuthModal } from '../common/modals';
import useDispatcher from '../../hooks/useDispatcher';

import { getSwapParams } from './swapCalculations';

import { setAuthScreenModal } from '../../redux/slices/modalHandling';
import { accounts } from '../../utils';

import { RootState } from '../../redux/store';

const { signTransaction, isPasswordSaved } = accounts;

const Swap: React.FunctionComponent = (): JSX.Element => {
    const generalDispatcher = useDispatcher();
    const currentState = useSelector((state: RootState) => state);
    const { balances, publicKey, tokenImage } = currentState.activeAccount;
    const api = currentState.api.api as unknown as any;
    const { authScreenModal } = currentState.modalHandling;

    // States
    const [tokenList, setTokenList] = React.useState<Token[]>([]);
    const [selectTokenModalState, setSelectTokenModalState] = React.useState({
        open: false,
        tokenType: 'tokenFrom',
    });
    const [tokenFrom, setTokenFrom] = React.useState<Token>();
    const [tokenTo, setTokenTo] = React.useState<Token>();
    const [savePassword, setSavePassword] = React.useState(false);
    const [passwordSaved, setPasswordSaved] = React.useState(false);
    const [amountFrom, setAmountFrom] = React.useState('0');

    const [swapParams, setSwapParams] = React.useState({
        path: [],
        inputAmount: 0,
        outputAmount: 0,
        priceImpact: 0,
        tradingFee: 0,
    });

    React.useEffect(() => {
        if (balances.length > 1) {
            if (!tokenFrom) setTokenFrom(balances[0]);
            if (!tokenTo) setTokenTo(balances[1]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [balances]);

    React.useEffect(() => {
        if (tokenFrom && tokenTo) {
            const TokenList = balances.filter((token) => {
                return (
                    token.name !== tokenFrom.name && token.name !== tokenTo.name
                );
            });
            setTokenList(TokenList);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokenFrom, tokenTo]);

    React.useEffect(() => {
        if (Object.keys(swapParams).length > 0) {
            console.log(
                'swap params input ===>>',
                swapParams.inputAmount.toString()
            );
            console.log(
                'swap params outputAmount ===>>',
                swapParams.outputAmount.toString()
            );
            console.log(
                'swap params priceImpact ===>>',
                swapParams.priceImpact.toString()
            );
            console.log(
                'swap params tradingFee ===>>',
                swapParams.tradingFee.toString()
            );
            console.log('swap params path ===>>', swapParams.path);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [swapParams]);

    React.useEffect(() => {
        isPasswordSaved(publicKey).then((res) => {
            setPasswordSaved(!res);
            setSavePassword(!res);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleOpen = (tokenType: string): void => {
        setSelectTokenModalState({
            open: true,
            tokenType,
        });
    };

    const handleClose = (): void => {
        setSelectTokenModalState({
            ...selectTokenModalState,
            open: false,
        });
    };

    const handleSelect = (token: Token): void => {
        if (selectTokenModalState.tokenType === 'tokenFrom')
            setTokenFrom(token);
        else {
            setTokenTo(token);
        }

        handleClose();
    };

    const handleCurrencySwitch = (): void => {
        const temp = tokenFrom;
        setTokenFrom(tokenTo);
        setTokenTo(temp);
    };

    const openAuthModal = (): void => {
        generalDispatcher(() => setAuthScreenModal(true));
    };

    const handleAmountChange = async (amount: string): Promise<void> => {
        if (tokenFrom && tokenTo) {
            setAmountFrom(amount);

            const SwapParams = await getSwapParams(
                api,
                tokenFrom,
                tokenTo,
                amount
            );

            setSwapParams(SwapParams);
        }
    };
    const handleSwap = async (
        address: string,
        password: string
    ): Promise<any> => {
        if (tokenFrom && tokenTo) {
            try {
                const nonce = await api.rpc.system.accountNextIndex(address);

                const decimals = tokenFrom.decimal;

                const path = swapParams.path.map((token: any) => {
                    return { TOKEN: token.name };
                });

                const supplyAmount = Number(amountFrom) * 10 ** decimals;

                const slippage = '0x0';

                const tx = api.tx.dex.swapWithExactSupply(
                    path,
                    supplyAmount,
                    slippage
                );

                const signer = api.createType('SignerPayload', {
                    method: tx,
                    nonce,
                    genesisHash: api.genesisHash,
                    blockHash: api.genesisHash,
                    runtimeVersion: api.runtimeVersion,
                    version: api.extrinsicVersion,
                });

                const txPayload: any = api.createType(
                    'ExtrinsicPayload',
                    signer.toPayload(),
                    { version: api.extrinsicVersion }
                );

                const txHex = txPayload.toU8a(true);

                const signature = await signTransaction(
                    address,
                    password,
                    txHex,
                    'substrate',
                    false
                );

                await tx.addSignature(address, signature, txPayload);

                await tx.send(({ status, events }: any) => {
                    console.log(status);
                });

                return tx;
            } catch (error) {
                console.log('swap transaction ==>>', error);
            }
        }

        return null;
    };

    return (
        <>
            <SwapView
                handleOpen={handleOpen}
                tokenFrom={tokenFrom as any}
                tokenTo={tokenTo as any}
                tokenImage={tokenImage}
                amountFrom={amountFrom}
                swapParams={swapParams}
                handleCurrencySwitch={handleCurrencySwitch}
                handleAmountChange={handleAmountChange}
                swapClickHandler={openAuthModal}
            />
            <SelectTokenModal
                open={selectTokenModalState.open}
                handleClose={handleClose}
                tokenList={tokenList}
                handleSelect={handleSelect}
                style={{
                    position: 'relative',
                    width: '326px',
                    height: '386px',
                    background: '#141414',
                    pb: 3,
                    overflowY: 'scroll',
                    overflowX: 'hidden',
                    marginBottom: '220px',
                }}
            />
            <AuthModal
                publicKey={publicKey}
                open={authScreenModal}
                handleClose={() => {
                    generalDispatcher(() => setAuthScreenModal(false));
                }}
                onConfirm={handleSwap}
                functionType={
                    passwordSaved ? 'PasswordSaved' : 'PasswordNotSaved'
                }
                savePassword={savePassword}
                setSavePassword={setSavePassword}
                style={{
                    width: '290px',
                    background: '#141414',
                    position: 'relative',
                    bottom: 30,
                    p: 2,
                    px: 2,
                    pb: 3,
                }}
            />
        </>
    );
};

export default Swap;
