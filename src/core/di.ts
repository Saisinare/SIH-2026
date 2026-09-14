/**
 * Composition root.
 *
 * The backend that serves the website is the single source of truth: the real
 * village register, the committed scheme rules, the NABARD PLP, and the
 * assessment itself (PostGIS catchments, 1,000-run Monte Carlo, full
 * provenance). Nothing here computes a verdict on the device.
 *
 * The local engines under core/engines/* are intentionally NOT wired in. They
 * only run against the sample dataset — invented villages in districts that do
 * not exist — so anything they produced would be a plausible-looking answer
 * about a place that isn't real. They are left on disk for reference, not used.
 */
import { ApiVillageRepository } from '../data/repositories/impl/api-village-repository';
import { ApiSchemeRepository } from '../data/repositories/impl/api-scheme-repository';
import { MockCreditPlanRepository } from '../data/repositories/impl/mock-credit-plan-repository';
import { MockMarketDataRepository } from '../data/repositories/impl/mock-market-data-repository';

export const villageRepo = new ApiVillageRepository();
export const schemeRepo = new ApiSchemeRepository();

/**
 * Illustrative sector benchmarks (typical revenue / opex / owner drawings for
 * 7 micro-enterprise types). These are NOT village-specific and never feed a
 * verdict — they are reference material, and every surface that shows them
 * must label them as illustrative benchmarks rather than measured local data.
 * Kept because they cover 3 sectors the backend does not yet model.
 */
export const sectorBenchmarksRepo = new MockMarketDataRepository();

/** District credit-potential sample data. Superseded by the real NABARD PLP
 *  from /plp/sections; retained only until every surface has migrated. */
export const creditPlanRepo = new MockCreditPlanRepository();

export { runAssessment, envelopeToAssessment } from '../data/services/assessment-service';
export type { Assessment } from '../data/services/assessment-service';
export { apiClient, API_BASE_URL } from '../data/services/api-client';
