import Vue from 'vue';
import houseJSON from '@/assets/data/house_sample.json';
import gmapsInit from '@/utils/gmaps';

const state = {
  houses: houseJSON.reverse(),
  selectedHouse: null,
  searchedHouses: [],
  slicedHouses: []    //위의 검색된 분양목록(searchedHouses) 에서 10개씩 뽑아서 리스트뷰에 표츌할 것
}

const mutations = {
  SET_HOUSES(state, payload) {
    Vue.set(state, 'houses', payload);
  },  
  SET_SELECTED_HOUSE(state, payload) {
    Vue.set(state, 'selectedHouse', payload);
  },
  SET_SEARCHED_HOUSES(state, payload) {
    Vue.set(state, 'searchedHouses', payload);
  },
  SET_SLICED_HOUSES(state, payload) {
    Vue.set(state, 'slicedHouses', payload);
  }
}

const actions = {
  requestMoreHouses({ state, commit }, payload) {
    setTimeout(() => {
      const temp = [];
      for (let i=0; i<5; i++) {
        const house = state.searchedHouses[state.slicedHouses.length+i];
        if (house) {
          temp.push(house);
        }
      }
      commit('SET_SLICED_HOUSES', state.slicedHouses.concat(temp));
      payload();
    }, 1500);
  }
}

export default {
  state,
  mutations,
  actions
}