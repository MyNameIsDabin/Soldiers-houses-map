<template>
  <div class="map-south-korea">
    <svg
      :viewBox="viewBox">
      <g class="south-korea">
        <path
          class="map-path ground-shadow"
          :d="pathShadow(this.topology.features[0])">
        </path>
        <path
          class="map-path ground"
          :d="path(this.topology.features[0])">
        </path>
      </g>
    </svg>
  </div>
</template>
<script>
import * as d3 from 'd3'
import * as topojson from 'topojson'
import * as config from '../config'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'MapSouthKorea',
  data() {
    return {
      jsonContents : require("@/assets/topo/south-korea-topo.json"),
      topology : null,
      projection : null,
      path : null,
      pathShadow : null
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
    viewBox() {
      return `0 0 ${this.width} ${this.height}`;
    }
  },
  created() {
    this.init();
  },
  mounted() {
    console.log(this.topology.features)
  },
  methods: {
    init() {
      this.topology = topojson.feature(this.jsonContents, this.jsonContents.objects['south-korea-geo']);
      const bounds = d3.geoBounds(this.topology);
      const center = d3.geoCentroid(this.topology);
      const distance = d3.geoDistance(bounds[0], bounds[1]);
      const scale = this.height / distance / Math.sqrt(2);
      this.projection = d3.geoMercator()
        .translate([this.width/2, this.height/2])
        .scale(scale)
        .center(center);
      this.path = d3.geoPath().projection(this.projection);
      this.pathShadow = d3.geoPath().projection(d3.geoMercator()
        .translate([this.width/2+2, this.height/2+4])
        .scale(scale)
        .center(center));
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
    height: 100%;
  }
  .map-path {
    fill: #15c78a;
    stroke: white;
  }
  .ground-shadow {
    fill: #2d7f8a96;
    stroke: none;
  }
</style>

