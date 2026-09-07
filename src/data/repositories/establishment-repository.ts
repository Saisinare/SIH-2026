import { Establishment } from '../../domain/models/establishment';
import { Result } from '../../core/error/result';

export interface EstablishmentRepository {
  sourceMeta: string;
  loadAll(): Promise<Result<Establishment[]>>;
  getCount(villageId: string, sector: string): Promise<Result<number>>;
  getCountForVillages(villageIds: string[], sector: string): Promise<Result<number>>;
}
