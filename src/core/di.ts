import { VerdictEngine } from './engines/verdict-engine';
import { MockVillageRepository } from '../data/repositories/impl/mock-village-repository';
import { MockEstablishmentRepository } from '../data/repositories/impl/mock-establishment-repository';
import { MockSchemeRepository } from '../data/repositories/impl/mock-scheme-repository';
import { MockMarketDataRepository } from '../data/repositories/impl/mock-market-data-repository';
import { MockCreditPlanRepository } from '../data/repositories/impl/mock-credit-plan-repository';

const villageRepo = new MockVillageRepository();
const establishmentRepo = new MockEstablishmentRepository();
const schemeRepo = new MockSchemeRepository();
const marketDataRepo = new MockMarketDataRepository();
const creditPlanRepo = new MockCreditPlanRepository();

export const verdictEngine = new VerdictEngine(
  villageRepo,
  establishmentRepo,
  schemeRepo,
  marketDataRepo,
  creditPlanRepo
);

export { villageRepo, establishmentRepo, schemeRepo, marketDataRepo, creditPlanRepo };
