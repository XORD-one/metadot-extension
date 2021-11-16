import React from 'react';
import Button from '@mui/material/Button';
import './index.css';
import { styled } from '@mui/system';
import { CircularProgress } from '@mui/material';
import { dimension, fonts } from '../../utils';

const { _width, _height } = dimension.button;
const { buttonFontSize } = fonts;

function index({
  StartIcon,
  handleClick,
  text,
  width,
  height,
  fontSize,
  cancel,
  disabled,
  isLoading,
}) {
  const primaryBgColor = '#2E9B9B';
  const secondaryBgColor = 'transparent';

  const StyledButton = styled(Button)`
    width: 288px;
    height: ${height || _height};
    height: 50px;
    filter: drop-shadow(0px 10px 10px rgba(46, 155, 155, 0.07));
    box-sizing: border-box;
    border-radius: 40px;
    background: ${!cancel ? primaryBgColor : secondaryBgColor};
    font-size: ${buttonFontSize};
    text-transform: capitalize;
    font-weight: 500;
    border: 1px solid ${primaryBgColor};
    &:hover {
      background-color: ${!cancel ? primaryBgColor : secondaryBgColor};
    }
    &:disabled {
      color: rgba(250, 250, 250, 0.8);
    }
  `;

  const styledButtonF = {
    variant: 'contained',
    // startIcon: <StartIcon />,
    startIcon: <img src={StartIcon} alt="icon" style={{ marginTop: '-0.2px' }} />,
    onClick: () => handleClick(),
    disabled: !!disabled,
  };

  const styledButtonS = {
    variant: 'contained',
    onClick: () => handleClick(),
    disabled: !!disabled,
  };

  return (
    <div
      style={{
        width: width || _width,
        marginBottom: 10,
      }}
    >
      {StartIcon ? (
        <StyledButton
          {...styledButtonF}
          style={{ fontSize: buttonFontSize }}
        >
          {!isLoading ? text : <CircularProgress size={24} style={{ color: '#fafafa' }} />}
        </StyledButton>
      ) : (
        <StyledButton
          {...styledButtonS}
          style={{ fontSize: fontSize || buttonFontSize }}
        >
          {!isLoading ? text : <CircularProgress size={24} style={{ color: '#fafafa' }} />}
        </StyledButton>
      )}
    </div>
  );
}

export default index;
