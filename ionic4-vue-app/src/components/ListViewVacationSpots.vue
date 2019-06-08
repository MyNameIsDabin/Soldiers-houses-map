<template>
  <div class="list-view-houses">
    <div
      class="item"
      v-for="spot in slicedVacationSpots"
      @click="SET_SELECTED_VACATION_SPOT(spot)"
      :class="{'selected':spot===selectedVacationSpot}"
      :key="spot.idx">
      <div>
        <div class="location">
          {{spot.location}}
        </div>
        <div class="name">
          {{spot.name}}
        </div>
        <div class="tel">
          <span>
            <v-icon name="phone" scale="0.65"/>
            {{spot.tel}}
          </span>
          <span>
            <!-- (배정세대수 {{spot.count}}) -->
          </span>
        </div>
      </div>
    </div>
    <infinite-loading 
      v-show="slicedVacationSpots.length < searchedVacationSpots.length"
      @infinite="loadMore"
      spinner="spiral">
    </infinite-loading>
  </div>
</template>
<script>
import InfiniteLoading from 'vue-infinite-loading';
import { mapState, mapMutations, mapActions } from 'vuex';
export default {
  name: 'ListViewVacationSpots',
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
      'selectedVacationSpot' : state => state.vacation_spot.selectedVacationSpot,
      'searchedVacationSpots' : state => state.vacation_spot.searchedVacationSpots,
      'slicedVacationSpots' : state => state.vacation_spot.slicedVacationSpots
    })
  },
  methods: {
    ...mapMutations(['SET_SELECTED_VACATION_SPOT', 'SET_SLICED_VACATION_SPOTS']),
    ...mapActions(['requestMoreVacationSpots']),
    loadMore($state) {
      this.requestMoreVacationSpots(()=>{
        if ($state) {
          $state.loaded();
        }
      });
    },
    selectSpot(spot) {
      this.SET_SELECTED_VACATION_SPOT(spot);
    }
  }
}
</script>
<style scoped>
  .list-view-houses {
    background-color: #0d1119;
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
    background-color: #1b202b;
    padding: 4px 10px;
    border-radius: 5px;
    box-shadow: 0px 2px 5px #000000d9;
  }
  .selected {
    color: #5bd2c8;
  }
</style>