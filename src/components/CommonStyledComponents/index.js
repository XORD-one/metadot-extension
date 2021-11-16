/* eslint-disable no-nested-ternary */
import styled from 'styled-components';
import { colors, fonts } from '../../utils';

const { primaryTextColor, secondaryTextColor } = colors;
const { mainHeadingFontSize, subHeadingFontSize } = fonts;

export const MainHeading = styled.p`
  font-style: normal;
  font-size: ${mainHeadingFontSize};
  line-height: 18.75px;
  text-align: start;
  font-size: 16px;
  font-weight: 500;
  color: ${(props) => (props.color ? props.color : primaryTextColor)};
  margin-bottom: ${(props) => props.marginBottom && props.marginBottom};
`;

export const SubHeading = styled.p`
  font-style: normal;
  font-size: ${subHeadingFontSize};
  color: ${secondaryTextColor};
  text-align: ${(props) => (props.textAlign ? props.textAlign : 'start')};
  text-align-last: ${(props) => (props.textAlignLast ? props.textAlignLast : 'start')};
  line-height: ${(props) => (props.lineHeight ? props.lineHeight : '22px')};
  font-size: 0.90rem;
  margin-top: ${(props) => props.marginTop && props.marginTop};
  text-align: justify;
  text-justify: auto;
`;

export const SubMainWrapperForAuthScreens = styled.div`
  display: ${(props) => (props.flexDirection ? 'block' : 'flex')};
  flex-direction: ${(props) => (props.flexDirection ? props.flexDirection : 'row')};
  align-items: center;
  justify-content: ${(props) => (props.flexDirection ? 'flex-start' : 'space-between')};
  flex-wrap: wrap;
  width: 100%;
  height: auto;
  height: auto;
  margin: 17px auto 25px;
  margin-bottom: ${(props) => (props.mb ? props.mb : '2rem')};
`;

export const TextInputWrapper = styled.div`
  width: 100%;
  border: ${(props) => (props.isCorrect
    ? '0px'
    : props.isCorrect === false
      ? '1px solid red'
      : '0px')};
  border-radius: 8px;
  position: relative;
  margin-bottom:${(props) => props.marginBottom && props.marginBottom}
`;
