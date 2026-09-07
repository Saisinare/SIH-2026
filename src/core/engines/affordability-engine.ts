import { AppConstants } from '../constants/app-constants';
import { Result, Success, Failure, EngineComputationException } from '../error/result';
import { SectorEconomics } from '../../domain/models/sector-economics';
import { AffordabilityResult } from '../../domain/models/engine-results';

export class AffordabilityEngine {
  static calculateEMI(
    principal: number,
    annualInterestRatePercent: number,
    tenureYears: number
  ): number {
    if (principal <= 0) return 0.0;
    const r = (annualInterestRatePercent / 100.0) / 12.0;
    const n = tenureYears * 12;
    if (r === 0) return principal / n;
    const factor = Math.pow(1.0 + r, n);
    return (principal * (r * factor)) / (factor - 1.0);
  }

  static calculateMaxPrincipalForEMI(
    monthlyEMI: number,
    annualInterestRatePercent: number,
    tenureYears: number
  ): number {
    if (monthlyEMI <= 0) return 0.0;
    const r = (annualInterestRatePercent / 100.0) / 12.0;
    const n = tenureYears * 12;
    if (r === 0) return monthlyEMI * n;
    const factor = Math.pow(1.0 + r, n);
    return (monthlyEMI * (factor - 1.0)) / (r * factor);
  }

  analyze(
    sectorEconomics: SectorEconomics,
    requestedLoanAmount: number,
    interestRate: number = 7.0,
    tenureYears: number = 5,
    safetyMargin: number = AppConstants.emiSafetyMargin
  ): Result<AffordabilityResult> {
    try {
      const revenue = sectorEconomics.avgMonthlyRevenue;
      const opex = revenue * (sectorEconomics.opexPercent / 100.0);
      const drawings = sectorEconomics.ownersMonthlyDrawing;

      const monthlySurplus = revenue - opex - drawings;

      const maxSafeMonthlyEMI = Math.max(0.0, monthlySurplus / safetyMargin);

      const monthlyEMI = AffordabilityEngine.calculateEMI(
        requestedLoanAmount,
        interestRate,
        tenureYears
      );

      const isAffordable = monthlyEMI <= maxSafeMonthlyEMI;

      let recommendedLoanAmount: number;
      if (isAffordable) {
        recommendedLoanAmount = requestedLoanAmount;
      } else {
        const maxAffordablePrincipal = AffordabilityEngine.calculateMaxPrincipalForEMI(
          maxSafeMonthlyEMI,
          interestRate,
          tenureYears
        );
        const rounded = Math.floor(maxAffordablePrincipal / 5000.0) * 5000.0;
        recommendedLoanAmount = Math.max(10000.0, rounded);
      }

      return Success({
        maxSafeMonthlyEMI: parseFloat(maxSafeMonthlyEMI.toFixed(1)),
        recommendedLoanAmount: parseFloat(recommendedLoanAmount.toFixed(0)),
        monthlySurplusEstimate: parseFloat(monthlySurplus.toFixed(1)),
        isAffordable,
        requestedLoanAmount,
        monthlyEMI: parseFloat(monthlyEMI.toFixed(1)),
      });
    } catch (e) {
      return Failure(
        new EngineComputationException(
          `Affordability computation failed: ${e}`,
          'AffordabilityEngine'
        )
      );
    }
  }
}
