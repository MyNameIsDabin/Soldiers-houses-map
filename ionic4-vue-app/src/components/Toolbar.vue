<template>
  <div class="toolbar" @click="TOGGLE_HOUSES_LIST_VIEW">
    <div class="list-contents">
      <span class="title">
        {{menuListViewHeaderText}} | {{searchedListCount}}개
      </span>
      <span class="toggle-list-view">
        <v-icon name="caret-up"/>
      </span>
    </div>
  </div>
</template>
<script>
import * as config from '@/config'
import { mapState, mapMutations, mapGetters } from 'vuex'
export default {
  name: 'Toolbar',
  data() {
    return {
    };
  },
  computed: {
    ...mapState({
      'selectedMenu' : state => state.common.selectedMenu,
      'isOpenHousesListView' : state => state.common.isOpenHousesListView,
      'searchedHouses' : state => state.houses.searchedHouses,
      'searchedVacationSpots' : state => state.vacation_spot.searchedVacationSpots,
      'searchedFitnessCenters' : state => state.fitness_center.searchedFitnessCenters
    }),
    ...mapGetters(['menuListViewHeaderText']),
    searchedListCount() {
      switch(this.selectedMenu) {
        case config.MENU_HOUSE: return this.searchedHouses.length;
        case config.MENU_HOTEL: return this.searchedVacationSpots.length;
        case config.MENU_FITNESS_CENTER: return this.searchedFitnessCenters.length;
      }
    }
  },
  methods: {
    ...mapMutations(['TOGGLE_HOUSES_LIST_VIEW'])
  }
}
</script>
<style scoped>
  .menu-bar {
    display: flex;
    flex-direction: row;
  }
  .list-contents {
    display: flex;
    height: 40px;
    padding: 5px 15px;
    align-items: center;
    justify-content: space-between;
    background-color: #2f3640;
    color: white;
    border-bottom: 1px solid #353b48;
    box-shadow: 0px -1px 4px #2f3640;
  }
  .list-contents .title {
    padding: 8px 0;
  }
</style>
