import Vue from 'vue';
import vacationSpotJSON from '@/assets/data/vacation_spot.json';

const state = {
  vacationSpot: vacationSpotJSON,
  selectedVacationSpot: null,
  searchedVacationSpots: [],
  slicedVacationSpots: []  
}

const mutations = {
  SET_VACATION_SPOT(state, payload) {
    Vue.set(state, 'vacationSpot', payload);
  },  
  SET_SELECTED_VACATION_SPOT(state, payload) {
    Vue.set(state, 'selectedVacationSpot', payload);
  },
  SET_SEARCHED_VACATION_SPOTS(state, payload) {
    Vue.set(state, 'searchedVacationSpots', payload);
  },
  SET_SLICED_VACATION_SPOTS(state, payload) {
    Vue.set(state, 'slicedVacationSpots', payload);
  }
}

const actions = {
  initVacationSpots({ state, commit }) {
    const searchedVacationSpots = state.vacationSpot.filter(spot=>spot.location.includes(""));
    commit('SET_SLICED_VACATION_SPOTS', searchedVacationSpots.slice(0, 5));
    commit('SET_SEARCHED_VACATION_SPOTS', searchedVacationSpots);
  },
  searchVacationSpots({ state, commit }, payload) {
    const searchedVacationSpots = state.vacationSpot.filter(spot=>spot.location.includes(payload));
    commit('SET_SLICED_VACATION_SPOTS', searchedVacationSpots.slice(0, 5));
    commit('SET_SEARCHED_VACATION_SPOTS', searchedVacationSpots);
  },
  requestMoreVacationSpots({ state, commit }, payload) {
    setTimeout(() => {
      const temp = [];
      for (let i=0; i<5; i++) {
        const spot = state.searchedVacationSpots[state.slicedVacationSpots.length+i];
        if (spot) {
          temp.push(spot);
        }
      }
      commit('SET_SLICED_VACATION_SPOTS', state.slicedVacationSpots.concat(temp));
      payload();
    }, 1500);
  }
}

export default {
  state,
  mutations,
  actions
}