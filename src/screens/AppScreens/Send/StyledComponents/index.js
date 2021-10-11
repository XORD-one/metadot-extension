import styled from 'styled-components';
import { colors } from '../../../../utils';

const { primaryTextColor } = colors;

export const MainContent = styled.div`
  margin: 25px auto 25px;
`;

export const VerticalContentDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: ${props => (props.mb ? props.mb : '0px')};
`;

export const HorizontalContentDiv = styled.div`
  display: flex;
  /* width: 100%; */
  flex-direction: row;
  align-items: center;
`;

export const FromAccount = styled(HorizontalContentDiv)`
  height: 45px;
  align-items: center;
  justify-content: space-between;
  padding-left: 10px;
  padding-right: 10px;
  background: #212121;
  border-radius: 8px;
  color: ${primaryTextColor};
  margin-bottom: 20px;
`;

export const PlainIcon = styled.div`
  width: 25px;
  height: 25px;
  border-radius: 25px;
  margin-left: 10px;
  margin-right: 20px;

  background: ${props => (props.bgColor ? props.bgColor : '#e6007a')};
`;

export const MainText = styled.p`
  height: 14px;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: 0.01em;
  color: ${props => (props.color ? props.color : '#ffffff')};
  width: 100%;
  margin-bottom: 10px;
  text-align: start;

  margin: ${props => (props.m ? props.m : '0px')};
`;

export const Balance = styled.p`
  font-size: 12px;
  width: 100%;
  height: 14px;

  line-height: 14px;
  margin: 0px;

  color: rgba(250, 250, 250, 0.8);

  text-align: ${props => (props.textAlign ? props.textAlign : 'start')};
`;

export const EquivalentInUSDT = styled.p`
  font-size: 12px;
  width: 100%;

  color: rgba(250, 250, 250, 0.8);

  text-align: start;
  margin: 0px;
`;

export const CalculatedAmount = styled(HorizontalContentDiv)`
  /* width: 108%; */
  margin-top: 5px;
`;

export const CenterContent = styled.div`
  display: flex;
  justify-content: center;
`;