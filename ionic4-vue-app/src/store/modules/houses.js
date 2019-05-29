import Vue from 'vue';
import houseJSON from '@/assets/data/house_sample.json';
import gmapsInit from '@/utils/gmaps';

const state = {
  houseJSON : houseJSON,
  houses: []
}

const mutations = {
  SET_HOUSES (state, payload) {
    Vue.set(state, 'houses', payload);
  },  
}

const actions = {
  requestMoreHouses({ state, commit }, payload) {
    setTimeout(() => {
      const temp = [];
      for (let i=0; i <20; i++) {
        const house = houseJSON[state.houses.length+i];
        if (house) {
          temp.push(house);
        }
      }
      commit('SET_HOUSES', state.houses.concat(temp));
      payload();
    }, 1500);
  }
}

export default {
  state,
  mutations,
  actions
}