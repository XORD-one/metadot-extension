/* eslint-disable no-unused-vars */
/* eslint import/no-cycle: [2, { maxDepth: 1 }] */
import React from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';
import ContentCopyIcon from '../../../assets/images/icons/copyIcon.svg';
import {
  AccountName,
  Balance,
  ConnectionStatus,
  MainPanel,
  MoreOptions,
  PerUnitPrice,
  PublicAddress,
  VerticalContentDiv,
  CopyIconImg,
} from './StyledComponents';
import NotConnected from '../../../assets/images/notConnected.svg';
import { fonts, helpers } from '../../../utils';

const { addressModifier, trimBalance } = helpers;
const { mainHeadingfontFamilyClass, subHeadingfontFamilyClass } = fonts;

function MainCard({
  balance, address, tokenName, balanceInUsd, accountName,
}) {
  const [open, setOpen] = React.useState(false);

  const copyText = () => {
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 800);
    navigator.clipboard.writeText(address);

    toast.success('Copied!', {
      position: toast.POSITION.BOTTOM_CENTER,
      className: 'toast-success',
      progressClassName: 'success-progress-bar',
      autoClose: 2000,
      toastId: 1,
    });
  };

  const copyIconTooltipText = {
    className: 'tooltiptext',
    style: {
      maxWidth: '60px',
      left: '20%',
      bottom: '115%',
      fontSize: '0.65rem',
      fontWeight: 300,
    },
  };

  const addTooltipText = {
    className: 'topTooltiptext',
    style: {
      // width: '100%',
      // left: '320%',
      // padding: '0 4px',
      // fontSize: '0.8rem',
      // bottom: '115%',
      // fontWeight: 300,
    },
  };

  return (
    <MainPanel>
      <div>
        <MoreOptions>
          <img src={NotConnected} alt="not connected signal" />
          <ConnectionStatus className={subHeadingfontFamilyClass}>
            Not Connected
          </ConnectionStatus>
          <MoreVertIcon style={{ color: '#fafafa', fontSize: 22 }} />
        </MoreOptions>

        <AccountName className={mainHeadingfontFamilyClass}>
          {accountName}
        </AccountName>
      </div>
      <VerticalContentDiv>
        {/* <LightTooltip title={address} arrow placement="bottom"> */}
        <PublicAddress className={mainHeadingfontFamilyClass}>
          (
          {addressModifier(address)}
          )
        </PublicAddress>
        {/* </LightTooltip> */}
        <div className={`tooltip ${mainHeadingfontFamilyClass}`}>
          <CopyIconImg src={ContentCopyIcon} alt="copy-icon" onClick={copyText} />
          <span {...copyIconTooltipText}>Copy</span>
        </div>
      </VerticalContentDiv>

      <Balance className={mainHeadingfontFamilyClass}>
        <div className={`topTooltip ${mainHeadingfontFamilyClass}`}>
          <span>
            {trimBalance(balance)}
          </span>
          <span style={{ marginLeft: 7 }}>{tokenName}</span>
          <span {...addTooltipText}>
            {balance}
          </span>
        </div>
      </Balance>

      <VerticalContentDiv>
        <PerUnitPrice className={mainHeadingfontFamilyClass}>
          $
          {balanceInUsd}
          {' '}
          USD
        </PerUnitPrice>
      </VerticalContentDiv>
    </MainPanel>
  );
}

export default MainCard;
