export interface staffWalletProps {
  balance: number;

  credit: number;
  debit: number;
}

export interface plans {
  percentageRate : number;
  totalBal : number
}

export interface staffTransactionProps {
  message: string;
  receiver: string;
  date: string;
  transactionReference: number;
}


