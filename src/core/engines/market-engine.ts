import { AppConstants } from '../constants/app-constants';
import { Result, Success, Failure, EngineComputationException } from '../error/result';
import { Village } from '../../domain/models/village';
import { MarketAnalysisResult } from '../../domain/models/engine-results';
import { VillageRepository } from '../../data/repositories/village-repository';
import { EstablishmentRepository } from '../../data/repositories/establishment-repository';

export class MarketEngine {
  private villageRepository: VillageRepository;
  private establishmentRepository: EstablishmentRepository;

  constructor(
    villageRepository: VillageRepository,
    establishmentRepository: EstablishmentRepository
  ) {
    this.villageRepository = villageRepository;
    this.establishmentRepository = establishmentRepository;
  }

  static getBenchmarkPer1000(sector: string): number {
    switch (sector.toLowerCase().trim()) {
      case 'kirana store':
        return 3.5;
      case 'dairy':
        return 2.5;
      case 'poultry':
        return 1.8;
      case 'tailoring':
        return 2.0;
      case 'handicrafts':
        return 1.2;
      case 'agri-input shop':
        return 1.2;
      case 'flour mill':
        return 1.0;
      default:
        return 2.0;
    }
  }

  async analyze(
    village: Village,
    sector: string,
    radiusKm: number = AppConstants.defaultRadiusKm
  ): Promise<Result<MarketAnalysisResult>> {
    try {
      const villagesResult = await this.villageRepository.getVillagesInRadius(
        village.lat,
        village.lng,
        radiusKm
      );

      if (!villagesResult.success) {
        return Failure(villagesResult.error);
      }

      const nearbyVillages = villagesResult.data;
      const villageIds = nearbyVillages.map((v) => v.id);
      const populationInRadius = nearbyVillages.reduce(
        (sum, v) => sum + v.population,
        0
      );

      const countResult = await this.establishmentRepository.getCountForVillages(
        villageIds,
        sector
      );

      if (!countResult.success) {
        return Failure(countResult.error);
      }

      const competitorCount = countResult.data;
      const benchmark = MarketEngine.getBenchmarkPer1000(sector);
      const expectedCompetitors = Math.max(
        1.0,
        (populationInRadius / 1000.0) * benchmark
      );

      const saturationScore = Math.min(
        100.0,
        Math.max(0.0, (competitorCount / expectedCompetitors) * 50.0)
      );

      let saturationLevel: string;
      if (saturationScore < 25.0) {
        saturationLevel = 'Low';
      } else if (saturationScore < 50.0) {
        saturationLevel = 'Medium';
      } else if (saturationScore < 75.0) {
        saturationLevel = 'High';
      } else {
        saturationLevel = 'Saturated';
      }

      return Success({
        competitorCount,
        populationInRadius,
        saturationLevel,
        saturationScore: parseFloat(saturationScore.toFixed(1)),
      });
    } catch (e) {
      return Failure(
        new EngineComputationException(
          `Market analysis failed: ${e}`,
          'MarketEngine'
        )
      );
    }
  }
}
