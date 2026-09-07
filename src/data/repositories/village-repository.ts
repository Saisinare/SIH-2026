import { Village } from '../../domain/models/village';
import { Result } from '../../core/error/result';

export interface VillageRepository {
  sourceMeta: string;
  loadAll(): Promise<Result<Village[]>>;
  searchByName(query: string): Promise<Result<Village[]>>;
  findById(id: string): Promise<Result<Village>>;
  getVillagesInRadius(lat: number, lng: number, radiusKm: number): Promise<Result<Village[]>>;
}
