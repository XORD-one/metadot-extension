import React from 'react';
import { useSelector } from 'react-redux';
import {
    Account,
    AccountCircle,
    AccountFlex,
    AccountMainText,
    AccountActiveText,
    AccountSubText,
    AccountText,
    DropDownContainer,
    DropDownIcon,
} from '../styles';
import { AccountCardInterface } from '../types';
import { fonts, images, helpers } from '../../../utils';
import { RootState } from '../../../redux/store';
import services from '../../../utils/services';

const { dropDownIcon, activeIcon } = images;
const { subHeadingfontFamilyClass, mainHeadingfontFamilyClass } = fonts;
const { addressMapper } = services;
const { addressModifier } = helpers;

const AccountCard: React.FunctionComponent<AccountCardInterface> = ({
    publicKey,
    accountName,
    parentAddress,
    activateAccount,
    openAccountDropDownHandler,
    marginTop,
}) => {
    const activeAccount = useSelector(
        (state: RootState) => state.activeAccount
    );

    return (
        <Account
            key={publicKey}
            marginBottom="10px"
            marginTop={marginTop || '10px'}
            onClick={() => activateAccount(publicKey, accountName)}
        >
            <AccountFlex>
                {activeAccount.publicKey ===
                    addressMapper(publicKey, activeAccount.prefix) && (
                    <img
                        style={{
                            position: 'relative',
                            left: '24px',
                            bottom: '8px',
                        }}
                        src={activeIcon}
                        alt="active-account-icon"
                    />
                )}
                <AccountCircle />
                <AccountText>
                    <AccountMainText className={mainHeadingfontFamilyClass}>
                        {accountName}
                    </AccountMainText>
                    <AccountActiveText>
                        {activeAccount.publicKey ===
                        addressMapper(publicKey, activeAccount.prefix)
                            ? '(Active)'
                            : ''}
                    </AccountActiveText>
                    <AccountSubText className={subHeadingfontFamilyClass}>
                        {addressModifier(publicKey)}
                    </AccountSubText>
                </AccountText>
            </AccountFlex>

            <DropDownContainer className={mainHeadingfontFamilyClass}>
                <DropDownIcon
                    onClick={(e) => {
                        e.stopPropagation();
                        openAccountDropDownHandler(
                            e,
                            publicKey,
                            accountName,
                            parentAddress
                        );
                    }}
                >
                    <img src={dropDownIcon} alt="3-dots" />
                </DropDownIcon>
            </DropDownContainer>
        </Account>
    );
};

export default AccountCard;
