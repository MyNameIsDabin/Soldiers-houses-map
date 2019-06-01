import Vue from 'vue';
import * as config from '@/config';

const state = {
  isOpenHousesListView: false,
  selectedMenu: config.MENU_MAP,
  searchText: ""
}

const mutations = {
  TOGGLE_HOUSES_LIST_VIEW(state) {
    state.isOpenHousesListView = !state.isOpenHousesListView;
  },
  SET_SELECTED_MENU(state, payload) {
    state.selectedMenu = payload;
  },
  SET_SEARCH_TEXT(state, payload) {
    console.log(payload);
    state.searchText = payload;
  }
  // SET_BOARD_SIZE (state, payload) {
  //   Vue.set(state.boardSize, 'width', payload[0]);
  //   Vue.set(state.boardSize, 'height', payload[1]);
  // },  
}

const actions = {
  // someAsyncTask ({ commit }) {
  //   // do something async
  //   commit('INCREMENT_MAIN_COUNTER')
  // }
}

export default {
  state,
  mutations,
  actions
}