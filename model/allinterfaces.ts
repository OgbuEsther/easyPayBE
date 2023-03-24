export interface adminSignUp {
  companyName: string;
  companyEmail: string;
  yourName: string;
  password: string;
  wallet: {}[];
  transactionHistory: {}[];
  viewUser : {}[] ;
  walletNumber: number;
}

export interface staffSignUp {
  yourName: string;
  email: string;
  password: string;
  companyName: string;
  position: string;
  walletNumber: number;
  subscribe :boolean,
  wallet: {}[];
  transactionHistory: {}[];
  savingsPlan: {}[];
  houseRentPlan: {}[];
  schoolFeesPlan: {}[];
  investmentPlan: {}[];
  travelAndTour: {}[];
  other: {}[];
}
