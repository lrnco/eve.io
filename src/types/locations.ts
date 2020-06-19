import { GeonameBase } from "./geonames";

export interface LocationEntity extends GeonameBase {
  id: number;
  temperature: number | null;
  humidity: number | null;
  windSpeed: number | null;
}

export interface LocationsState {
  loading: boolean;
  searchResults: LocationEntity[];
  selected: LocationEntity;
  points: LocationEntity[];
}
