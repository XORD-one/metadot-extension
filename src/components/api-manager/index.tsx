import React, { useEffect, memo } from 'react';
import { useSelector } from 'react-redux';
import type { ApiPromise as ApiPromiseType } from '@polkadot/api';

import { formatBalance } from '@polkadot/util';
import { setApi, setApiInitializationStarts } from '../../redux/slices/api';
import {
    setBalance,
    setBalanceInUsd,
    setTokenName,
    setWalletConnected,
} from '../../redux/slices/activeAccount';
import { setIsResponseModalOpen } from '../../redux/slices/modalHandling';
import { RootState } from '../../redux/store';

import { helpers, images } from '../../utils';
import services from '../../utils/services';
import useResponseModal from '../../hooks/useResponseModal';
import useDispatcher from '../../hooks/useDispatcher';
import { getAuthList } from '../../messaging';
import { addTransaction } from '../../redux/slices/transactions';

const { wifiOff, SuccessCheckIcon } = images;

const ApiManager: React.FunctionComponent<{ rpc: string }> = ({ rpc }) => {
    const setIsWalletConnected = localStorage.getItem('setIsWalletConnected');
    const currentUser = useSelector((state: RootState) => state);
    const openModal = useResponseModal({
        isOpen: true,
        modalImage: SuccessCheckIcon,
        mainText: 'Successfully Converted!',
        subText: '',
    });
    const openModalForInternetIssue = useResponseModal({
        isOpen: true,
        modalImage: wifiOff,
        mainText: 'Internet is down!',
        subText: '',
    });
    const generalDispatcher = useDispatcher();

    const { activeAccount, modalHandling } = currentUser;

    const api = currentUser.api.api as ApiPromiseType;
    const { loadingForApi } = modalHandling;

    const { convertIntoUsd } = helpers;
    const { getBalance, providerInitialization, addressMapper } = services;
    const { publicKey, chainName, tokenName } = activeAccount;

    const compareSites = (arr: any, sub: any): any => {
        const sub2 = sub.toLowerCase();
        return arr.filter((str: any) =>
            str
                .toLowerCase()
                .startsWith(sub2.slice(0, Math.max(str.length - 1, 1)))
        );
    };

    useEffect(() => {
        const setConnectedSites = async (): Promise<void> => {
            const arr: string[] = [];
            const res: any = await getAuthList();
            chrome.tabs.query(
                { active: true, lastFocusedWindow: true },
                (tabs) => {
                    const { url } = tabs[0];
                    Object.values(res.list).map((site: any): boolean => {
                        if (site.isAllowed) {
                            arr.push(site.url);
                        }
                        return true;
                    });
                    const isAllowed = compareSites(arr, url);
                    if (isAllowed.length === 0)
                        generalDispatcher(() => setWalletConnected(false));
                    else generalDispatcher(() => setWalletConnected(true));
                }
            );
        };
        setConnectedSites();
    }, [setIsWalletConnected]);

    useEffect(() => {
        const setAPI = async (rpcUrl: string): Promise<void> => {
            try {
                generalDispatcher(() => setApiInitializationStarts(true));

                if (window.navigator.onLine) {
                    // setting api instance of selected network
                    const newApiInstance = await providerInitialization(rpcUrl);

                    // getting token name
                    const tokenNameofSelectedNetwork = await newApiInstance
                        .registry.chainTokens[0];

                    // getting token balance
                    const balanceOfSelectedNetwork = await getBalance(
                        newApiInstance,
                        publicKey
                    );

                    // getting token balance in usd
                    const dollarAmount = await convertIntoUsd(
                        tokenNameofSelectedNetwork,
                        balanceOfSelectedNetwork
                    );
                    await newApiInstance.isReady;
                    generalDispatcher(() => setBalanceInUsd(dollarAmount));

                    generalDispatcher(() => setApi(newApiInstance));

                    generalDispatcher(() => setApiInitializationStarts(false));
                    generalDispatcher(() =>
                        setTokenName(tokenNameofSelectedNetwork)
                    );
                    generalDispatcher(() =>
                        setBalance(balanceOfSelectedNetwork)
                    );

                    if (loadingForApi) {
                        openModal();
                        setTimeout(() => {
                            generalDispatcher(() =>
                                setIsResponseModalOpen(false)
                            );
                        }, 2500);
                    }
                } else {
                    openModalForInternetIssue();

                    setTimeout(() => {
                        generalDispatcher(() => setIsResponseModalOpen(false));
                    }, 2500);

                    setTimeout(() => {
                        generalDispatcher(() =>
                            setApiInitializationStarts(false)
                        );
                    }, 2000);
                }
            } catch (error) {
                console.log('In catch api manager', error);
            }
        };

        setAPI(rpc);
    }, [chainName, loadingForApi, rpc]);

    useEffect(() => {
        generalDispatcher(() => setApiInitializationStarts(true));
        const accountChanged = async (): Promise<void> => {
            // getting token balance
            const balanceOfSelectedNetwork = await getBalance(api, publicKey);
            // getting token balance in usd
            const dollarAmount = await convertIntoUsd(
                tokenName,
                balanceOfSelectedNetwork
            );
            generalDispatcher(() => setBalanceInUsd(dollarAmount));
            generalDispatcher(() => setBalance(balanceOfSelectedNetwork));

            generalDispatcher(() => setApiInitializationStarts(false));
        };
        accountChanged();
    }, [publicKey]);

    useEffect(() => {
        let unsub: any;
        let unsub2: any;
        (async () => {
            if (api) {
                const decimals = api?.registry?.chainDecimals[0];

                unsub = await api.query.system.account(
                    publicKey,
                    ({ data: balance }) => {
                        generalDispatcher(() =>
                            setBalance(Number(balance.free) / 10 ** decimals)
                        );
                    }
                );

                unsub2 = await api.rpc.chain.subscribeNewHeads(
                    async (header) => {
                        const signedBlock = await api.rpc.chain.getBlock(
                            header.hash
                        );
                        const apiAt = await api.at(header.hash);
                        const allEvents = await apiAt.query.system.events();

                        const transactions: any = [];
                        signedBlock.block.extrinsics.forEach(
                            (extrinsic, index) => {
                                allEvents
                                    .filter(
                                        ({ event, phase }: any) =>
                                            phase.isApplyExtrinsic &&
                                            phase.asApplyExtrinsic.eq(index) &&
                                            event.section === 'balances' &&
                                            event.method === 'Transfer' &&
                                            (event.data[0].toString() ===
                                                addressMapper(
                                                    publicKey,
                                                    api.registry
                                                        .chainSS58 as number
                                                ) ||
                                                event.data[1].toString() ===
                                                    addressMapper(
                                                        publicKey,
                                                        api.registry
                                                            .chainSS58 as number
                                                    ))
                                    )
                                    .forEach(({ event }: any) => {
                                        transactions.push({
                                            accountFrom:
                                                event.data[0].toString(),
                                            accountTo: event.data[1].toString(),
                                            amount: formatBalance(
                                                event.data[2],
                                                {
                                                    decimals:
                                                        api.registry
                                                            .chainDecimals[0],
                                                    forceUnit: '-',
                                                    withUnit: false,
                                                }
                                            ),
                                            hash: extrinsic.hash.toString(),
                                            operation:
                                                event.data[0].toString() ===
                                                addressMapper(
                                                    publicKey,
                                                    api.registry
                                                        .chainSS58 as number
                                                )
                                                    ? 'Send'
                                                    : 'Receive',
                                            status: 'Confirmed',
                                            chainName:
                                                api.runtimeChain.toString(),
                                            tokenName:
                                                api.registry.chainTokens[0],
                                            transactionFee: '0',
                                            timestamp: Date.now(),
                                        });
                                    });
                            }
                        );

                        generalDispatcher(() => addTransaction(transactions));
                    }
                );
            }
        })();

        return () => {
            if (unsub) {
                unsub();
            }
            if (unsub2) {
                unsub2();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [api, publicKey]);

    return null;
};

export default memo(ApiManager);
