import * as config from '@/config';

const state = {
  isOpenHousesListView: false,
  selectedMenu: config.MENU_HOUSE,
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
    state.searchText = payload;
  }
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