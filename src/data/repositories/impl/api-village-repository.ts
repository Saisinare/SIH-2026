import { VillageRepository } from '../village-repository';
import { Village } from '../../../domain/models/village';
import { Result, Success, Failure } from '../../../core/error/result';
import { apiClient, ApiCandidate } from '../../services/api-client';

/**
 * The real village register, served by the same backend the website uses:
 * 8,872 villages across 5 Maharashtra districts, resolved by /resolve.
 *
 * /resolve returns identity + population only. Infrastructure facts (road,
 * power, market access) are deliberately left undefined here — they come back
 * inside the /advise envelope carrying their own source/year/confidence,
 * rather than being guessed at to fill a field.
 */
export function candidateToVillage(c: ApiCandidate): Village {
  return {
    id: c.shrid2,
    name: c.place_name,
    district: c.district_name,
    taluka: c.subdistrict_name,
    state: 'Maharashtra',
    population: c.population,
  };
}

export class ApiVillageRepository implements VillageRepository {
  sourceMeta = 'Population Census 2011 (via SHRUG v2.2) — village register';

  /** Deliberately unsupported: 8,872 rows is not something to pull into the
   *  app wholesale, and nothing in the UI needs the full list. */
  async loadAll(): Promise<Result<Village[]>> {
    return Failure(
      new Error('The full village register is not downloaded to the device — search by name instead.')
    );
  }

  async searchByName(query: string): Promise<Result<Village[]>> {
    const q = query.trim();
    if (!q) return Success([]);

    const res = await apiClient.resolve(q);
    if (!res.success) {
      // A 404 from /resolve means "no such village", which is an empty result,
      // not a failure the UI should show as an error.
      if (/no village matching/i.test(res.error.message)) return Success([]);
      return Failure(res.error);
    }
    return Success(res.data.candidates.map(candidateToVillage));
  }

  /** `id` is a SHRID2. /resolve has no by-id lookup, so this is only used for
   *  re-hydrating a village the user already picked. */
  async findById(id: string): Promise<Result<Village>> {
    return Failure(new Error(`Look up villages by name; SHRID lookup (${id}) is resolved server-side during /advise.`));
  }

  async getVillagesInRadius(): Promise<Result<Village[]>> {
    return Failure(
      new Error('Catchment radius is computed server-side against PostGIS during /advise.')
    );
  }
}
