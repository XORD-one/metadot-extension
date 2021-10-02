import React, { useState } from 'react';

import { Input } from '@mui/material';
import { styled } from '@mui/system';

import { Option, OptionDiv } from './StyledComponents';
import { fonts } from '../../../utils';

import {
  AuthWrapper,
  Header,
  Button,
  MainHeading,
  SubHeading,
  SubMainWrapperForAuthScreens,
} from '../../../components';

const { mainHeadingfontFamilyClass, subHeadingfontFamilyClass } = fonts;

function ImportWallet(props) {
  const [selectedType, setSelectedType] = useState('');

  const TextArea = styled(Input)`
    width: 89%;
    border-radius: 8px;
    padding-left: 25px;
    padding-right: 25px;
    padding-top: 13px;
    padding-bottom: 13px;
    color: #fafafa;
    font-size: 16px;
  `;

  const TypeSeedPhrase = () => (
    <div>
      <MainHeading className={mainHeadingfontFamilyClass}>
        Place your seed here :
      </MainHeading>
      <TextArea
        rows={7}
        multiline={true}
        disableUnderline={true}
        style={{ background: '#212121' }}
      />
    </div>
  );

  return (
    <AuthWrapper>
      <Header centerText="Import Wallet" />
      <div>
        <MainHeading className={mainHeadingfontFamilyClass}>
          Restore your wallet{' '}
        </MainHeading>
        <SubHeading className={subHeadingfontFamilyClass}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Volutpat
          cursus sit diam Lorem ipsum dolor sit amet, consectetur adipiscing
          elit. Volutpat cursus sit diam{' '}
        </SubHeading>
      </div>
      <SubMainWrapperForAuthScreens flexDirection={'column'}>
        <MainHeading className={mainHeadingfontFamilyClass}>
          Select Type :{' '}
        </MainHeading>
        <OptionDiv>
          <Option
            onClick={() => setSelectedType('seed')}
            selected={selectedType === 'seed'}
            className={mainHeadingfontFamilyClass}>
            Seed Phrase
          </Option>
          <Option
            onClick={() => setSelectedType('json')}
            className={mainHeadingfontFamilyClass}
            selected={selectedType === 'json'}>
            Json File
          </Option>
        </OptionDiv>
        {selectedType === 'seed' && <TypeSeedPhrase />}
      </SubMainWrapperForAuthScreens>
      <div className="btn-wrapper">
        <Button text="Import" handleClick={() => console.log('object')} />
      </div>
    </AuthWrapper>
  );
}

export default ImportWallet;