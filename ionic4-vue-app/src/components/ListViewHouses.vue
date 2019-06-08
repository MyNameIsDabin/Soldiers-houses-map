<template>
  <div class="list-view-houses">
    <div
      class="item"
      v-for="house in slicedHouses"
      @click="SET_SELECTED_HOUSE(house)"
      :class="{'selected':house===selectedHouse}"
      :key="house.idx">
      <div>
        <div class="location">
          {{house.location}}
        </div>
        <div class="name">
          {{house.name}}
        </div>
        <div class="date">
          {{house.date}}~
        </div>
        <div class="tel">
          <span>
            <v-icon name="phone" scale="0.65"/>
            {{house.tel}}
          </span>
          <span>
            (배정세대수 {{house.count}})
          </span>
        </div>
      </div>
    </div>
    <infinite-loading 
      v-show="slicedHouses.length < searchedHouses.length"
      @infinite="loadMore"
      spinner="spiral">
    </infinite-loading>
  </div>
</template>
<script>
import InfiniteLoading from 'vue-infinite-loading';
import { mapState, mapMutations, mapActions } from 'vuex';
export default {
  name: 'ListViewHouses',
  components: {
    InfiniteLoading
  },
  data() {
    return {
    };
  },
  async mounted() {
    this.loadMore();
  },
  computed: {
    ...mapState({
      'selectedHouse' : state => state.houses.selectedHouse,
      'searchedHouses' : state => state.houses.searchedHouses,
      'slicedHouses' : state => state.houses.slicedHouses
    })
  },
  methods: {
    ...mapMutations(['SET_SELECTED_HOUSE', 'SET_SLICED_HOUSES']),
    ...mapActions(['requestMoreHouses']),
    loadMore($state) {
      this.requestMoreHouses(()=>{
        if ($state) {
          $state.loaded();
        }
      });
    },
    selectHouse(house) {
      this.SET_SELECTED_HOUSE(house);
    }
  }
}
</script>
<style scoped>
  .list-view-houses {
    background-color: #353b48;
    color: white;
    font-size: 0.8rem;
  }
  .location {
    font-weight: bold;
  }
  .item {
    padding: 3px 10px;
  }
  .item > div {
    background-color: #353b48;
    padding: 4px 10px;
  }
  .selected {
    color: #5bd2c8;
  }
</style>