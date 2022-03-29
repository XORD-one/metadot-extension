import React, { useState } from 'react';
import {
    LabelAndTextWrapper,
    UnAuthScreensContentWrapper,
    VerticalContentDiv,
} from '../../common/wrapper';
import { Input, Button } from '../../common';
import { SubHeading, WarningText } from '../../common/text';
import { fonts } from '../../../utils';
import {
    PARENT_PASSWORD_PLACEHOLDER,
    PASSWORD,
    DERIVE_PATH,
    CONTINUE_BUTTON,
} from '../../../utils/app-content';
import AccountCard from './account-card';
import { ParentMetaDataInterface } from '../types';

const { mainHeadingfontFamilyClass, subHeadingfontFamilyClass } = fonts;

const ParentMetaData: React.FunctionComponent<ParentMetaDataInterface> = ({
    address,
    accountName,
    derivePath,
    setDerivePath,
    password,
    setPassword,
    validateAccount,
    derivePathValidation,
    isLoading,
    setIsLoading,
    setStep,
    setDeriveAddress,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [derivePathError, setDerivePathError] = useState('');

    const passwordErrorMessages = {
        wrongPassword: 'Wrong Password',
    };

    const { wrongPassword } = passwordErrorMessages;

    const clickHandler = async (): Promise<void> => {
        try {
            const accountValid = await validateAccount(address, password);

            if (!accountValid) {
                setPasswordError(wrongPassword);
                setIsLoading(false);
                return;
            }

            const derivedAccount = await derivePathValidation(
                address,
                derivePath,
                password
            );

            setDeriveAddress(derivedAccount.address);
            setIsLoading(false);
            setStep(2);
        } catch (err: any) {
            setIsLoading(false);
            const errMessage = err.message;
            if (errMessage === 'invalid derivation path') {
                setDerivePathError(
                    `Invalid derivation path 
                    , add // for Hard derivation and /
                     for Soft derivation`
                );
            }
        }
    };

    const styledInputPassword = {
        placeholder: PARENT_PASSWORD_PLACEHOLDER,
        className: subHeadingfontFamilyClass,
        value: password,
        height: '15px',
        onChange: (t: string) => {
            setPasswordError('');
            return setPassword(t);
        },
        hideHandler: () => setShowPassword(!showPassword),
        hideState: showPassword,
    };

    const styledInputDerivePath = {
        className: subHeadingfontFamilyClass,
        placeholder: '//hard/soft',
        height: '15px',
        value: `${derivePath}`,
        onChange: (t: string) => {
            setDerivePathError('');
            setDerivePath(t);
        },
    };

    const btn = {
        text: CONTINUE_BUTTON,
        style: {
            width: '100%',
            height: 50,
            borderRadius: 40,
        },
        disabled: !(derivePath && password) && true,
        handleClick: async () => {
            setIsLoading(true);
            await clickHandler();
        },
        isLoading,
    };

    return (
        <VerticalContentDiv
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'column',
                height: '520px',
            }}
        >
            <UnAuthScreensContentWrapper mb="0px">
                <AccountCard publicKey={address} accountName={accountName} />
                <LabelAndTextWrapper marginTop="10px">
                    <SubHeading
                        className={mainHeadingfontFamilyClass}
                        marginTop="0px"
                        mb="10px"
                    >
                        {PASSWORD}
                    </SubHeading>
                    <Input
                        id="password"
                        {...styledInputPassword}
                        typePassword
                        isCorrect
                        rightIcon
                        rightPosition="24px"
                        topPosition="27px"
                    />
                    {passwordError === wrongPassword && (
                        <WarningText
                            id="warning-text-1"
                            mb="10px"
                            visibility={passwordError === wrongPassword}
                            className={subHeadingfontFamilyClass}
                            style={{ marginTop: '2px' }}
                        >
                            {wrongPassword}
                        </WarningText>
                    )}
                </LabelAndTextWrapper>
                <LabelAndTextWrapper>
                    <SubHeading
                        className={mainHeadingfontFamilyClass}
                        marginTop="20px"
                        mb="10px"
                    >
                        {DERIVE_PATH}
                    </SubHeading>
                    <Input
                        id="derive-path"
                        isCorrect
                        {...styledInputDerivePath}
                    />
                    {derivePathError && (
                        <WarningText
                            id="warning-text"
                            className={subHeadingfontFamilyClass}
                            visibility
                        >
                            {derivePathError}
                        </WarningText>
                    )}
                </LabelAndTextWrapper>
            </UnAuthScreensContentWrapper>

            <Button id="auth-continue" {...btn} />
        </VerticalContentDiv>
    );
};

export default ParentMetaData;
