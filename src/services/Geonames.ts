import Geonames from "geonames.js";
import { LocationEntity } from "@/types/locations";
import {
  GeonameSearchResult,
  GeonameSearchError,
  GeonameEntity,
} from "@/types/geonames";

const geonames = new Geonames({
  username: process.env.VUE_APP_GEONAMES_USERNAME,
});

function mapItem(item: GeonameEntity) {
  return {
    id: item.geonameId,
    name: item.name,
    countryId: item.countryId,
    countryCode: item.countryCode,
    countryName: item.countryName,
    adminName1: item.adminName1,
    lat: item.lat,
    lng: item.lng,
    population: item.population,
    fcode: item.fcode,
    temperature: null,
    humidity: null,
    windSpeed: null,
  };
}

export async function search(
  query: string,
  maxRows = 3
): Promise<LocationEntity[]> {
  const response:
    | GeonameSearchResult
    | GeonameSearchError = await geonames.search({
    q: query,
    maxRows,
    featureClass: "P",
  });

  if (!response || "status" in response) {
    throw new Error(response.status.message);
  }

  return response.geonames.map(mapItem);
}

export async function findNearBy(
  id: number,
  lat: string,
  lng: string,
  radius = 300,
  maxRows = 4
): Promise<LocationEntity[]> {
  const response:
    | GeonameSearchResult
    | GeonameSearchError = await geonames.findNearbyPlaceName({
    lat,
    lng,
    cities: "cities15000",
    featureClass: "P",
    radius,
    maxRows,
  });

  if (!response || "status" in response) {
    throw new Error(response.status.message);
  }

  return response.geonames.reduce(
    (filtered: LocationEntity[], item: GeonameEntity) => {
      if (item.geonameId !== id) filtered.push(mapItem(item));
      return filtered;
    },
    []
  );
}
