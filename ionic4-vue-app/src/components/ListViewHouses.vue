<template>
  <div class="list-view-houses">
    <div
      class="item"
      v-for="house in houses"
      @click="SET_SELECTED_HOUSE(house)"
      :class="{'selected':house===selectedHouse}">
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
            <font-awesome-icon icon="phone"/>
            {{house.tel}}
          </span>
          <span>
            (배정세대수 {{house.count}})
          </span>
        </div>
      </div>
    </div>
    <infinite-loading 
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
      'houses' : state => state.houses.houses,
      'selectedHouse' : state => state.houses.selectedHouse
    })
  },
  methods: {
    ...mapMutations(['SET_SELECTED_HOUSE']),
    ...mapActions(['requestMoreHouses']),
    loadMore($state) {
      this.requestMoreHouses(()=>{
        if ($state)
          $state.loaded();
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
    background-color: #3c3c3c;
    color: white;
  }
  .location {
    font-weight: bold;
  }
  .item {
    padding: 8px 14px;
  }
  .item > div {
    padding-bottom: 8px;
    border-bottom: 1px solid #535353;
  }
  .selected {
    color: #10d8ac;
  }
</style>
