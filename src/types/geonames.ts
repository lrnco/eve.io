export interface GeonameBase {
  name: string;
  countryId: string;
  countryCode: string;
  countryName: string;
  adminName1: string;
  lat: string;
  lng: string;
  population: number;
  fcode: string;
}

export interface GeonameEntity extends GeonameBase {
  geonameId: number;
}

export interface GeonameSearchResult {
  totalResultsCount: number;
  geonames: GeonameEntity[];
}

export interface GeonameSearchError {
  status: {
    message: string;
  };
}
