import React from 'react';

import { Modal } from '@mui/material';
import { Box } from '@mui/system';

import { AuthtModalViewProps } from './types';

import Button from '../../button';
import { colors, fonts } from '../../../../utils';
import StyledInput from '../../input';
import { MainDiv, MainText, VerticalContentDiv } from './styledComponent';
import { ModalText, WarningText } from '../../text';
import {
    AUTHORIZATION,
    PASSWORD,
    RENAME_ACCOUNT,
    EXPORT_ACCOUNT,
    ACCOUNT_NAME,
} from '../../../../utils/app-content';

const { mainHeadingfontFamilyClass, subHeadingfontFamilyClass } = fonts;
const { darkBackground1 } = colors;

const AuthModalView: React.FunctionComponent<AuthtModalViewProps> = ({
    open,
    style,
    onClose,
    styledInput,
    btnCancel,
    btnConfirm,
    functionType,
    inputErrorState,
}) => {
    const HEADING =
        // eslint-disable-next-line no-nested-ternary
        functionType === 'RenameAccount'
            ? RENAME_ACCOUNT
            : functionType === 'ExportAccount'
            ? EXPORT_ACCOUNT
            : AUTHORIZATION;
    const LABEL = functionType === 'RenameAccount' ? ACCOUNT_NAME : PASSWORD;

    return (
        <Modal
            open={open}
            onClose={onClose}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Box sx={style} className="txDetails-modal-style auth-modal">
                <MainDiv>
                    <ModalText
                        textAlign="center"
                        marginTop="25px"
                        className={mainHeadingfontFamilyClass}
                    >
                        {HEADING}
                    </ModalText>

                    <VerticalContentDiv marginTop="15px" mb="20px">
                        <MainText
                            fontSize="14px"
                            marginBottom="15px"
                            className={mainHeadingfontFamilyClass}
                        >
                            {LABEL}
                        </MainText>

                        <StyledInput
                            id="auth-password"
                            fullWidth="80%"
                            mr="1.2rem"
                            typePassword={functionType !== 'RenameAccount'}
                            rightIcon={functionType !== 'RenameAccount'}
                            rightPosition="8px"
                            topPosition="28px"
                            {...styledInput}
                            style={{
                                paddingLeft: '10px !important',
                            }}
                            bgColor={darkBackground1}
                        />
                        <WarningText
                            className={subHeadingfontFamilyClass}
                            visibility={!!inputErrorState}
                        >
                            {inputErrorState}
                        </WarningText>
                    </VerticalContentDiv>

                    <div className="btn-row">
                        <Button id="cancel" {...btnCancel} lightBtn />
                        <Button id="confirm" {...btnConfirm} />
                    </div>
                </MainDiv>
            </Box>
        </Modal>
    );
};

export default AuthModalView;
