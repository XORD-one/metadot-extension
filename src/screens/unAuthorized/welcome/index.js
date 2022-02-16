/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import AddSharpIcon from '../../../assets/images/icons/add.svg';
import DownloadIcon from '../../../assets/images/icons/download.svg';

import AppLogo from '../../../assets/images/logo.svg';
import metaDot from '../../../assets/images/metadot.svg';
import { AuthWrapper, Button } from '../../../components';

import { MainHeading, SubHeading } from './styledComponents';
import { fonts } from '../../../utils';
import accounts from '../../../utils/accounts';
import './index.css';
import { setAccountCreationStep, setTempSeed } from '../../../redux/slices/activeAccount';

const { subHeadingfontFamilyClass } = fonts;
const { GenerateSeedPhrase } = accounts;

function Welcome() {
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    jsonFileUploadScreen,
    tempSeed,
    accountCreationStep,
  } = useSelector((state) => state.activeAccount);

  const [seedToPass, setSeedToPass] = useState('');

  console.log('location on welcome.js ============>>>', { jsonFileUploadScreen });

  // generate new seed for parent account
  useEffect(() => {
    try {
      const newSeed = GenerateSeedPhrase();
      setSeedToPass(newSeed);
    } catch (error) {
      console.log('ERROR while generating new seed for parent account', error);
    }
  }, [dispatch]);

  const btnCreate = {
    text: 'Create',
    width: '270px',
    StartIcon: AddSharpIcon,
    handleClick: () => {
      dispatch(setTempSeed(seedToPass));
      dispatch(setAccountCreationStep(1));
      history.push({
        pathname: '/ShowSeed',
        state: { seedToPass },
      });
    },
  };

  const btnImport = {
    text: 'Import',
    width: '270px',
    StartIcon: DownloadIcon,
    handleClick: () => {
      history.push({
        pathname: '/ImportWallet',
        state: { seedToPass },
      });
    },
  };

  const divProps = {
    className: 'btn-wrapper',
    style: { marginLeft: '0', marginBottom: 0 },
  };

  if (accountCreationStep === 1 && tempSeed.length) {
    history.push({
      pathname: '/ShowSeed',
      state: { seedToPass: tempSeed },
    });
    return null;
  }
  if (accountCreationStep === 2 && tempSeed.length) {
    history.push({
      pathname: '/ConfirmSeed',
      state: { seedToPass: tempSeed },
    });
    return null;
  }
  if (accountCreationStep === 3 && tempSeed.length) {
    history.push({
      pathname: '/createWallet',
      state: { seedToPass: tempSeed },
    });
    return null;
  }
  if (jsonFileUploadScreen) {
    history.push('/ImportWallet');
    return null;
  }
  return (
    <AuthWrapper>
      <div className="app-logo1">
        <img src={AppLogo} alt="logo" />
      </div>

      <div className="main-content">
        <MainHeading>
          <img src={metaDot} alt="metadot" />
        </MainHeading>
        <SubHeading className={subHeadingfontFamilyClass}>
          Your Gateway To Polkadot And Its Parachains.
        </SubHeading>
      </div>
      <div {...divProps}>
        <Button id="btn-create" {...btnCreate} />
        <div style={{ margin: '0.5rem' }} />
        <Button id="btn-import" cancel {...btnImport} />
      </div>
    </AuthWrapper>
  );
}

export default Welcome;
