import { Result, Success, Failure, EngineComputationException } from '../error/result';
import { SchemeRule } from '../../domain/models/scheme-rule';
import { SchemeMatchResult } from '../../domain/models/engine-results';
import { SchemeRepository } from '../../data/repositories/scheme-repository';

export class SchemeRouterEngine {
  private schemeRepository: SchemeRepository;

  constructor(schemeRepository: SchemeRepository) {
    this.schemeRepository = schemeRepository;
  }

  async route(
    sector: string,
    requestedAmount: number,
    isWoman: boolean = false,
    isScSt: boolean = false
  ): Promise<Result<SchemeMatchResult>> {
    try {
      const eligibleResult = await this.schemeRepository.findEligible(
        sector,
        requestedAmount,
        isWoman,
        isScSt
      );

      if (!eligibleResult.success) {
        return Failure(eligibleResult.error);
      }

      const schemes = eligibleResult.data;

      if (schemes.length === 0) {
        return this._fallbackMatch(requestedAmount);
      }

      const fittingSchemes = schemes.filter(
        (s) => s.maxLoanAmount >= requestedAmount
      );

      let selected: SchemeRule;
      let capExceeded = false;

      if (fittingSchemes.length > 0) {
        fittingSchemes.sort((a, b) => {
          const netA = a.interestRatePercent - a.subsidyPercent;
          const netB = b.interestRatePercent - b.subsidyPercent;
          if (netA !== netB) {
            return netA - netB;
          }
          return b.subsidyPercent - a.subsidyPercent;
        });
        selected = fittingSchemes[0];
      } else {
        schemes.sort((a, b) => b.maxLoanAmount - a.maxLoanAmount);
        selected = schemes[0];
        capExceeded = true;
      }

      return Success({
        schemeName: selected.name,
        schemeShortName: selected.shortName,
        capAmount: selected.maxLoanAmount,
        tenureYears: selected.tenureYears,
        interestRate: selected.interestRatePercent,
        interestSubsidy: selected.subsidyPercent,
        capExceeded,
        description: selected.description,
      });
    } catch (e) {
      return Failure(
        new EngineComputationException(
          `Scheme routing failed: ${e}`,
          'SchemeRouterEngine'
        )
      );
    }
  }

  private async _fallbackMatch(
    requestedAmount: number
  ): Promise<Result<SchemeMatchResult>> {
    const allSchemesResult = await this.schemeRepository.loadAll();

    if (!allSchemesResult.success) {
      return Failure(allSchemesResult.error);
    }

    const schemes = allSchemesResult.data;

    if (schemes.length === 0) {
      return Failure(
        new EngineComputationException(
          'No government schemes available',
          'SchemeRouterEngine'
        )
      );
    }

    schemes.sort((a, b) => b.maxLoanAmount - a.maxLoanAmount);
    const fallback = schemes[0];

    return Success({
      schemeName: fallback.name,
      schemeShortName: fallback.shortName,
      capAmount: fallback.maxLoanAmount,
      tenureYears: fallback.tenureYears,
      interestRate: fallback.interestRatePercent,
      interestSubsidy: fallback.subsidyPercent,
      capExceeded: requestedAmount > fallback.maxLoanAmount,
      description: fallback.description,
    });
  }
}
