import React, { useState } from 'react';
import { TxDetailsProps } from './types';
import TxDetailsView from './view';

const TxDetails: React.FunctionComponent<TxDetailsProps> = (props) => {
    const { txDetailsModalData } = props;
    const { hash } = txDetailsModalData;

    const [copy, setCopy] = useState('Copy');

    const getTotalBalance = (value1: number[], value2: string): number => {
        const sum = value1.reduce((a, b) => {
            return a + b;
        }, 0);
        const val = sum + parseFloat(value2);
        return Number(val.toFixed(4));
    };

    const copyText = (stringNeedToBeCopied?: string): void => {
        navigator.clipboard.writeText(stringNeedToBeCopied || 'abc');
        setCopy('Copied');
    };

    const tooltipText = {
        onClick: copyText,
        onMouseOver: () => setCopy('Copy'),
        style: { cursor: 'pointer' },
    };

    return (
        <TxDetailsView
            {...props}
            copy={copy}
            tooltipText={tooltipText}
            getTotalBalance={getTotalBalance}
        />
    );
};

export default TxDetails;
