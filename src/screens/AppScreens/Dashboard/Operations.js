/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useHistory } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

import { Option, OptionRow, OptionsName } from './StyledComponents';

import Send from '../../../assets/images/Send.svg';
import Swap from '../../../assets/images/Swap.svg';
import Governance from '../../../assets/images/Governance.svg';
import Stake from '../../../assets/images/Stake.svg';

import { fonts } from '../../../utils';

const { mainHeadingfontFamilyClass } = fonts;

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
    zIndex: -2,
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.white,
  },
}));

function Operations() {
  const history = useHistory();
  return (
    <OptionRow>
      <Option onClick={() => history.push('/Send')}>
        <img
          src={Send}
          alt="send icon"
          style={{
            width: 22,
            color: '#fafafa',
            marginTop: 10,
          }}
        />
        <OptionsName className={mainHeadingfontFamilyClass}>Send</OptionsName>
      </Option>

      <LightTooltip title="comming soon" arrow placement="top">
        <Option>
          <img
            src={Swap}
            alt="send icon"
            style={{
              width: 22,
              color: '#fafafa',
              marginTop: 10,
            }}
          />
          <OptionsName className={mainHeadingfontFamilyClass} inActive>
            Swap
          </OptionsName>
        </Option>
      </LightTooltip>

      <LightTooltip title="comming soon" arrow placement="top">
        <Option>
          <img
            src={Governance}
            alt="send icon"
            style={{
              width: 22,
              color: '#fafafa',
              marginTop: 10,
            }}
          />
          <OptionsName className={mainHeadingfontFamilyClass} inActive>
            Governance
          </OptionsName>
        </Option>
      </LightTooltip>

      <LightTooltip title="comming soon" arrow placement="top">
        <Option>
          <img
            src={Stake}
            alt="send icon"
            style={{
              width: 22,
              color: '#fafafa',
              marginTop: 10,
            }}
          />
          <OptionsName className={mainHeadingfontFamilyClass} inActive>
            Stake
          </OptionsName>
        </Option>
      </LightTooltip>
    </OptionRow>
  );
}

export default Operations;
