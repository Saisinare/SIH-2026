import { SchemeRepository } from '../scheme-repository';
import { SchemeRule } from '../../../domain/models/scheme-rule';
import { Result, Success, Failure } from '../../../core/error/result';
import { apiClient, ApiScheme } from '../../services/api-client';

/**
 * The committed scheme rules, from the same backend the website uses.
 *
 * This replaces a sample file whose own header read "Modeled on real schemes
 * with fictional names for demo" — invented interest rates and subsidy
 * percentages are the one kind of made-up number a borrower could actually
 * act on, so they must never reach the UI.
 */
function toSchemeRule(s: ApiScheme): SchemeRule {
  // The backend models interest as slabs (rate applies up to an amount). The
  // app's card shows a single headline rate, so take the first slab and keep
  // the rest visible in the description rather than silently dropping them.
  const slabs = s.interest_slabs ?? [];
  const headline = slabs.length > 0 ? slabs[0].annual_rate * 100 : 0;
  const slabText = slabs
    .map((sl) => `${(sl.annual_rate * 100).toFixed(1)}% up to ₹${sl.upto_inr.toLocaleString('en-IN')}`)
    .join(', ');

  return {
    id: s.scheme_id,
    name: s.scheme_name,
    shortName: s.scheme_name.replace(/\s*Scheme\s*$/i, ''),
    maxLoanAmount: s.per_beneficiary_cap_inr,
    minLoanAmount: 0,
    tenureYears: s.repayment_years,
    interestRatePercent: headline,
    // The committed NBCFDC rules carry no subsidy term. Reporting 0 is the
    // honest reading; inventing a subsidy percentage is not.
    subsidyPercent: 0,
    subsidyPercentRural: 0,
    eligibleSectors: [],
    eligibilityFlags: {
      minAge: 0,
      maxAge: 0,
      educationRequired: '',
      womenOnly: false,
      scStOnly: false,
      existingBusiness: false,
    },
    description: [
      `${s.corporation} · target group ${s.target_group}`,
      slabText,
      `${s.repayment_years} year repayment`,
      s.verified ? null : 'Transcribed, not re-verified against the published circular',
      s.notes ?? null,
    ]
      .filter(Boolean)
      .join(' · '),
  };
}

export class ApiSchemeRepository implements SchemeRepository {
  sourceMeta = 'NBCFDC scheme terms as committed in the backend rule set';

  async loadAll(): Promise<Result<SchemeRule[]>> {
    const res = await apiClient.schemes();
    if (!res.success) return Failure(res.error);
    return Success(res.data.schemes.map(toSchemeRule));
  }

  async findEligible(
    _sector: string,
    requestedAmount: number
  ): Promise<Result<SchemeRule[]>> {
    const all = await this.loadAll();
    if (!all.success) return all;
    // The backend picks the scheme during /advise using the full rule set;
    // this is only a directory filter for browsing.
    return Success(all.data.filter((s) => requestedAmount <= s.maxLoanAmount));
  }
}
