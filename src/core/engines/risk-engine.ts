import { Result, Success, Failure, EngineComputationException } from '../error/result';
import { Village } from '../../domain/models/village';
import { SectorEconomics } from '../../domain/models/sector-economics';
import { CommodityPrices } from '../../domain/models/commodity-prices';
import { RiskAssessment } from '../../domain/models/engine-results';
import { AffordabilityEngine } from './affordability-engine';

export class RiskEngine {
  assess(
    village: Village,
    sectorEconomics: SectorEconomics,
    linkedPrices: CommodityPrices[],
    requestedLoanAmount: number,
    annualInterestRate: number = 7.0,
    tenureYears: number = 5
  ): Result<RiskAssessment> {
    try {
      const infraGaps: string[] = [];

      // An absent infrastructure field means "not measured here", which is not
      // the same as "fine" — so it raises no gap and fabricates no reassurance.
      // The real audit comes back inside the /advise envelope's risk flags.
      if (village.roadAccess === false) {
        infraGaps.push(
          'Unpaved road access may impact delivery logistics and raw material freight.'
        );
      }
      if (village.powerReliability !== undefined && village.powerReliability < 60) {
        infraGaps.push(
          `Power reliability is ${village.powerReliability}% — continuous electricity operations will require generator/solar backup.`
        );
      }
      if (village.marketAccessScore !== undefined && village.marketAccessScore < 50) {
        infraGaps.push(
          `Market access score is ${village.marketAccessScore}/100 — distant secondary markets may increase distribution time.`
        );
      }

      let seasonalityFlag = false;
      const highVolatilityMonthsSet = new Set<string>();

      if (sectorEconomics.isAgriPriceSensitive && linkedPrices.length > 0) {
        for (const commodity of linkedPrices) {
          const points = commodity.monthlyPrices;
          if (points.length === 0) continue;

          const prices = points.map((p) => p.price);
          const mean = prices.reduce((a, b) => a + b, 0) / prices.length;

          if (commodity.volatility > 0.15) {
            seasonalityFlag = true;
          }

          for (const point of points) {
            if (point.price < mean * 0.85) {
              highVolatilityMonthsSet.add(`${point.month} (${commodity.name})`);
            }
          }
        }
      }

      const highVolatilityMonths = Array.from(highVolatilityMonthsSet);

      const monthlyEMI = AffordabilityEngine.calculateEMI(
        requestedLoanAmount,
        annualInterestRate,
        tenureYears
      );

      const baseRevenue = sectorEconomics.avgMonthlyRevenue;
      const opexPercent = sectorEconomics.opexPercent / 100.0;
      const drawings = sectorEconomics.ownersMonthlyDrawing;

      let passCount = 0;
      const totalScenarios = 100;

      for (let i = 0; i < totalScenarios; i++) {
        const shock = -0.3 + (i * 0.4) / (totalScenarios - 1);
        const stressedRevenue = baseRevenue * (1.0 + shock);
        const stressedSurplus =
          stressedRevenue * (1.0 - opexPercent) - drawings;

        if (stressedSurplus >= monthlyEMI) {
          passCount++;
        }
      }

      const passRate = passCount / totalScenarios;

      return Success({
        infraGaps,
        seasonalityFlag,
        stressTestPassRate: parseFloat(passRate.toFixed(2)),
        highVolatilityMonths,
      });
    } catch (e) {
      return Failure(
        new EngineComputationException(
          `Risk assessment failed: ${e}`,
          'RiskEngine'
        )
      );
    }
  }
}
