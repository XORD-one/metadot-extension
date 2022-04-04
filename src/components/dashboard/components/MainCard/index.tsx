import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../../../redux/store';
import { MainCardPropsInterface } from '../../types';
import { fonts, helpers, images } from '../../../../utils';

import { setApiInitializationStarts } from '../../../../redux/slices/api';

import {
    AccountName,
    Balance,
    MainPanel,
    Refresh,
    PerUnitPrice,
    PublicAddress,
    VerticalContentDiv,
    CopyIconImg,
    MoreOptions,
    ConnectionStatus,
} from '../../styledComponents';
import services from '../../../../utils/services';

const { refreshIcon, ContentCopyIconWhite, notConnected, connected } = images;
const { addressModifier, trimBalance } = helpers;
const { mainHeadingfontFamilyClass, subHeadingfontFamilyClass } = fonts;
const { addressMapper } = services;

const MainCard: React.FunctionComponent<MainCardPropsInterface> = (
    props
): JSX.Element => {
    const { balance, address, prefix, tokenName, balanceInUsd, accountName } =
        props;

    const [open, setOpen] = useState(false);
    const [copy, setCopy] = useState('Copy');

    const dispatch = useDispatch();
    const { apiInitializationStarts } = useSelector(
        (state: RootState) => state.api
    );
    const {
        activeAccount: { isWalletConnected },
    } = useSelector((state: RootState) => state);
    const copyText = (): void => {
        setOpen(true);
        setTimeout(() => {
            setOpen(false);
        }, 800);
        navigator.clipboard.writeText(addressMapper(address, prefix));

        setCopy('Copied');
    };

    const copyIconTooltip = {
        id: 'copy-icon',
        className: `main-card-tooltip ${mainHeadingfontFamilyClass}`,
        onClick: copyText,
        onMouseOver: () => setCopy('Copy'),
        style: { cursor: 'pointer' },
    };

    const copyIconTooltipText = {
        className: 'main-card-tooltiptext',
        style: {
            maxWidth: '70px',
            left: '20%',
            bottom: '120%',
            fontSize: '11px',
            fontWeight: 300,
            transition: 'all 0.1s ease-in',
        },
    };

    const addTooltipText = {
        className: 'topTooltiptext',
    };

    return (
        <MainPanel>
            <div>
                <MoreOptions>
                    <img
                        src={isWalletConnected ? connected : notConnected}
                        alt="not connected signal"
                    />
                    <ConnectionStatus className={subHeadingfontFamilyClass}>
                        {isWalletConnected ? 'Connected' : 'Not Connected'}
                    </ConnectionStatus>
                </MoreOptions>
                <Refresh
                    id="refresh"
                    onClick={() => {
                        dispatch(setApiInitializationStarts(true));
                    }}
                >
                    <img src={refreshIcon} alt="refresh-icon" />
                </Refresh>

                <AccountName
                    id="account-name"
                    className={mainHeadingfontFamilyClass}
                >
                    {accountName}
                </AccountName>
            </div>
            <VerticalContentDiv>
                <PublicAddress
                    id="public-address"
                    className={mainHeadingfontFamilyClass}
                >
                    ({addressModifier(addressMapper(address, prefix))})
                </PublicAddress>
                <div {...copyIconTooltip}>
                    <CopyIconImg src={ContentCopyIconWhite} alt="copy-icon" />
                    <span {...copyIconTooltipText}>{copy}</span>
                </div>
            </VerticalContentDiv>

            {!apiInitializationStarts ? (
                <Balance id="balance" className={mainHeadingfontFamilyClass}>
                    <div className={`topTooltip ${mainHeadingfontFamilyClass}`}>
                        <span id="trim-balance">{trimBalance(balance)}</span>
                        <span id="token-name" style={{ marginLeft: 7 }}>
                            {tokenName}
                        </span>
                        <span id="complete-balance" {...addTooltipText}>
                            {balance}
                        </span>
                    </div>
                </Balance>
            ) : (
                <div
                    style={{
                        height: 35,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}
                >
                    <Balance
                        id="balance"
                        className="wave"
                        height="10px"
                        width="188px"
                        borderRadius="4px"
                    />
                </div>
            )}

            <VerticalContentDiv>
                <PerUnitPrice
                    id="balance-in-usd"
                    className={mainHeadingfontFamilyClass}
                >
                    ${balanceInUsd === 0 ? 0 : balanceInUsd.toFixed(5)}
                </PerUnitPrice>
            </VerticalContentDiv>
        </MainPanel>
    );
};

export default MainCard;
