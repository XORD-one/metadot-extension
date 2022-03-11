import '@polkadot/api-augment';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { ApiPromise as ApiPromiseType } from '@polkadot/api';
import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { EventRecord } from '@polkadot/types/interfaces';

import { hexToU8a, isHex } from '@polkadot/util';

import { images } from '../../utils';
import { RootState } from '../../redux/store';
import accounts from '../../utils/accounts';
import services from '../../utils/services';
import { Wrapper as AuthWrapper } from '../common/wrapper';
import { WarningModal, AuthModal } from '../common/modals';
import {
    setAuthScreenModal,
    setIsResponseModalOpen,
    setConfirmSendModal,
} from '../../redux/slices/modalHandling';
import { DASHBOARD } from '../../constants';
import useDispatcher from '../../hooks/useDispatcher';
import useResponseModal from '../../hooks/useResponseModal';
import SendView from './view';

const { UnsuccessCheckIcon, SuccessCheckPngIcon } = images;

const { signTransaction } = accounts;

const errorMessages = {
    invalidAddress: 'Invalid address',
    enterAddress: 'Enter address',
    enterAmount: 'Enter amount',
};

const { getBalance, getTransactionFee } = services;

const Send: React.FunctionComponent = () => {
    const generalDispatcher = useDispatcher();
    const navigate = useNavigate();

    const [insufficientBal, setInsufficientBal] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [toAddressError, setToAddressError] = useState(false);
    const [isCorrect, setIsCorrect] = useState(true);
    const [transactionFee, setTransactionFee] = useState<number>(0);
    const [amount, setAmount] = useState<any>('');
    const [receiverAddress, setReceiverAddress] = useState('');
    const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
    const [subTextForWarningModal, setSubTextForWarningModal] = useState('abc');
    const [isInputEmpty, setIsInputEmpty] = useState(true);

    const currReduxState = useSelector((state: RootState) => state);
    const { activeAccount, modalHandling } = useSelector(
        (state: RootState) => state
    );

    const { publicKey, balance, tokenName } = activeAccount;
    const { authScreenModal } = modalHandling;
    const api = currReduxState.api.api as unknown as ApiPromiseType;

    const openResponseModalForTxFailed = useResponseModal({
        isOpen: true,
        modalImage: UnsuccessCheckIcon,
        mainText: 'Transaction Failed!',
        subText: '',
    });

    const openResponseModalForTxSuccess = useResponseModal({
        isOpen: true,
        modalImage: SuccessCheckPngIcon,
        mainText: 'Transaction Successful!',
        subText: '',
    });

    // Getting estimated Transaction fee
    useEffect(() => {
        async function get(): Promise<void> {
            const estimatedTxFee = await getTransactionFee(
                api,
                publicKey,
                publicKey,
                amount,
                tokenName
            );
            const txFeeWithFivePercentMargin =
                estimatedTxFee + estimatedTxFee / 5;
            setTransactionFee(txFeeWithFivePercentMargin);
        }
        get();
    });

    const maxInputHandler = async (): Promise<void> => {
        setInsufficientBal(false);
        const txFeeForMaxAmount = await getTransactionFee(
            api,
            publicKey,
            receiverAddress,
            amount,
            tokenName
        );
        setTransactionFee(txFeeForMaxAmount + txFeeForMaxAmount / 5);

        setAmount(balance - (txFeeForMaxAmount + txFeeForMaxAmount / 5));
        setIsInputEmpty(false);
    };

    const validateTxErrors = async (): Promise<[boolean, number]> => {
        const decimalPlaces = await api.registry.chainDecimals[0];

        const recipientBalance = await getBalance(api, receiverAddress);
        const senderBalance = balance;

        const txFee = await getTransactionFee(
            api,
            publicKey,
            receiverAddress,
            amount,
            tokenName
        );

        if (balance < Number(amount) + Number(txFee)) {
            setInsufficientBal(true);
            return [false, txFee];
        }

        const ED: number =
            Number(api.consts.balances.existentialDeposit.toString()) /
            10 ** decimalPlaces;

        if (Number(ED) > Number(recipientBalance + amount)) {
            // Show warning modal
            setSubTextForWarningModal(
                `The receiver have insufficient balance
                 to receive the transaction.
                 Do you still want to confirm?`
            );
            setIsWarningModalOpen(true);
            return [false, txFee];
        }
        if (
            Number(senderBalance) - Number(amount) - Number(txFee) <
            Number(ED)
        ) {
            console.log('Reap the account');
            setSubTextForWarningModal('The sender account might get reaped');
            setIsWarningModalOpen(true);
            return [false, txFee];
        }
        return [true, txFee];
    };

    const doTransaction = async (
        address = '',
        password = ''
    ): Promise<boolean> => {
        try {
            const decimalPlaces = await api.registry.chainDecimals[0];
            const decimals: number = decimalPlaces;

            setLoading2(true);

            const amountSending = amount * 10 ** decimals;

            const tx = api.tx.balances.transfer(
                receiverAddress as string,
                BigInt(amountSending)
            );

            const nonce = await api.rpc.system.accountNextIndex(address);
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
            let signature;
            try {
                signature = await signTransaction(address, password, txHex);
            } catch (err) {
                setLoading2(false);
                throw new Error('Invalid Password!');
            }
            tx.addSignature(address, signature, txPayload);
            await tx
                .send(({ status, events }) => {
                    const txResSuccess = events.filter(
                        ({ event }: EventRecord) =>
                            api.events.system.ExtrinsicSuccess.is(event)
                    );
                    const txResFail = events.filter(({ event }: EventRecord) =>
                        api.events.system.ExtrinsicFailed.is(event)
                    );
                    if (status.isInBlock) {
                        if (txResFail.length >= 1) {
                            setLoading2(false);
                            generalDispatcher(() => setConfirmSendModal(false));
                            openResponseModalForTxFailed();
                            setTimeout(() => {
                                generalDispatcher(() =>
                                    setIsResponseModalOpen(false)
                                );
                            }, 4000);
                            // navigate to dashboard on success
                            navigate(DASHBOARD);
                        }
                        if (txResSuccess.length >= 1) {
                            setLoading2(false);
                            generalDispatcher(() => setConfirmSendModal(false));
                            openResponseModalForTxSuccess();
                            setTimeout(() => {
                                generalDispatcher(() =>
                                    setIsResponseModalOpen(false)
                                );
                            }, 2000);
                            navigate(DASHBOARD);
                        }
                    }
                })
                .then((res) => {
                    console.log('Res', res);
                })
                .catch((err) => {
                    console.log('Error =====>>>', err);
                    console.log('Tx hash', tx.hash.toHex());
                    setLoading2(false);
                    generalDispatcher(() => setConfirmSendModal(false));
                    openResponseModalForTxFailed();
                    setTimeout(() => {
                        generalDispatcher(() => setIsResponseModalOpen(false));
                    }, 4000);
                    // navigate to dashboard on success
                    navigate(DASHBOARD);
                    return false;
                });
            return true;
        } catch (err) {
            return false;
        }
    };

    const isValidAddressPolkadotAddress = (address: string): boolean => {
        try {
            encodeAddress(
                isHex(address) ? hexToU8a(address) : decodeAddress(address)
            );
            setIsCorrect(true);
            return true;
        } catch (err) {
            setIsCorrect(false);
            return false;
        }
    };

    const validateInputValues = (address: string): boolean => {
        if (Number(balance) < Number(amount) + Number(transactionFee)) {
            setInsufficientBal(true);
            throw new Error('Insufficient funds');
        }

        if (!isValidAddressPolkadotAddress(address)) return false;

        return true;
    };

    const SendTx = (txFee: number): void => {
        setTransactionFee(txFee);
        setLoading1(false);
        setIsWarningModalOpen(false);
        generalDispatcher(() => setConfirmSendModal(true));
    };

    const handleSubmit = async (): Promise<void> => {
        console.log('Handle submit working');
        try {
            setLoading1(true);
            if (!validateInputValues(receiverAddress)) {
                throw new Error('An error occurred');
            }
            const isTxValid = await validateTxErrors();
            console.log('is tx valid', isTxValid);
            if (isTxValid[0]) {
                const txFee = await getTransactionFee(
                    api,
                    publicKey,
                    receiverAddress,
                    amount,
                    tokenName
                );

                console.log('tx fee');
                setTransactionFee(txFee);
                setLoading1(false);
                SendTx(isTxValid[1]);
                // checking if balance is enough
                // to send the amount with network fee
                if (balance < Number(amount) + Number(txFee)) {
                    console.log('In second if');
                    setInsufficientBal(true);
                } else {
                    console.log('In first else');
                    generalDispatcher(() => setConfirmSendModal(true));
                }
            } else {
                setLoading1(false);
            }
        } catch (err) {
            console.log('In catch', err);
            setLoading1(false);
        }
    };

    const toInput = {
        isCorrect,
        errorMessages,
        onChange: (e: string): void => {
            setIsCorrect(true);
            setToAddressError(false);
            setReceiverAddress(e);
        },
        receiverAddress,
    };

    const amountInput = {
        onChange: (e: string): boolean => {
            // if (amount > e) setAmount(e);
            if (e[0] && e[1] === '0') return false;
            if (e.length < 14) {
                let decimalInStart = false;
                if (e[0] === '.') {
                    // eslint-disable-next-line no-param-reassign
                    e = `0${e}`;
                    decimalInStart = true;
                }
                const reg = /^-?\d+\.?\d*$/;
                const test = reg.test(e);

                if (!test && e.length !== 0 && !decimalInStart) {
                    return false;
                }
                if (Number(e) + transactionFee >= balance) {
                    setInsufficientBal(true);
                    // return false;
                }
                setInsufficientBal(false);
                if (e.length === 0) {
                    setAmount(e);
                    setIsInputEmpty(true);
                } else {
                    setAmount(e);
                    setIsInputEmpty(false);
                }
                return true;
            }
            return false;
        },
        maxInputHandler,
        insufficientBal,
        errorMessages,
        transactionFee,
        amount,
    };

    const nextBtn = {
        id: 'send-next',
        text: 'Next',
        style: {
            width: '100%',
            height: 50,
            borderRadius: 40,
        },
        handleClick: handleSubmit,
        disabled:
            loading1 ||
            isInputEmpty ||
            receiverAddress.length === 0 ||
            toAddressError,
        isLoading: loading1,
    };

    const confirmSend = {
        accountTo: receiverAddress,
        amount,
        transactionFee,
        handleClose: () => generalDispatcher(() => setConfirmSendModal(false)),
        loading2,
    };

    const warningModal = {
        open: isWarningModalOpen,
        handleClose: () => setIsWarningModalOpen(false),
        onConfirm: () => SendTx(transactionFee),
        style: {
            width: '290px',
            background: '#141414',
            position: 'relative',
            bottom: 30,
            p: 2,
            px: 2,
            pb: 3,
        },
        mainText: 'Existential Deposit Warning',
        subText: subTextForWarningModal,
    };

    return (
        <AuthWrapper>
            <SendView
                toInput={toInput}
                amountInput={amountInput}
                confirmSend={confirmSend}
                nextBtn={nextBtn}
            />
            <AuthModal
                publicKey={publicKey}
                open={authScreenModal}
                handleClose={() => {
                    generalDispatcher(() => setAuthScreenModal(false));
                    generalDispatcher(() => setConfirmSendModal(true));
                }}
                onConfirm={doTransaction}
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
            <WarningModal {...warningModal} />
        </AuthWrapper>
    );
};

export default Send;
