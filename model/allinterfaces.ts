export interface adminSignUp {
  companyName: string;
  companyEmail: string;
  yourName: string;
  password: string;
  wallet: {}[];
  transactionHistory: {}[];
  walletNumber: number;
}

export interface staffSignUp {
  yourName: string;
  email: string;
  password: string;
  companyName: string;
  position: string;
  walletNumber: number;
  wallet: {}[];
  transactionHistory: {}[];
  savingsPlan: {}[];
  houseRentPlan: {}[];
  schoolFeesPlan: {}[];
  investmentPlan: {}[];
  travelAndTour: {}[];
  other: {}[];
}
