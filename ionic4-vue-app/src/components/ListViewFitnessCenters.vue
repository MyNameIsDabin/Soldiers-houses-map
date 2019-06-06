<template>
  <div class="list-view-houses">
    <div
      class="item"
      v-for="center in slicedFitnessCenters"
      @click="SET_SELECTED_FITNESS_CENTER(center)"
      :class="{'selected':center===selectedFitnessCenter}"
      :key="center.idx">
      <div>
        <div class="location">
          {{center.location}}
        </div>
        <div class="name">
          {{center.name}}
        </div>
        <div class="tel">
          <span>
            <v-icon name="phone"/>
            {{center.tel}}
          </span>
          <span>
            <!-- (배정세대수 {{house.count}}) -->
          </span>
        </div>
      </div>
    </div>
    <infinite-loading 
      v-show="slicedFitnessCenters.length < searchedFitnessCenters.length"
      @infinite="loadMore"
      spinner="spiral">
    </infinite-loading>
  </div>
</template>
<script>
import InfiniteLoading from 'vue-infinite-loading';
import { mapState, mapMutations, mapActions } from 'vuex';
export default {
  name: 'ListViewFitnessCenters',
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
      'selectedFitnessCenter' : state => state.fitness_center.selectedFitnessCenter,
      'searchedFitnessCenters' : state => state.fitness_center.searchedFitnessCenters,
      'slicedFitnessCenters' : state => state.fitness_center.slicedFitnessCenters
    })
  },
  methods: {
    ...mapMutations(['SET_SELECTED_FITNESS_CENTER', 'SET_SLICED_FITNESS_CENTERS']),
    ...mapActions(['requestMoreFitnessCenters']),
    loadMore($state) {
      this.requestMoreFitnessCenters(()=>{
        if ($state) {
          $state.loaded();
        }
      });
    },
    selectFitnessCenter(fitnessCenter) {
      this.SET_SELECTED_FITNESS_CENTER(fitnessCenter);
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
    color: #ffe207;
  }
</style>
