<template>
  <div class="map-south-korea">
    <svg
      :viewBox="viewBox">
      <g class="south-korea">
      </g>
      <g class="buliding-container">
      </g>
      <g class="label-container">
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
      zoomScale: 1,
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
    this.initZoomEvent([".south-korea", ".label-container", ".buliding-container"]);
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
        .translate([this.width/2+4, this.height/2+8])
        .scale(scale)
        .center(center));
    },
    initZoomEvent(queries) {
      const svg = d3.select(this.$el.querySelector("svg"));
      const zoom = d3.zoom().scaleExtent([0.9, 4.5]).on("zoom", ()=>{
        queries.forEach(query=>{
          d3.select(query).attr("transform", d3.event.transform);
        });
        if (this.zoomScale !== d3.event.transform.k) {
          this.zoomScale = d3.event.transform.k;
          this.drawHouseIcons();
          this.drawRegionLabel();
        }
      });
      svg.call(zoom);
      //시작할때 확대되면서 시작
      // zoom.scaleBy(svg.transition().duration(500), 2.0);
    },
    drawMap() {
      this.drawGround();
      this.drawRegionLabel();
      this.drawHouseIcons();
    },
    drawGround() {
      const features = this.provinces.topology.features;

      d3.select(".south-korea")
        .selectAll("path.ground-shadow")
        .data(features)
        .enter()
        .append("path")
        .attr("class", "ground-shadow")
        .attr("d", this.pathShadow);

      d3.select(".south-korea")
        .selectAll("path.ground")
        .data(features)
        .enter()
        .append("path")
        .attr("class", "map-path ground")
        .attr("d", this.path);
    },
    drawRegionLabel() {
      const features = this.provinces.topology.features;
      const scale = 1/this.zoomScale;

      const textWidth = [];
      let texts = d3.select(".label-container").selectAll("text").data(features);
      texts.exit().remove();
      texts.enter().append("text");
      texts = d3.select(".label-container")
        .selectAll("text")
        .attr("class", "region")
        .attr("transform",d=>{
          let centroid = this.path.centroid(d);
          if (d.properties.name === '경기도') centroid[1] -= 20; 
          else if (d.properties.name === '충청남도') centroid[1] += 10;
          return `translate(${centroid}) scale(${scale})`})
        .text(d=>d.properties.name)
        .each(function(d, i){
          textWidth.push(this.getComputedTextLength()+14);
        });

      let rects = d3.select(".label-container").selectAll("rect").data(features);
      rects.exit().remove();
      rects.enter().append("rect");
      rects = d3.select(".label-container")
        .selectAll("rect")
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("width", (d, i)=>textWidth[i])
        .attr("height", 15)
        .attr("transform", (d, i)=>{
          let centroid = this.path.centroid(d);
          if (d.properties.name === '경기도') centroid[1] -= 20; 
          else if (d.properties.name === '충청남도') centroid[1] += 10;
          centroid[0] -= (textWidth[i]*scale)/2;
          centroid[1] -= 11*scale;
          return `translate(${centroid}) scale(${scale})`})
        .attr("fill", "#3c3c3c")

      texts.raise();
    },
    drawHouseIcons() {
      let pathCentroid = [0, 0];
      const iconPaths = d3.select(".buliding-container").selectAll("path.home-icon").data(housesJSON);
      iconPaths.exit().remove();
      iconPaths.enter()
        .append("path")
        .attr("class", "home-icon"); /* 집 모양 아이콘 path (by awesome font) */

      d3.select(".buliding-container")
        .selectAll("path.home-icon")
        .attr("d", 'M280.4 148.3c1.8-1.5 5.3-2.7 7.6-2.7 2.4 0 5.8 1.2 7.7 2.7l184.3 151.7v164c0 8.8-7.2 16-16 16l-112-0.3h0c-8.8 0-16-7.2-16-16 0 0 0 0 0-0.1v-95.6c0-8.8-7.2-16-16-16h-64c-8.8 0-16 7.2-16 16v95.7 0c0 8.8-7.1 16-15.9 16l-112.1 0.3c-8.8 0-16-7.2-16-16v-163.9zM571.6 251.5c2.4 2 4.4 6.2 4.4 9.3 0 2.4-1.2 5.8-2.7 7.6l-25.5 31c-2 2.4-6.1 4.4-9.2 4.4-2.4 0-5.8-1.2-7.7-2.8l-235.2-193.7c-1.8-1.5-5.3-2.7-7.7-2.7-2.4 0-5.8 1.2-7.6 2.7l-235.2 193.7c-1.8 1.5-5.3 2.7-7.6 2.7-3.1 0-7.3-2-9.3-4.4l-25.5-31c-1.5-1.8-2.8-5.3-2.8-7.7 0-3.1 2-7.3 4.4-9.3l253.1-208.5c7.3-6 21-10.9 30.5-10.9 9.5 0 23.2 4.9 30.5 10.9l89.5 73.7v-72.6c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v138.5z')
        .each(function(d, i) {
          const bbox = this.getBBox();
          pathCentroid = [bbox.x + bbox.width/2, bbox.y + bbox.height/2];
        })
        .attr("transform", d=>{
          const scale = 0.03 * (1/this.zoomScale);
          let coord = this.projection([d.lng, d.lat]);
          coord[0] -= pathCentroid[0]*scale;
          coord[1] -= pathCentroid[1]*scale;
          return `translate(${coord}) scale(${scale})`;
        });
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
    fill: #14b191;
    stroke: #ffffff;
    stroke-width: 1.2px;
  }
  .south-korea >>> .ground-shadow {
    fill: #203837;
    stroke: none;
  }
  .label-container >>> text.region {
    fill: white;
    text-anchor: middle;
    font-size: 0.6rem;
  }
  .building-icon {
    font-family:FontAwesome;
  }
  .buliding-container >>> .home-icon {
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
