import Vue from 'vue';
import fitnessCenterJSON from '@/assets/data/fitness_center.json';

const state = {
  fitnessCenter: fitnessCenterJSON,
  selectedFitnessCenter: null,
  searchedFitnessCenters: [],
  slicedFitnessCenters: []  
}

const mutations = {
  SET_FITNESS_CENTER(state, payload) {
    Vue.set(state, 'fitnessCenter', payload);
  },  
  SET_SELECTED_FITNESS_CENTER(state, payload) {
    Vue.set(state, 'selectedFitnessCenter', payload);
  },
  SET_SEARCHED_FITNESS_CENTERS(state, payload) {
    Vue.set(state, 'searchedFitnessCenters', payload);
  },
  SET_SLICED_FITNESS_CENTERS(state, payload) {
    Vue.set(state, 'slicedFitnessCenters', payload);
  }
}

const actions = {
  initFitnessCenters({ state, commit }) {
    const searchedFitnessCenters = state.fitnessCenter.filter(center=>center.location.includes(""));
    commit('SET_SLICED_FITNESS_CENTERS', searchedFitnessCenters.slice(0, 5));
    commit('SET_SEARCHED_FITNESS_CENTERS', searchedFitnessCenters);
  },
  searchFitnessCenters({ state, commit }, payload) {
    const searchedFitnessCenters = state.fitnessCenter.filter(center=>center.location.includes(payload));
    commit('SET_SLICED_FITNESS_CENTERS', searchedFitnessCenters.slice(0, 5));
    commit('SET_SEARCHED_FITNESS_CENTERS', searchedFitnessCenters);
  },
  requestMoreFitnessCenters({ state, commit }, payload) {
    setTimeout(() => {
      const temp = [];
      for (let i=0; i<5; i++) {
        const spot = state.searchedFitnessCenters[state.slicedFitnessCenters.length+i];
        if (spot) {
          temp.push(spot);
        }
      }
      commit('SET_SLICED_FITNESS_CENTERS', state.slicedFitnessCenters.concat(temp));
      payload();
    }, 1500);
  }
}

export default {
  state,
  mutations,
  actions
}