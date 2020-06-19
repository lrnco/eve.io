<template>
  <div class="search">
    <SearchBar
      :loading="locations.loading"
      :searchResults="locations.searchResults"
      @search="onSearch"
      @select="onSelect"
    />
    <Map :points="locations.points" />
  </div>
</template>

<script lang="ts">
const namespace = "locations";
import { Component, Vue } from "vue-property-decorator";
import { LocationsState, LocationsEntity } from "../../types/locations";
import { State, Action } from "vuex-class";
import SearchBar from "@/components/SearchBar";
import Map from "@/components/Map";

@Component({
  components: {
    SearchBar,
    Map,
  },
})
export default class Search extends Vue {
  @State("locations") private locations!: LocationsState;
  @Action("searchCities", { namespace }) searchCities: any;
  @Action("selectLocation", { namespace }) selectLocation: any;

  onSearch(searchText: string) {
    this.searchCities(searchText);
  }

  onSelect(selected: LocationsEntity) {
    this.selectLocation(selected);
  }
}
</script>
