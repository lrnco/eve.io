import { search, findNearBy } from "@/services/Geonames";
import { getMultipointWeather } from "@/services/OpenWeatherMap";
import { Module } from "vuex";
import { LocationEntity } from "@/types/locations";

const locationsModule: Module<any, any> = {
  namespaced: true,
  state: {
    data: "population",
    loading: false,
    searchResults: [],
    selected: null,
    points: [],
  },
  mutations: {
    setLoading(state) {
      state.loading = !state.loading;
    },
    setSearchResults(state, result) {
      state.searchResults = result;
    },
    mergePoints(state, result) {
      state.points = [...state.points, ...result];
      state.data = "population";
    },
    setPoints(state, result) {
      state.points = result;
    },
    setSelected(state, selected) {
      state.selected = selected;
      state.points = [selected];
      state.data = "population";
    },
    setData(state, selected) {
      state.data = selected;
    },
  },
  actions: {
    async searchCities({ commit }, query: string) {
      commit("setLoading");
      commit("setSearchResults", await search(query));
      commit("setLoading");
    },
    async selectLocation({ commit, dispatch }, selected: LocationEntity) {
      commit("setSelected", selected);
      dispatch("searchCitiesNearBy", selected);
    },
    async selectData({ commit }, selected: string) {
      commit("setData", selected);
    },
    async searchCitiesNearBy(
      { commit, dispatch },
      { id, lat, lng }: LocationEntity
    ) {
      commit("setLoading");
      commit("mergePoints", await findNearBy(id, lat, lng));
      commit("setLoading");
      dispatch("getCitiesWeather");
    },
    async getCitiesWeather({ commit, state }) {
      commit("setPoints", await getMultipointWeather(state.points));
    },
  },
};

export default locationsModule;
