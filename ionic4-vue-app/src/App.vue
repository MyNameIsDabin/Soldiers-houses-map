<template>
  <div id="main">
    <search-bar></search-bar>
    <map-south-korea :width="320" :height="568"></map-south-korea>
    <div class="list-view-bar" :class="{'opened':isOpenHousesListView}">
      <toolbar></toolbar>
      <list-view-houses v-show="selectedMenu===0" class="list-view-wrapper"></list-view-houses>
      <list-view-vacation-spots v-show="selectedMenu===1" class="list-view-wrapper"></list-view-vacation-spots>
      <list-view-fitness-centers v-show="selectedMenu===2" class="list-view-wrapper"></list-view-fitness-centers>
    </div>
    <bottom-menu></bottom-menu>
  </div>
</template>
<script>
import * as d3 from 'd3'
import * as topojson from 'topojson'
import gmapsInit from '@/utils/gmaps';
import { mapState, mapMutations, mapActions } from 'vuex'
import MapSouthKorea from '@/components/MapSouthKorea'
import SearchBar from '@/components/SearchBar'
import Toolbar from '@/components/Toolbar'
import ListViewHouses from '@/components/ListViewHouses.vue'
import ListViewFitnessCenters from '@/components/ListViewFitnessCenters.vue'
import ListViewVacationSpots from '@/components/ListViewVacationSpots.vue'
import BottomMenu from '@/components/BottomMenu'

// import datas from '@/assets/data/datas.json';
export default {
  name: 'App',
  components : {
    MapSouthKorea, SearchBar, Toolbar, ListViewHouses, ListViewFitnessCenters, ListViewVacationSpots, BottomMenu
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      'isOpenHousesListView' : state => state.common.isOpenHousesListView,
      'selectedMenu' : state => state.common.selectedMenu,
      'houses' : state => state.houses.houses,
    })
  },
  methods: {
    ...mapMutations(['SET_SEARCH_TEXT', 'SET_SEARCHED_HOUSES', 'SET_SLICED_HOUSES']),
    ...mapActions(['searchVacationSpots', 'searchFitnessCenters', 'searchHouses']),
    loadInit() {
      this.SET_SEARCH_TEXT("");
      this.searchVacationSpots("");
      this.searchFitnessCenters("");
      this.searchHouses("");
    }
  },
  async mounted() {
    try {
      this.loadInit();
      // // 에라이 ㅅㅂ 공공데이터 수준.. 위경도 따로 받아서 저장했음..
      // await gmapsInit();
      // const map = new google.maps.Map(this.$el);
      //   console.log(datas)
      // const geocoder = new google.maps.Geocoder();
      // const jsonArr = [];
      // const test = async ()=> {
      //   for(let house of datas) {
      //     console.log(house.name);
      //     const geocoder = new google.maps.Geocoder();
      //     const arrPush = () => {
      //       return new Promise((resolve, reject)=>{
      //         geocoder.geocode({ address: `${house.location}` }, (results, status) => {
      //           if (status !== 'OK' || !results[0]) {
      //             // throw new Error(status)
      //             console.log(status)
      //             resolve();
      //           } else {
      //             const lat = results[0].geometry.location.lat();
      //             const lng = results[0].geometry.location.lng();
      //             const obj = Object.assign(house, {
      //               'lat' : lat,
      //               'lng' : lng
      //             });
      //             delete obj.row;
      //             jsonArr.push(obj);
      //           }
      //           setTimeout(() => {
      //             resolve();
      //           }, 1000);
      //         });
      //       });
      //     }
      //     await arrPush();
      //   }
      // };
      // await test();

      // const data = JSON.stringify(jsonArr)
      // const blob = new Blob([data], {type: 'text/plain'})
      // const e = document.createEvent('MouseEvents'),
      // a = document.createElement('a');
      // a.download = "fitness_center.json";
      // a.href = window.URL.createObjectURL(blob);
      // a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
      // e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      // a.dispatchEvent(e);
    } catch (error) {
      console.error(error);
    }
  }
}
</script>
<style>  
  @font-face {
    font-family: 'NotoSansKR';
    src: url(~@/assets/fonts/NotoSansKR-Regular.woff) format('woff')
  }
  * {
    font-family: 'NotoSansKR';
  }
  html, body {
    padding: 0;
    margin: 0;
    height: 100%;
    width: 100%;
  }
  #main {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .list-view-wrapper {
    overflow: auto;
    height: 100%;
  }
  .list-view-bar {
    position: fixed;
    width: 100%;
    height: 100%;
    top: calc(100% - 89px);
    transition: all 0.5s cubic-bezier(0.42, 0.04, 0.16, 1);
  }
  .list-view-bar.opened {
    top: calc(40%);
    height: calc(60% - 89px);
  }
</style>