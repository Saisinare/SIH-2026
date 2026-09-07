export interface MarketAnalysisResult {
  competitorCount: number;
  populationInRadius: number;
  saturationLevel: string;
  saturationScore: number;
}

export interface AffordabilityResult {
  maxSafeMonthlyEMI: number;
  recommendedLoanAmount: number;
  monthlySurplusEstimate: number;
  isAffordable: boolean;
  requestedLoanAmount: number;
  monthlyEMI: number;
}

export interface SchemeMatchResult {
  schemeName: string;
  schemeShortName: string;
  capAmount: number;
  tenureYears: number;
  interestRate: number;
  interestSubsidy: number;
  capExceeded: boolean;
  description: string;
}

export interface RiskAssessment {
  infraGaps: string[];
  seasonalityFlag: boolean;
  stressTestPassRate: number;
  highVolatilityMonths: string[];
}

export interface VerdictResult {
  verdict: string;
  market: MarketAnalysisResult;
  affordability: AffordabilityResult;
  scheme: SchemeMatchResult;
  risk: RiskAssessment;
  alternativeSectors: string[];
  sourcesUsed: string[];
  villageName: string;
  district: string;
  sector: string;
  availableCapital: number;
}
