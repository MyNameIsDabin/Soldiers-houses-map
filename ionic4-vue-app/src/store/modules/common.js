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

const getters = {
  menuListViewHeaderText(state) {
    switch(state.selectedMenu) {
      case config.MENU_HOUSE: return "군 주택 특별공급";
      case config.MENU_HOTEL: return "편의시설 (호텔·콘도)";
      case config.MENU_FITNESS_CENTER: return "체력 단력장";
    }
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}