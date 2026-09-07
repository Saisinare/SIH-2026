export interface SectorCreditPotential {
  sector: string;
  creditPotentialLakhs: number;
  growthRating: 'Low' | 'Medium' | 'High' | string;
}

export interface DistrictCreditPlan {
  district: string;
  sectorPotential: SectorCreditPotential[];
}
