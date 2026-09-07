import { EstablishmentRepository } from '../establishment-repository';
import { Establishment } from '../../../domain/models/establishment';
import { Result, Success, Failure } from '../../../core/error/result';
import establishmentsMock from '../../mock/establishments_mock.json';

export class MockEstablishmentRepository implements EstablishmentRepository {
  sourceMeta = establishmentsMock.sourceMeta || 'Economic Census Establishments';

  async loadAll(): Promise<Result<Establishment[]>> {
    try {
      return Success(establishmentsMock.establishments as Establishment[]);
    } catch (e) {
      return Failure(new Error(`Failed to load establishments: ${e}`));
    }
  }

  async getCount(villageId: string, sector: string): Promise<Result<number>> {
    const all = await this.loadAll();
    if (!all.success) return all;
    const match = all.data.find((e) => e.villageId === villageId && e.sector === sector);
    return Success(match?.count ?? 0);
  }

  async getCountForVillages(villageIds: string[], sector: string): Promise<Result<number>> {
    const all = await this.loadAll();
    if (!all.success) return all;
    const total = all.data
      .filter((r) => villageIds.includes(r.villageId) && r.sector === sector)
      .reduce((sum, r) => sum + r.count, 0);
    return Success(total);
  }
}
