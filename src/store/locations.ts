import { search, findhNearBy } from "@/services/Geonames";
import { Module } from "vuex";
import { LocationsEntity } from "@/types/locations";

const locationsModule: Module<any, any> = {
  namespaced: true,
  state: {
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
    setNearBy(state, result) {
      state.points = [...state.points, ...result];
    },
    setSelected(state, selected) {
      state.selected = selected;
      state.points = [selected];
    },
  },
  actions: {
    async searchCities({ commit }, query: string) {
      commit("setLoading");
      commit("setSearchResults", await search(query));
      commit("setLoading");
    },
    async searchCitiesNearBy({ commit }, { id, lat, lng }: LocationsEntity) {
      console.log("searchCitiesNearBy");
      commit("setLoading");
      commit("setNearBy", await findhNearBy(id, lat, lng));
      commit("setLoading");
    },
    async selectLocation({ commit, dispatch }, selected: LocationsEntity) {
      commit("setSelected", selected);
      dispatch("searchCitiesNearBy", selected);
    },
  },
};

export default locationsModule;
