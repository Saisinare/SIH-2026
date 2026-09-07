export interface SectorEconomics {
  sector: string;
  avgMonthlyRevenue: number;
  revenueRangeMin: number;
  revenueRangeMax: number;
  opexPercent: number;
  ownersMonthlyDrawing: number;
  minViableCapital: number;
  isAgriPriceSensitive: boolean;
  linkedCommodities: string[];
}
