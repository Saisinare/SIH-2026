export interface Village {
  id: string;
  name: string;
  district: string;
  taluka: string;
  state: string;
  population: number;
  lat: number;
  lng: number;
  roadAccess: boolean;
  powerReliability: number; // 0-100
  marketAccessScore: number; // 0-100
}
