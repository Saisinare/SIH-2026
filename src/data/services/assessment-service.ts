import { Result, Success, Failure } from '../../core/error/result';
import { Village } from '../../domain/models/village';
import { VerdictResult } from '../../domain/models/engine-results';
import { apiClient, AdviseEnvelope, ApiFact, ApiUnreachableError, unreachableHint } from './api-client';

/** Where an assessment came from. The UI must always be able to say which. */
export type AssessmentOrigin = 'backend';

export interface Assessment extends VerdictResult {
  origin: AssessmentOrigin;
  /** The full, provenance-carrying envelope. */
  envelope?: AdviseEnvelope;
  /** Deterministic id of the backend run, for provenance lookup / sharing. */
  runId?: string;
  /** Plain-language narration from the backend, when present. */
  narration?: string;
}

const fv = <T,>(f: ApiFact<T> | undefined | null): T | undefined =>
  f && typeof f === 'object' && 'value' in f ? (f.value as T) : undefined;

const num = (f: ApiFact<number> | undefined, fallback = 0): number => {
  const v = fv(f);
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
};

/** Backend verdict enum -> the three words this app's UI already styles. */
function mapVerdict(v: AdviseEnvelope['decision']['verdict']): string {
  if (v === 'PROCEED') return 'Proceed';
  if (v === 'PROCEED_WITH_CHANGES') return 'Adjust';
  return 'Reconsider';
}

/**
 * Saturation percentile -> the four-step label the app's gauge understands.
 * Thresholds mirror the site's own gauge bands so the two front-ends never
 * describe the same percentile differently.
 */
function saturationLabel(percentile: number | undefined): string {
  if (percentile === undefined) return 'Unknown';
  if (percentile >= 85) return 'Saturated';
  if (percentile >= 66) return 'High';
  if (percentile >= 33) return 'Medium';
  return 'Low';
}

/**
 * Flatten the backend envelope into the shape the existing screens read,
 * WITHOUT losing anything: the full envelope rides along on `.envelope` so
 * provenance, flags, PLP citations and per-fact confidence stay reachable.
 */
export function envelopeToAssessment(env: AdviseEnvelope, requestedLoan: number): Assessment {
  const chosen = env.resolution?.chosen;
  const d = env.decision;

  const saturationPct = num(env.market?.saturation_percentile as ApiFact<number>, NaN);
  const recommended = num(env.affordability?.recommended_loan as ApiFact<number>);
  const emiAtRecommended = num(env.affordability?.emi_at_recommended as ApiFact<number>);
  const netForEmi = num(env.affordability?.net_available_for_emi as ApiFact<number>);

  return {
    origin: 'backend',
    envelope: env,
    runId: env.run_id,
    narration: env.narration?.text,

    verdict: mapVerdict(d.verdict),
    villageName: chosen?.place_name ?? env.query?.village ?? '',
    district: chosen?.district_name ?? '',
    sector: String(env.query?.sector ?? ''),
    availableCapital: Number(env.query?.capital_inr ?? 0),

    market: {
      // The backend measures employment density and a district percentile, not
      // a shop count. Competitor count is genuinely unmeasured for procurement
      // sectors, so it stays -1 ("not measured") rather than becoming a 0 that
      // would read as "no competition".
      competitorCount: fv(env.market?.competitors as ApiFact<number>) ?? -1,
      populationInRadius: num(env.market?.catchment_population as ApiFact<number>),
      saturationLevel: saturationLabel(Number.isFinite(saturationPct) ? saturationPct : undefined),
      saturationScore: Number.isFinite(saturationPct) ? saturationPct / 100 : 0,
    },

    affordability: {
      maxSafeMonthlyEMI: netForEmi,
      recommendedLoanAmount: recommended,
      monthlySurplusEstimate: netForEmi,
      isAffordable: d.verdict !== 'RECONSIDER',
      requestedLoanAmount: requestedLoan,
      monthlyEMI: emiAtRecommended,
    },

    scheme: {
      schemeName: String(fv(env.finance?.scheme_id) ?? 'Scheme'),
      schemeShortName: String(fv(env.finance?.scheme_id) ?? 'Scheme')
        .replace(/^NBCFDC_/, '')
        .replace(/_/g, ' '),
      capAmount: num(env.finance?.per_beneficiary_cap as ApiFact<number>),
      tenureYears: num(env.finance?.tenure_years as ApiFact<number>),
      // Backend stores the rate as a fraction (0.08); this UI prints percent.
      interestRate: num(env.finance?.interest_rate as ApiFact<number>) * 100,
      interestSubsidy: 0, // the committed NBCFDC rules carry no subsidy field
      capExceeded: Boolean(fv(env.finance?.cap_applied)),
      description: `${String(fv(env.finance?.scheme_id) ?? '')} — ${num(
        env.finance?.tenure_years as ApiFact<number>
      )} year tenure`,
    },

    risk: {
      infraGaps: (env.risk?.flags ?? []).map((f) => f.message),
      seasonalityFlag: Boolean(env.risk?.seasonality_note),
      // Real 1,000-run Monte Carlo survival probability, not a local estimate.
      stressTestPassRate: num(env.risk?.survival_at_recommended, 0),
      highVolatilityMonths: [],
    },

    alternativeSectors: (d.alternatives ?? []).map((a) => a.display_name),

    // Every distinct source the envelope actually cites.
    sourcesUsed: Array.from(
      new Set((env.provenance ?? []).map((p) => p.source).filter(Boolean))
    ),
  };
}

/**
 * Run an assessment against the real backend.
 *
 * There is deliberately NO offline verdict path. An offline estimate would
 * have to run against the sample village dataset — invented places, in
 * districts that do not exist — and a verdict computed on a fictional village
 * is worse than no verdict at all. Searching for a village already requires
 * the backend, so an offline run could not identify a real place anyway.
 * When the backend is unreachable the UI says exactly that.
 */
export async function runAssessment(args: {
  village: Village;
  sector: string;
  requestedLoanAmount: number;
  availableCapital: number;
  targetGroup?: string;
  lang?: string;
  override?: boolean;
}): Promise<Result<Assessment>> {
  const { village, sector, requestedLoanAmount, availableCapital, targetGroup, lang, override } = args;

  const res = await apiClient.advise({
    village: village.name,
    capital_inr: availableCapital,
    sector,
    shrid: village.id?.includes('-') ? village.id : null,
    target_group: targetGroup ?? 'OBC',
    override: override ?? false,
    lang: lang ?? 'en',
  });

  if (res.success) {
    return Success(envelopeToAssessment(res.data, requestedLoanAmount));
  }

  if (res.error instanceof ApiUnreachableError) {
    return Failure(
      new Error(
        `Cannot reach the assessment server. An assessment needs the real village register ` +
          `and market data, so it cannot be computed on the device.\n\n${unreachableHint()}`
      )
    );
  }
  return Failure(res.error);
}
