export interface Transaction {
    date: string;
    credit_debit: number | string;
    company_name: string;
    balance: string | number;
}

export interface ProcessedTransaction extends Transaction {
    category: string;
    amount: number;
}

export type CategoryRule = Record<string, string>

export interface CategoryTotals {
    [key: string]: number;
}