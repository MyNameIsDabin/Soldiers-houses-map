<template>
  <div class="list-view-houses">
    <div v-for="house in houses" class="item">
      <div>
        <div class="location">
          {{house.location}}
        </div>
        <div class="name">
          {{house.name}}
        </div>
        <div class="date">
          {{house.date}}
        </div>
      </div>
    </div>
    <infinite-loading @infinite="loadMore">
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
      'houses' : state => state.houses.houses
    })
  },
  methods: {
    ...mapActions(['requestMoreHouses']),
    loadMore($state) {
      this.requestMoreHouses(()=>{
        if ($state)
          $state.loaded();
      });
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
    font-size: 1.0rem;
    font-weight: bold;
  }
  .item {
    padding: 8px 14px;
    padding-top: 0px;
  }
  .item > div {
    padding-bottom: 8px;
    border-bottom: 1px solid #535353;
  }
  .slide-up { transition: all 0.25s; } .slide-up-enter-active { transition: all 0.25s ease; } .slide-up-leave-active { transition: all 0.25s cubic-bezier(1, 0.5, 0.8, 1); } .slide-up-enter, .slide-up-leave-active { opacity: 0; transform: translateY(100%); }
</style>
