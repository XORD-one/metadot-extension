/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { toast } from 'react-toastify';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import {
  CopyText, IndexText, SeedText, SeedWrapper,
} from './StyledComponents';

import {
  AuthWrapper,
  Header,
  Button,
  MainHeading,
  SubHeading,
  SubMainWrapperForAuthScreens,
  WarningModal,
} from '../../../components';

import { fonts } from '../../../utils';

import { GenerateSeedPhrase } from '../../../ToolBox/accounts';

import { resetAccountSlice, setSeed } from '../../../redux/slices/account';

const { mainHeadingfontFamilyClass, subHeadingfontFamilyClass } = fonts;

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    // backgroundColor: theme.palette.common.white,
    backgroundColor: '#860040',
    // color: 'rgba(0, 0, 0, 0.87)',
    color: '#fff',
    boxShadow: theme.shadows[1],
    fontSize: 11,
    zIndex: -2,
  },
  [`& .${tooltipClasses.arrow}`]: {
    // color: theme.palette.common.white,
    color: '#860040',
  },
}));

function ShowSeed() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { seed } = useSelector((state) => state.account);

  const dispatch = useDispatch();

  // C
  const [open, setOpen] = React.useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  // generate new seed for parent account
  useEffect(() => {
    try {
      if (!seed) {
      // checking whether seed needs to be created or not
        const newSeed = GenerateSeedPhrase();

        dispatch(setSeed(newSeed)); // store newSeed in redux
      }
    } catch (error) {
      console.log('ERROR while generating new seed for parent account', error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const SinglePhrase = ({ index, phrase }) => (
    <SeedWrapper>
      <IndexText className={mainHeadingfontFamilyClass}>
        {index + 1}
      </IndexText>
      <SeedText className={mainHeadingfontFamilyClass}>{phrase}</SeedText>
    </SeedWrapper>
  );

  const copySeedText = () => {
    console.log('Helloooo', seed);
    navigator.clipboard.writeText(seed);

    toast.success('Copied!', {
      position: toast.POSITION.BOTTOM_CENTER,
      className: 'toast-success',
      progressClassName: 'success-progress-bar',
      autoClose: 2000,
      toastId: 1,
    });
  };

  return (
    <AuthWrapper>
      <Header
        centerText="Seed Phrase"
        backHandler={() => dispatch(resetAccountSlice())}
      />
      <div>
        <MainHeading className={mainHeadingfontFamilyClass}>
          Write down your seed phrase
        </MainHeading>
        <SubHeading className={subHeadingfontFamilyClass}>
          Please write the mnemonic down in order to ensure the backup is
          correct.
          {/* Obtaining mnemonic is equivalent to owning wallet assets.
          Dont take screenshots or copy, otherwise it may cause asset loss */}
        </SubHeading>
      </div>
      {/* <HorizontalContentDiv> */}
      <CopyText className={subHeadingfontFamilyClass}>
        Copy Seed Phrase
        <span width="100px" style={{ width: '200px', visibility: 'hidden' }}>A</span>
        <LightTooltip title="Copy address" arrow placement="right">
          <ContentCopyIcon
            style={{
              fontSize: '0.7rem', marginRight: 10, marginTop: 2,
            }}
            onClick={copySeedText}
          />
        </LightTooltip>
      </CopyText>
      {/* </HorizontalContentDiv> */}
      <SubMainWrapperForAuthScreens>
        {seed
          && seed
            .split(' ')
            .map((phrase, i) => (
              <SinglePhrase index={i} key={phrase} phrase={phrase} />
            ))}
      </SubMainWrapperForAuthScreens>
      <div className="btn-wrapper">
        <Button
          width="60%"
          height="40px"
          text="Continue"
          handleClick={() => setIsModalOpen(true)}
        />
      </div>
      <WarningModal
        open={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        style={{
          width: '78%',
          background: '#141414',
          p: 2,
          px: 2,
          pb: 3,
        }}
      />
    </AuthWrapper>
  );
}

export default ShowSeed;
