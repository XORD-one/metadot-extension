import styled from 'styled-components';
import { fonts } from '../../../../utils';

const { subHeadingFontSize } = fonts;

// eslint-disable-next-line import/prefer-default-export
export const WarningText = styled.p`
  font-size: ${subHeadingFontSize};
  font-size: 12.5px;
  color: rgba(195, 7, 7, 1) !important;
  width: 100%;
  font-weight: 400;
  text-align: start;
  /* border: 1px solid white; */
  margin-left: 2px;
  margin-top: 10px;
  visibility: ${(props) => props.visibility || 'visible'};
  /* position: absolute; */
  margin-bottom: 0;
`;

export const LabelAndTextInput = styled.div`
  width: 100%;
  /* height: 120px; */
  margin-bottom: 0.5rem;
  position: relative;
  /* border: 1px solid white; */
`;
