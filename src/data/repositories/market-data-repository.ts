import { Result } from '../../core/error/result';
import { SectorEconomics } from '../../domain/models/sector-economics';
import { CommodityPrices } from '../../domain/models/commodity-prices';

export interface MarketDataRepository {
  priceSourceMeta: string;
  sectorSourceMeta: string;
  loadPrices(): Promise<Result<CommodityPrices[]>>;
  loadSectorEconomics(): Promise<Result<SectorEconomics[]>>;
  getSectorEconomics(sector: string): Promise<Result<SectorEconomics>>;
  getPricesForCommodities(commodities: string[]): Promise<Result<CommodityPrices[]>>;
}
