export interface IGeoDbResponse {
  data: IGeoDbResponseData[];
  metadata: IGeoDbResponseMetadata;
}

export interface IGeoDbResponseData {
  country: string;
  countryCode: string;
  id: number;
  latitude: number;
  longitude: number;
  name: string;
  population: number;
  region: string;
  regionCode: string;
  regionWdId: string;
  type: string;
  wikiDataId: string;
}
export interface IGeoDbResponseMetadata {
  currentOffset: number;
  totalCount: number;
}
