import { MarketDataRepository } from '../market-data-repository';
import { SectorEconomics } from '../../../domain/models/sector-economics';
import { CommodityPrices, PricePoint } from '../../../domain/models/commodity-prices';
import { Result, Success, Failure } from '../../../core/error/result';
import mandiPricesMock from '../../mock/mandi_prices_mock.json';
import sectorEconomicsMock from '../../mock/sector_unit_economics_mock.json';

function toCommodityPrices(raw: {
  name: string;
  unit: string;
  monthlyPrices: PricePoint[];
}): CommodityPrices {
  return new CommodityPrices(raw.name, raw.unit, raw.monthlyPrices);
}

export class MockMarketDataRepository implements MarketDataRepository {
  priceSourceMeta = mandiPricesMock.sourceMeta || 'Agmarknet';
  sectorSourceMeta = sectorEconomicsMock.sourceMeta || 'Unit Economics Benchmarks';

  async loadPrices(): Promise<Result<CommodityPrices[]>> {
    try {
      return Success(mandiPricesMock.commodities.map(toCommodityPrices));
    } catch (e) {
      return Failure(new Error(`Failed to load mandi prices: ${e}`));
    }
  }

  async loadSectorEconomics(): Promise<Result<SectorEconomics[]>> {
    try {
      return Success(sectorEconomicsMock.sectors as SectorEconomics[]);
    } catch (e) {
      return Failure(new Error(`Failed to load sector economics: ${e}`));
    }
  }

  async getSectorEconomics(sector: string): Promise<Result<SectorEconomics>> {
    const all = await this.loadSectorEconomics();
    if (!all.success) return all;
    const match = all.data.find((s) => s.sector === sector);
    if (!match) {
      return Failure(new Error(`Sector "${sector}" not found`));
    }
    return Success(match);
  }

  async getPricesForCommodities(commodities: string[]): Promise<Result<CommodityPrices[]>> {
    const all = await this.loadPrices();
    if (!all.success) return all;
    return Success(all.data.filter((p) => commodities.includes(p.name)));
  }
}
