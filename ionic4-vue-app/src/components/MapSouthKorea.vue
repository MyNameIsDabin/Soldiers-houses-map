<template>
  <div class="map-south-korea">
    <svg
      :viewBox="viewBox">
      <g class="south-korea" v-if="this.topology">
        <path
          class="map-path ground-shadow"
          :d="pathShadow(this.topology.features[0])">
        </path>
        <path
          class="map-path ground"
          :d="path(this.topology.features[0])">
        </path>
      </g>
      <g class="buliding-container">
        <ellipse class="house-shadow"  
          v-for="(building, idx) in housesJSON"
          :cx="projection([building.lng, building.lat])[0]-0.5"
          :cy="projection([building.lng, building.lat])[1]+7"
          rx="8" 
          ry="4"
          :class="{'selected':selectedHouse && (selectedHouse.name===building.name)}">
        </ellipse>
        <foreignObject 
          v-for="(building, idx) in housesJSON"
          width="20"
          height="20"
          :x="projection([building.lng, building.lat])[0]-9.5"
          :y="projection([building.lng, building.lat])[1]-10"
          :key="idx"
          :class="{'selected': selectedHouse && (selectedHouse.name===building.name)}">
          <font-awesome-icon icon="home" class="home-icon"/>
        </foreignObject>
      </g>
    </svg>
  </div>
</template>
<script>
import * as d3 from 'd3'
import * as topojson from 'topojson'
import * as config from '../config'
import { mapState, mapActions } from 'vuex'
import housesJSON from '@/assets/data/house_sample.json';

export default {
  name: 'MapSouthKorea',
  data() {
    return {
      jsonContents: require("@/assets/topo/south-korea-topo.json"),
      topology: null,
      projection: null,
      path: null,
      pathShadow: null,
      elements: {},
      housesJSON
    }
  },
  props: {
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    margin: {
      type: Number,
      required: false,
      default() {
        return 50;
      }
    },
    focus: {
      type: String,
      required: false,
      default() {
        return null;
      }
    }
  },
  computed: {
    ...mapState({
      'selectedHouse' : state => state.houses.selectedHouse
    }),
    viewBox() {
      return `0 0 ${this.width} ${this.height}`;
    }
  },
  created() {
    this.init();
  },
  mounted() {
    this.initZoomEvent([".south-korea", ".buliding-container"]);
  },
  methods: {
    init() {
      this.topology = topojson.feature(this.jsonContents, this.jsonContents.objects['south-korea-geo']);
      const bounds = d3.geoBounds(this.topology);
      const center = d3.geoCentroid(this.topology);
      const distance = d3.geoDistance(bounds[0], bounds[1]);
      const scale = (this.height / distance / Math.sqrt(2)) * 1.8;
      this.projection = d3.geoMercator()
        .translate([this.width/2, this.height/2])
        .scale(scale)
        .center(center);
      this.path = d3.geoPath().projection(this.projection);
      this.pathShadow = d3.geoPath().projection(d3.geoMercator()
        .translate([this.width/2+2, this.height/2+4])
        .scale(scale)
        .center(center));
    },
    initZoomEvent(queries) {
      const svg = d3.select(this.$el.querySelector("svg"));
      const zoom = d3.zoom().on("zoom", ()=>{
        queries.forEach(query=>d3.select(query).attr("transform", d3.event.transform));
      });
      svg.call(zoom);

      //시작할때 확대되면서 시작
      // zoom.scaleBy(svg.transition().duration(500), 2.0);
    }
  },
}
</script>
<style scoped>
  svg {
    width: 100%;
    height: 100%;
  }
  .map-south-korea {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .map-path {
    fill: #15c78a;
    stroke: white;
  }
  .ground-shadow {
    fill: #2d7f8a96;
    stroke: none;
  }
  .building-icon {
    font-family:FontAwesome;
  }
  .home-icon path {
    fill: #ffffff;
  }
  .house-shadow {
    fill: #00000096;
  }
  .selected path {
    fill: red;
  }
</style>

