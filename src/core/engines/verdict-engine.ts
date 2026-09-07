import { Result, Success, Failure, EngineComputationException } from '../error/result';
import { Village } from '../../domain/models/village';
import { VerdictResult } from '../../domain/models/engine-results';
import { VillageRepository } from '../../data/repositories/village-repository';
import { EstablishmentRepository } from '../../data/repositories/establishment-repository';
import { SchemeRepository } from '../../data/repositories/scheme-repository';
import { MarketDataRepository } from '../../data/repositories/market-data-repository';
import { CreditPlanRepository } from '../../data/repositories/credit-plan-repository';
import { MarketEngine } from './market-engine';
import { AffordabilityEngine } from './affordability-engine';
import { SchemeRouterEngine } from './scheme-router-engine';
import { RiskEngine } from './risk-engine';

export class VerdictEngine {
  private villageRepository: VillageRepository;
  private establishmentRepository: EstablishmentRepository;
  private schemeRepository: SchemeRepository;
  private marketDataRepository: MarketDataRepository;
  private creditPlanRepository: CreditPlanRepository;

  private _marketEngine: MarketEngine;
  private _affordabilityEngine: AffordabilityEngine;
  private _schemeRouterEngine: SchemeRouterEngine;
  private _riskEngine: RiskEngine;

  constructor(
    villageRepository: VillageRepository,
    establishmentRepository: EstablishmentRepository,
    schemeRepository: SchemeRepository,
    marketDataRepository: MarketDataRepository,
    creditPlanRepository: CreditPlanRepository
  ) {
    this.villageRepository = villageRepository;
    this.establishmentRepository = establishmentRepository;
    this.schemeRepository = schemeRepository;
    this.marketDataRepository = marketDataRepository;
    this.creditPlanRepository = creditPlanRepository;

    this._marketEngine = new MarketEngine(
      this.villageRepository,
      this.establishmentRepository
    );
    this._affordabilityEngine = new AffordabilityEngine();
    this._schemeRouterEngine = new SchemeRouterEngine(this.schemeRepository);
    this._riskEngine = new RiskEngine();
  }

  async evaluate(
    village: Village,
    sector: string,
    requestedLoanAmount: number,
    availableCapital: number = 0.0,
    isWoman: boolean = false,
    isScSt: boolean = false
  ): Promise<Result<VerdictResult>> {
    try {
      const sectorEcoResult = await this.marketDataRepository.getSectorEconomics(
        sector
      );
      if (!sectorEcoResult.success) {
        return Failure(sectorEcoResult.error);
      }
      const sectorEconomics = sectorEcoResult.data;

      const pricesResult = await this.marketDataRepository.getPricesForCommodities(
        sectorEconomics.linkedCommodities
      );
      const linkedPrices = pricesResult.success ? pricesResult.data : [];

      const marketResult = await this._marketEngine.analyze(village, sector);
      if (!marketResult.success) {
        return Failure(marketResult.error);
      }
      const market = marketResult.data;

      const schemeResult = await this._schemeRouterEngine.route(
        sector,
        requestedLoanAmount,
        isWoman,
        isScSt
      );
      if (!schemeResult.success) {
        return Failure(schemeResult.error);
      }
      const scheme = schemeResult.data;

      const affordabilityResult = this._affordabilityEngine.analyze(
        sectorEconomics,
        requestedLoanAmount,
        scheme.interestRate - scheme.interestSubsidy,
        scheme.tenureYears
      );
      if (!affordabilityResult.success) {
        return Failure(affordabilityResult.error);
      }
      const affordability = affordabilityResult.data;

      const riskResult = this._riskEngine.assess(
        village,
        sectorEconomics,
        linkedPrices,
        requestedLoanAmount,
        scheme.interestRate - scheme.interestSubsidy,
        scheme.tenureYears
      );
      if (!riskResult.success) {
        return Failure(riskResult.error);
      }
      const risk = riskResult.data;

      let verdict: string;
      if (
        market.saturationLevel === 'Saturated' ||
        risk.stressTestPassRate < 0.5 ||
        (!affordability.isAffordable &&
          affordability.recommendedLoanAmount < sectorEconomics.minViableCapital)
      ) {
        verdict = 'Reconsider';
      } else if (
        market.saturationLevel === 'High' ||
        !affordability.isAffordable ||
        scheme.capExceeded ||
        risk.infraGaps.length > 0 ||
        risk.seasonalityFlag
      ) {
        verdict = 'Adjust';
      } else {
        verdict = 'Proceed';
      }

      let alternativeSectors: string[] = [];
      if (verdict !== 'Proceed') {
        const altResult = await this.creditPlanRepository.getAlternativeSectors(
          village.district,
          sector,
          3
        );
        alternativeSectors = altResult.success ? altResult.data : [];
      }

      const sourcesUsedSet = new Set<string>();
      sourcesUsedSet.add(this.villageRepository.sourceMeta);
      sourcesUsedSet.add(this.establishmentRepository.sourceMeta);
      sourcesUsedSet.add(this.schemeRepository.sourceMeta);
      sourcesUsedSet.add(this.marketDataRepository.sectorSourceMeta);

      if (linkedPrices.length > 0) {
        sourcesUsedSet.add(this.marketDataRepository.priceSourceMeta);
      }
      if (alternativeSectors.length > 0) {
        sourcesUsedSet.add(this.creditPlanRepository.sourceMeta);
      }

      return Success({
        verdict,
        market,
        affordability,
        scheme,
        risk,
        alternativeSectors,
        sourcesUsed: Array.from(sourcesUsedSet),
        villageName: village.name,
        district: village.district,
        sector,
        availableCapital,
      });
    } catch (e) {
      return Failure(
        new EngineComputationException(
          `Verdict orchestration failed: ${e}`,
          'VerdictEngine'
        )
      );
    }
  }
}
