import { Result } from '../../core/error/result';
import { DistrictCreditPlan } from '../../domain/models/credit-plan';

export interface CreditPlanRepository {
  sourceMeta: string;
  loadAll(): Promise<Result<DistrictCreditPlan[]>>;
  getForDistrict(district: string): Promise<Result<DistrictCreditPlan>>;
  getAlternativeSectors(
    district: string,
    currentSector: string,
    limit?: number
  ): Promise<Result<string[]>>;
}
