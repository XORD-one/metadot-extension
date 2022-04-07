export interface Recepient {
    amount: string;
    address: string;
    validateAddress?: boolean;
}

export interface CreateBatchViewProps {
    recepientList: Recepient[];
    setStep(value: number): void;
    addressChangeHandler(value: string, index: number): void;
    amountChangeHandler(value: string, index: number): void;
    addRecepient(recepient: Recepient | Recepient[], overWrite?: boolean): void;
    deleteRecepient(index: number): void;
    setValidation(value: boolean, index: number): void;
    getTransactionFees(amount: string): Promise<number>;
}

export interface RecepientCardInterface {
    recepient: Recepient;
    index: number;
    addressChangeHandler(value: string, index: number): void;
    amountChangeHandler(value: string, index: number): void;
    deleteRecepient(index: number): void;
}

export interface ConfirmBatchViewProps {
    recepientList: Recepient[];
    addressChangeHandler(value: string, index: number): void;
    amountChangeHandler(value: string, index: number): void;
    deleteRecepient(index: number): void;
    sendTransaction(): void;
    isButtonLoading: boolean;
    getTotalAmount(value: string, index: number): string;
    getTransactionFees(amount: string): Promise<number>;
}

export interface FileInputProps {
    recepientList: Recepient[];
    addRecepient(recepient: Recepient[], overWrite?: boolean): void;
}
