import { CreditPlanRepository } from '../credit-plan-repository';
import { DistrictCreditPlan } from '../../../domain/models/credit-plan';
import { Result, Success, Failure } from '../../../core/error/result';
import creditPlanMock from '../../mock/district_credit_plan_mock.json';

export class MockCreditPlanRepository implements CreditPlanRepository {
  sourceMeta = creditPlanMock.sourceMeta || 'NABARD Potential Linked Credit Plan';

  async loadAll(): Promise<Result<DistrictCreditPlan[]>> {
    try {
      return Success(creditPlanMock.districts as DistrictCreditPlan[]);
    } catch (e) {
      return Failure(new Error(`Failed to load credit plans: ${e}`));
    }
  }

  async getForDistrict(district: string): Promise<Result<DistrictCreditPlan>> {
    const all = await this.loadAll();
    if (!all.success) return all;
    const plan = all.data.find((p) => p.district === district);
    if (!plan) {
      return Failure(new Error(`District "${district}" not found`));
    }
    return Success(plan);
  }

  async getAlternativeSectors(
    district: string,
    currentSector: string,
    limit: number = 3
  ): Promise<Result<string[]>> {
    const planResult = await this.getForDistrict(district);
    if (!planResult.success) return planResult;
    const alternatives = planResult.data.sectorPotential
      .filter((s) => s.sector !== currentSector && s.growthRating !== 'Low')
      .sort((a, b) => b.creditPotentialLakhs - a.creditPotentialLakhs)
      .slice(0, limit)
      .map((s) => s.sector);
    return Success(alternatives);
  }
}
