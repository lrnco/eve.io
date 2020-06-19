<template>
  <div class="map">
    <mapbox
      :access-token="accessToken"
      :map-options="{
        style: 'mapbox://styles/mapbox/light-v10',
        center: [0, 35],
        zoom: 2,
      }"
      @map-init="mapInitialized"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import mapboxgl from "mapbox-gl";
import Mapbox from "mapbox-gl-vue";
import { center, point, featureCollection, bbox } from "@turf/turf";
import { LocationEntity } from "../../types/locations";
import { Feature, Point, FeatureCollection } from "geojson";
import { mapData } from "../../utils/mapCollectionData";
// import pin from "../../static/pin.png";

@Component({
  components: {
    Mapbox,
  },
})
export default class Map extends Vue {
  private accessToken: string = process.env.VUE_APP_MAPBOX_ACCESS_TOKEN;
  private map: mapboxgl.Map | null = null;
  private collection: any;
  @Prop() private points!: LocationEntity[];
  @Prop() private selected!: string;

  mapInitialized(map: mapboxgl.Map) {
    this.map = map;
    // const img = new Image(60, 140);
    // img.onload = () => this.map && this.map.addImage("pin", img);
    // img.src = pin;
  }

  fly(centroid: Point | null) {
    if (centroid) {
      const {
        coordinates: [lng, lat],
      } = centroid;
      if (this.map)
        this.map.flyTo({
          center: { lng, lat },
          zoom: 12,
          essential: true,
          pitch: Number(30),
          bearing: Number(-30),
        });
    }
  }

  addPoints(
    collection: FeatureCollection<Point, any>,
    property = "population"
  ) {
    if (this.map) {
      try {
        if (this.map.getSource("points") && this.map.getLayer("pointsLayer")) {
          this.map.removeLayer("pointsLayer");
          this.map.removeSource("points");
        }
      } catch (error) {
        console.log(error);
      }

      const col = {
        ...collection,
        features: collection.features.map((item) => ({
          ...item,
          properties: {
            ...item.properties,
            data: new Intl.NumberFormat("en").format(
              Number(item.properties[property])
            ),
          },
        })),
      };
      this.map.addSource("points", {
        type: "geojson",
        data: col,
      });
      this.map.addLayer({
        id: "pointsLayer",
        type: "symbol",
        source: "points",
        layout: {
          // "icon-image": "pin",
          "text-field": "{name} \n{data}",
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-anchor": "top",
        },
      });
    }
  }

  fitMap(collection: FeatureCollection<Point, any>) {
    if (this.map) {
      const extent = bbox(collection);
      // Type enforcemnent
      this.map.fitBounds([extent[0], extent[1], extent[2], extent[3]], {
        padding: 150,
        pitch: Number(30),
        bearing: Number(-30),
      });
    }
  }

  extrudeData(
    collection: FeatureCollection<Point, any>,
    property = "population"
  ) {
    if (this.map) {
      try {
        if (this.map.getSource("poly") && this.map.getLayer("extrusion")) {
          this.map.removeLayer("extrusion");
          this.map.removeSource("poly");
        }
      } catch (error) {
        console.log(error);
      }

      const poly = mapData(collection, property);
      const polyColletions: FeatureCollection | any = {
        ...collection,
        features: poly,
      };

      console.log({ poly, polyColletions });
      this.map.addSource("poly", {
        type: "geojson",
        data: polyColletions,
      });
      this.map.addLayer({
        id: "extrusion",
        type: "fill-extrusion",
        source: "poly",
        paint: {
          "fill-extrusion-color": ["get", "color"],
          "fill-extrusion-height": ["get", "height"],
          "fill-extrusion-base": ["get", "baseHeight"],
          "fill-extrusion-opacity": 0.5,
        },
      });
    }
  }

  @Watch("points")
  onPointsChanged(value: LocationEntity[] | null) {
    if (value) {
      const collection: any = featureCollection(
        value.map((item) => point([Number(item.lng), Number(item.lat)], item))
      );
      this.collection = collection;
      const centroid = center(collection);

      if (centroid) this.fly(centroid.geometry);
      if (value && value.length > 1) {
        this.addPoints(collection);
        this.extrudeData(collection);
        this.fitMap(collection);
      }
    }
  }

  @Watch("selected")
  onDataSelectChange(value: string | null) {
    if (value && this.collection) {
      this.addPoints(this.collection, value);
      this.extrudeData(this.collection, value);
      this.fitMap(this.collection);
    }
  }
}
</script>

<style scoped lang="less">
@import "./map";
</style>
