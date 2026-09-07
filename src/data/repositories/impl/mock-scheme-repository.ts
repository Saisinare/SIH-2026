import { SchemeRepository } from '../scheme-repository';
import { SchemeRule } from '../../../domain/models/scheme-rule';
import { Result, Success, Failure } from '../../../core/error/result';
import schemeRulesMock from '../../mock/scheme_rules_mock.json';

export class MockSchemeRepository implements SchemeRepository {
  sourceMeta = schemeRulesMock.sourceMeta || 'Government Scheme Rules';

  async loadAll(): Promise<Result<SchemeRule[]>> {
    try {
      return Success(schemeRulesMock.schemes as SchemeRule[]);
    } catch (e) {
      return Failure(new Error(`Failed to load schemes: ${e}`));
    }
  }

  async findEligible(
    sector: string,
    requestedAmount: number,
    isWoman: boolean,
    isScSt: boolean
  ): Promise<Result<SchemeRule[]>> {
    try {
      const allSchemes = schemeRulesMock.schemes as SchemeRule[];
      const eligible = allSchemes.filter((s) => {
        if (!s.eligibleSectors.includes(sector)) {
          return false;
        }
        if (s.eligibilityFlags.womenOnly && !isWoman) return false;
        if (s.eligibilityFlags.scStOnly && !isScSt) return false;
        return true;
      });
      return Success(eligible);
    } catch (e) {
      return Failure(new Error(`Failed to find eligible schemes: ${e}`));
    }
  }
}
