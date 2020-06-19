import { GeonameBase } from "./geonames";

export interface LocationsEntity extends GeonameBase {
  id: number;
}

export interface LocationsState {
  loading: boolean;
  searchResults: LocationsEntity[];
  selected: LocationsEntity;
  points: LocationsEntity[];
}
