export interface SchemeEligibilityFlags {
  minAge: number;
  maxAge: number;
  educationRequired: string;
  womenOnly: boolean;
  scStOnly: boolean;
  existingBusiness: boolean;
}

export interface SchemeRule {
  id: string;
  name: string;
  shortName: string;
  maxLoanAmount: number;
  minLoanAmount: number;
  tenureYears: number;
  interestRatePercent: number;
  subsidyPercent: number;
  subsidyPercentRural: number;
  eligibleSectors: string[];
  eligibilityFlags: SchemeEligibilityFlags;
  description: string;
}
