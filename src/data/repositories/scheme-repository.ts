import { SchemeRule } from '../../domain/models/scheme-rule';
import { Result } from '../../core/error/result';

export interface SchemeRepository {
  sourceMeta: string;
  findEligible(
    sector: string,
    requestedAmount: number,
    isWoman: boolean,
    isScSt: boolean
  ): Promise<Result<SchemeRule[]>>;

  loadAll(): Promise<Result<SchemeRule[]>>;
}
