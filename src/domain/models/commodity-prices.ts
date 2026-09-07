export interface PricePoint {
  month: string;
  price: number;
}

export class CommodityPrices {
  name: string;
  unit: string;
  monthlyPrices: PricePoint[];

  constructor(name: string, unit: string, monthlyPrices: PricePoint[]) {
    this.name = name;
    this.unit = unit;
    this.monthlyPrices = monthlyPrices;
  }

  get volatility(): number {
    if (this.monthlyPrices.length === 0) return 0.0;
    const prices = this.monthlyPrices.map((p) => p.price);
    const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
    if (mean === 0) return 0.0;
    const variance =
      prices.map((p) => (p - mean) * (p - mean)).reduce((a, b) => a + b, 0) /
      prices.length;
    const stdDev = Math.sqrt(variance);
    return stdDev / mean;
  }
}
