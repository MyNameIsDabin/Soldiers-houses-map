import Vue from 'vue';

const state = {
  isOpenHousesListView: false
}

const mutations = {
  TOGGLE_HOUSES_LIST_VIEW (state) {
    state.isOpenHousesListView = !state.isOpenHousesListView;
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