/* eslint-disable no-nested-ternary */
import styled from 'styled-components';
import { colors, fonts } from '../../utils';

const { primaryTextColor, secondaryTextColor } = colors;
const { mainHeadingFontSize, subHeadingFontSize } = fonts;

export const MainHeading = styled.p`
  font-style: normal;
  font-size: ${mainHeadingFontSize};
  color: ${(props) => (props.color ? props.color : primaryTextColor)};
  line-height: 18px;
  text-align: start;
  margin-bottom: ${(props) => props.marginBottom && props.marginBottom};
  font-size: 18px;
  font-weight: 500;
`;

export const SubHeading = styled.p`
  font-style: normal;
  font-size: ${subHeadingFontSize};
  color: ${secondaryTextColor};
  text-align: ${(props) => (props.textAlign ? props.textAlign : 'start')};
  text-align-last: ${(props) => (props.textAlignLast ? props.textAlignLast : 'start')};
  line-height: 22px;
  font-size: 0.75rem;
  letter-spacing: 2%;
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
  /* min-height: 340px; */
  height: auto;
  margin: 25px auto 25px;
  margin-bottom: 2rem;
  margin-top: 1rem;
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
