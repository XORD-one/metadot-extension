import styled from 'styled-components';
import { colors, fonts } from '../../../utils';

const { primaryText } = colors;
const { headerHeadingFontSize } = fonts;

export const HeaderWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
`;

export const HeaderHeading = styled.h3`
    color: ${primaryText};
    font-size: ${headerHeadingFontSize};
    margin: 0 auto;
    padding: 10px;
    font-size: 18px;
    font-weight: 700;
`;
