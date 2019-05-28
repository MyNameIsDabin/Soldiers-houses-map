<template>
  <div id="main">
    <search-bar animated></search-bar>
    <map-south-korea :width="320" :height="568"></map-south-korea>
    <toolbar></toolbar>
  </div>
</template>
<script>
import * as d3 from 'd3'
import * as topojson from 'topojson'
import { mapState, mapActions } from 'vuex'
import MapSouthKorea from './components/MapSouthKorea'
import SearchBar from './components/SearchBar'
import Toolbar from './components/Toolbar'
export default {
  name: 'App',
  components : {
    MapSouthKorea, SearchBar, Toolbar
  },
  data () {
    return {
    }
  }
}
</script>
<style>
  @font-face {
    font-family: 'NanumGothic';
    src: url(~@/assets/fonts/NanumGothic.woff) format('woff')
  }
  * {
    font-family: NanumGothic;
  }
  html, body {
    padding: 0;
    margin: 0;
    height: 100%;
    width: 100%;
  }
  body {
    background: #9cdfec;
  }
  #main {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
</style>