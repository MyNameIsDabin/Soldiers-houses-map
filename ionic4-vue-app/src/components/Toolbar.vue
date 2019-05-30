<template>
  <div class="toolbar" @click="TOGGLE_HOUSES_LIST_VIEW">
    <span class="title">
      군 주택 특별공급 | {{this.houseJSON.length}}개
    </span>
    <span class="toggle-list-view">
      <font-awesome-icon v-if="!isOpenHousesListView" icon="caret-up"/>
      <font-awesome-icon v-else icon="caret-down"/>
    </span>
  </div>
</template>
<script>
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
      'houses' : state => state.houses.houses,
      'houseJSON' : state => state.houses.houseJSON
    })
  },
  methods: {
    ...mapMutations(['TOGGLE_HOUSES_LIST_VIEW'])
  }
}
</script>
<style scoped>
  .toolbar {
    display: flex;
    height: 40px;
    padding: 5px 20px;
    align-items: center;
    justify-content: space-between;
    background-color: #3c3c3c;
    color: white;
    border-bottom: 1px solid #535353;
  }
  .toolbar .title {
    padding: 8px 0;
  }
</style>
