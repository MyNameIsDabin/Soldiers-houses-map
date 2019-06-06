<template>
  <div class="toolbar" @click="TOGGLE_HOUSES_LIST_VIEW">
    <div class="list-contents">
      <span class="title">
        군 주택 특별공급 | {{this.searchedHouses.length}}개
      </span>
      <span class="toggle-list-view">
        <v-icon v-if="!isOpenHousesListView" name="caret-up"/>
        <v-icon v-else name="caret-down"/>
      </span>
    </div>
  </div>
</template>
<script>
import * as config from '@/config'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'Toolbar',
  data() {
    return {
    };
  },
  computed: {
    ...mapState({
      'isOpenHousesListView' : state => state.common.isOpenHousesListView,
      'searchedHouses' : state => state.houses.searchedHouses,
      'houseJSON' : state => state.houses.houseJSON
    })
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
    padding: 5px 20px;
    align-items: center;
    justify-content: space-between;
    background-color: #3c3c3c;
    color: white;
    border-bottom: 1px solid #535353;
    box-shadow: 0px -1px 5px #4a4a4a;
  }
  .list-contents .title {
    padding: 8px 0;
  }
</style>
