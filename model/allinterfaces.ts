export interface adminSignUp {
  companyName: string;
  companyEmail: string;
  yourName: string;
  password: string;
  wallet: {}[];
  transactionHistory: {}[];
}

export interface staffSignUp {
  yourName: string;
  email: string;
  password: string;
  companyName: string;
  position: string;
  wallet: {}[];
  transactionHistory: {}[];
  savingsPlan: {}[];
  houseRentPlan: {}[];
  schoolFeesPlan: {}[];
  investmentPlan: {}[];
  travelAndTour: {}[];
  other: {}[];
}
