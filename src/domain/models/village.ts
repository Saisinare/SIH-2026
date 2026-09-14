export interface Village {
  /** Backend SHRID2 (e.g. "11-27-522-04202-557361") for real villages. */
  id: string;
  name: string;
  district: string;
  /** Subdistrict / taluka. */
  taluka: string;
  state: string;
  population: number;

  /**
   * Everything below is OPTIONAL on purpose.
   *
   * /resolve returns identity + population only. The infrastructure facts
   * (all-weather road, power, market access) live inside the /advise
   * envelope, each carrying its own source/year/confidence — so a village
   * that came from the real register simply leaves these undefined rather
   * than letting the app invent a plausible-looking number.
   *
   * The offline sample dataset does populate them, which is why the local
   * fallback engine still works.
   */
  lat?: number;
  lng?: number;
  roadAccess?: boolean;
  powerReliability?: number; // 0-100
  marketAccessScore?: number; // 0-100
}
