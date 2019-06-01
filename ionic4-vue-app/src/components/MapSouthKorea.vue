<template>
  <div class="map-south-korea">
    <svg
      :viewBox="viewBox">
      <g class="south-korea">
      </g>
      <g class="buliding-container">
        <!-- <foreignObject 
          v-for="(building, idx) in housesJSON"
          :width="30"
          :height="30"
          :x="projection([building.lng, building.lat])[0]-9.1"
          :y="projection([building.lng, building.lat])[1]-15"
          :key="idx"
          :name="building.name"
          class="home-icon"
          :class="{'selected': selectedHouse && (selectedHouse.name===building.name)}">
          <div>
            <font-awesome-icon icon="home" :style="{'transform': `scale(${1/zoomScale})`, 'transform-origin': '50% 50%'}"/>
          </div>
        </foreignObject> -->
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
      municipalities : {
        'jsonContents' : require('@/assets/topo/skorea-municipalities-2018-topo.json'),
        'topology' : null
      },
      provinces : {
        'jsonContents' : require('@/assets/topo/skorea-provinces-2018-topo-simple.json'),
        'topology' : null
      },
      topology: null,
      projection: null,
      path: null,
      pathShadow: null,
      elements: {},
      housesJSON,
      zoomScale: 1
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
    this.drawMap();
  },
  methods: {
    init() {
      this.provinces.topology = topojson.feature(
        this.provinces.jsonContents, 
        this.provinces.jsonContents.objects['skorea_provinces_2018_geo']);

      const bounds = d3.geoBounds(this.provinces.topology);
      const center = d3.geoCentroid(this.provinces.topology);
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
      const zoom = d3.zoom().scaleExtent([0.8, 10]).on("zoom", ()=>{
        queries.forEach(query=>{
          d3.select(query).attr("transform", d3.event.transform);
        });
      });
      svg.call(zoom);

      //시작할때 확대되면서 시작
      // zoom.scaleBy(svg.transition().duration(500), 2.0);
    },
    drawMap() {
      this.drawGround();
      // this.drawHouseIcons();
    },
    drawGround() {
      const features = this.provinces.topology.features;

      d3.select(".south-korea")
        .selectAll("path")
        .data(features)
        .enter()
        .append("path")
        .attr("class", "map-path ground")
        .attr("d", this.path);

      d3.select(".south-korea")
        .selectAll("text")
        .data(features)
        .enter()
        .append("text")
        .attr("transform",d=>{
          let centroid = this.path.centroid(d);
          if (d.properties.name === '경기도') centroid[1] -= 20; 
          else if (d.properties.name === '충청남도') centroid[1] += 10;
          return "translate(" + centroid + ")"})
        .attr("class", "region")
        .text(d=>d.properties.name);
    },
    drawHouseIcons() {
      const fontHTML = `
      <font-awesome-icon icon="home" 
        :style="{'transform': 'scale(${1/this.zoomScale})'}, 
        'transform-origin': '50% 50%'}"/>`;

      d3.select(".buliding-container")
        .selectAll("foreignObject")
        .data(housesJSON)
        .enter()
        .append("foreignObject")
        .attr("width", 30)
        .attr("height", 30)
        .attr("x", d=>this.projection([d.lng, d.lat])[0]-9)
        .attr("y", d=>this.projection([d.lng, d.lat])[1]-15)
        .appned("xhtml:div")
        .html(fontHTML)
    }
  },
  watch: {
    selectedHouse(house) {
      const icon = d3.select(`.home-icon[name="${house.name}"]`);
      if (icon) {
        icon.raise();
      }
    }
  }
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
  .south-korea >>> .map-path {
    fill: #15c78a;
    stroke: white;
    stroke-width: 0.1px;
  }
  .south-korea >>> text.region {
    text-anchor: middle;
    font-size: 0.7rem;
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
    fill: #ffce31;
  }
  path {
    transition: all 0.15s ease;
  }
</style>

