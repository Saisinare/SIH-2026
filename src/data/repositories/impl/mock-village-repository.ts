import { VillageRepository } from '../village-repository';
import { Village } from '../../../domain/models/village';
import { Result, Success, Failure } from '../../../core/error/result';
import villagesMock from '../../mock/villages_mock.json';

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export class MockVillageRepository implements VillageRepository {
  sourceMeta = villagesMock.sourceMeta || 'SHRUG Village Census';

  async loadAll(): Promise<Result<Village[]>> {
    try {
      return Success(villagesMock.villages as Village[]);
    } catch (e) {
      return Failure(new Error(`Failed to load villages: ${e}`));
    }
  }

  async searchByName(query: string): Promise<Result<Village[]>> {
    const all = await this.loadAll();
    if (!all.success) return all;
    const q = query.toLowerCase().trim();
    if (!q) return Success([]);
    return Success(all.data.filter((v) => v.name.toLowerCase().includes(q)));
  }

  async findById(id: string): Promise<Result<Village>> {
    const all = await this.loadAll();
    if (!all.success) return all;
    const match = all.data.find((v) => v.id === id);
    if (!match) {
      return Failure(new Error(`Village ID not found: ${id}`));
    }
    return Success(match);
  }

  async getVillagesInRadius(lat: number, lng: number, radiusKm: number): Promise<Result<Village[]>> {
    const all = await this.loadAll();
    if (!all.success) return all;
    try {
      const inRadius = all.data.filter((v) => calculateDistance(lat, lng, v.lat, v.lng) <= radiusKm);
      return Success(inRadius);
    } catch (e) {
      return Failure(new Error(`Failed to query villages in radius: ${e}`));
    }
  }
}
