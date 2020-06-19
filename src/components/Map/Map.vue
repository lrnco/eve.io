<template>
  <div class="map">
    <mapbox
      :access-token="accessToken"
      :map-options="{
        style: 'mapbox://styles/mapbox/light-v10',
        center: [0, 35],
        zoom: 2,
      }"
      :geolocate-control="{
        show: true,
        position: 'bottom-right',
      }"
      @map-init="mapInitialized"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import mapboxgl from "mapbox-gl";
import Mapbox from "mapbox-gl-vue";
import { LocationsEntity } from "../../types/locations";
import { toGeoFeatureCollection } from "../../utils/geoFeature";
// import * as pin from "../../static/pin.png";

@Component({
  components: {
    Mapbox,
  },
})
export default class Map extends Vue {
  private accessToken: string = process.env.VUE_APP_MAPBOX_ACCESS_TOKEN;
  private map: mapboxgl.Map | null = null;
  @Prop() private points!: LocationsEntity[];

  mapInitialized(map: mapboxgl.Map) {
    this.map = map;
    // this.map.addImage("pin", pin);
  }

  fly({ lat, lng }: LocationsEntity) {
    if (this.map)
      this.map.flyTo({
        center: [Number(lng), Number(lat)],
        zoom: 10,
        essential: true,
        pitch: Number(40),
        bearing: Number(-40),
      });
  }

  addPoints(points: LocationsEntity[]) {
    if (this.map) {
      try {
        if (this.map.getSource("points") && this.map.getLayer("pointsLayer")) {
          this.map.removeLayer("pointsLayer");
          this.map.removeSource("points");
        }
      } catch (error) {
        console.log(error);
      }

      this.map.addSource("points", {
        type: "geojson",
        data: toGeoFeatureCollection(points),
      });
      this.map.addLayer({
        id: "pointsLayer",
        type: "symbol",
        source: "points",
        layout: {
          "icon-image": "marker-15",
          "text-field": "{title}",
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-anchor": "top",
        },
      });

      this.map.addSource("points", {
        type: "geojson",
        data: toGeoFeatureCollection(points),
      });
      this.map.addLayer({
        id: "room-extrusion",
        type: "fill-extrusion",
        source: "floorplan",
        paint: {
          // See the Mapbox Style Specification for details on data expressions.
          // https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions

          // Get the fill-extrusion-color from the source 'color' property.
          "fill-extrusion-color": ["get", "color"],

          // Get fill-extrusion-height from the source 'height' property.
          "fill-extrusion-height": ["get", "height"],

          // Get fill-extrusion-base from the source 'base_height' property.
          "fill-extrusion-base": ["get", "base_height"],

          // Make extrusions slightly opaque for see through indoor walls.
          "fill-extrusion-opacity": 0.5,
        },
      });
    }
  }

  @Watch("points")
  onPointsChanged(value: LocationsEntity[] | null) {
    console.log("pointssss", value);
    if (value) {
      this.fly(value[0]);
      if (value && value.length > 1) this.addPoints(value);
    }
  }
}
</script>

<style scoped lang="less">
@import "./map";
</style>
