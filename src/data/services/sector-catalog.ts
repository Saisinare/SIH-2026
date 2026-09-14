import { apiClient, ApiSector } from './api-client';
import { Result, Success, Failure } from '../../core/error/result';

/**
 * The sectors the backend can actually assess.
 *
 * The app previously offered seven labels ("Tailoring", "Handicrafts",
 * "Agri-Input Shop", "Flour Mill", …) that the engine has no model for — a
 * picker entry that cannot produce a real verdict is a dead end dressed as a
 * feature. The picker now offers exactly what /advise supports, and the
 * unmodelled trades are shown honestly elsewhere as illustrative benchmarks.
 */

let cache: ApiSector[] | null = null;

export async function loadSectors(force = false): Promise<Result<ApiSector[]>> {
  if (cache && !force) return Success(cache);
  const res = await apiClient.sectors();
  if (!res.success) return Failure(res.error);
  cache = res.data.sectors;
  return Success(cache);
}

/** Display name in the requested language, falling back to English. */
export function sectorLabel(s: ApiSector, locale: string): string {
  if (locale === 'mr' && s.display_name?.mr) return s.display_name.mr;
  return s.display_name?.en ?? s.sector_id;
}

/** Ionicons glyph per sector, so the picker reads at a glance. */
export function sectorIcon(sectorId: string): string {
  switch (sectorId) {
    case 'dairy_buffalo':
      return 'water-outline';
    case 'goat_rearing':
      return 'paw-outline';
    case 'backyard_poultry':
      return 'egg-outline';
    case 'kirana_retail':
      return 'storefront-outline';
    default:
      return 'briefcase-outline';
  }
}
