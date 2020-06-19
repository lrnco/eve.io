/// <reference types="geojson" />

import { LocationsEntity } from "@/types/locations";

export function toGeoJSONFeature(location: LocationsEntity): GeoJSON.Feature {
  const { lat, lng, name, adminName1, countryName } = location;
  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [Number(lng), Number(lat)],
    },
    properties: {
      title: name,
      description: `${adminName1 + ", "}${countryName}`,
      "marker-color": "#fc4353",
      "marker-size": "large",
    },
  };
}

export function toGeoFeatureCollection(
  points: LocationsEntity[]
): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: points.map((p) => toGeoJSONFeature(p)),
  };
}
