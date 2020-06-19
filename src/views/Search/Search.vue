<template>
  <div class="search">
    <SearchBar
      :loading="locations.loading"
      :searchResults="locations.searchResults"
      @search="onSearch"
      @select="onSelect"
    />
    <DataTabs
      :selected="locations.data"
      :points="locations.points"
      @select="onDataSelect"
    />
    <Map :selected="locations.data" :points="locations.points" />
  </div>
</template>

<script lang="ts">
const namespace = "locations";
import { Component, Vue, Watch } from "vue-property-decorator";
import { LocationsState, LocationEntity } from "../../types/locations";
import { State, Action } from "vuex-class";
import SearchBar from "@/components/SearchBar";
import DataTabs from "@/components/DataTabs";
import Map from "@/components/Map";

@Component({
  components: {
    SearchBar,
    DataTabs,
    Map,
  },
})
export default class Search extends Vue {
  @State("locations") private locations!: LocationsState;
  @Action("searchCities", { namespace }) searchCities: any;
  @Action("selectLocation", { namespace }) selectLocation: any;
  @Action("selectData", { namespace }) selectData: any;

  onSearch(searchText: string) {
    this.searchCities(searchText);
  }

  onSelect(selected: LocationEntity) {
    this.selectLocation(selected);
  }

  onDataSelect(selected: string) {
    this.selectData(selected);
  }
}
</script>
