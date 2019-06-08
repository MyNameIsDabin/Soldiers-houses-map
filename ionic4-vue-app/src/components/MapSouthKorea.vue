<template>
  <div class="map-south-korea">
    <svg :viewBox="viewBox">
      <g class="south-korea"></g>
      <g class="buliding-container"></g>
      <g class="label-container"></g>
    </svg>
    <div class="zoom-buttons">
      <span @click="zoomIn()">
        <v-icon name="plus" scale="0.8"/>
      </span>
      <span @click="zoomOut()">
        <v-icon name="minus" scale="0.8"/>
      </span>
    </div>
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
      zoom: null,
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
      'selectedMenu' : state => state.common.selectedMenu,
      'selectedHouse' : state => state.houses.selectedHouse,
      'searchedHouses' : state => state.houses.searchedHouses,
      'selectedVacationSpot' : state => state.vacation_spot.selectedVacationSpot,
      'searchedVacationSpots' : state => state.vacation_spot.searchedVacationSpots,
      'selectedFitnessCenter' : state => state.fitness_center.selectedFitnessCenter,
      'searchedFitnessCenters' : state => state.fitness_center.searchedFitnessCenters,
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
      this.zoom = d3.zoom().scaleExtent([0.9, 4.5]).on("zoom", ()=>{
        queries.forEach(query=>{
          d3.select(query).attr("transform", d3.event.transform);
        });
        if (this.zoomScale !== d3.event.transform.k) {
          this.zoomScale = d3.event.transform.k;
          this.drawMap();
        }
      });
      svg.call(this.zoom);
    },
    drawMap() {
      this.drawGround();
      this.drawRegionLabel();
      this.drawIconsBySelectedMenu(this.selectedMenu);
    },
    drawGround() {
      const features = this.provinces.topology.features;

      let paths = d3.select(".south-korea").selectAll("path.ground").data(features);
      paths.exit().remove();
      paths.enter().append("path").attr("class", "ground");
      paths = d3.select(".south-korea")
        .selectAll("path.ground")
        .attr("class", "map-path ground")
        .attr("stroke-width", `${0.5*(1/this.zoomScale)}px`)
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
        .attr("fill", "#3c3c3cCC")

      texts.raise();
    },
    drawIconsBySelectedMenu(menu) {
      d3.select(".buliding-container").selectAll("path").remove();
      d3.select(".buliding-container").selectAll("ellipse").remove();
      switch(menu) {
        case config.MENU_HOUSE:
            this.drawHouseIcons();
          break;
        case config.MENU_HOTEL:
            this.drawVacationSpotIcons();
          break;
        case config.MENU_FITNESS_CENTER:
            this.drawFitnessCenterIcons();
          break;
      }
    },
    drawVacationSpotIcons() {
      this.drawIcons({
        'className': 'hotel-icon',
        'data': this.searchedVacationSpots,
        'path' : 'M560 64c8.84 0 16-7.16 16-16V16c0-8.84-7.16-16-16-16H16C7.16 0 0 7.16 0 16v32c0 8.84 7.16 16 16 16h15.98v384H16c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h240v-80c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v80h240c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16h-16V64h16zm-304 44.8c0-6.4 6.4-12.8 12.8-12.8h38.4c6.4 0 12.8 6.4 12.8 12.8v38.4c0 6.4-6.4 12.8-12.8 12.8h-38.4c-6.4 0-12.8-6.4-12.8-12.8v-38.4zm0 96c0-6.4 6.4-12.8 12.8-12.8h38.4c6.4 0 12.8 6.4 12.8 12.8v38.4c0 6.4-6.4 12.8-12.8 12.8h-38.4c-6.4 0-12.8-6.4-12.8-12.8v-38.4zm-128-96c0-6.4 6.4-12.8 12.8-12.8h38.4c6.4 0 12.8 6.4 12.8 12.8v38.4c0 6.4-6.4 12.8-12.8 12.8h-38.4c-6.4 0-12.8-6.4-12.8-12.8v-38.4zM179.2 256h-38.4c-6.4 0-12.8-6.4-12.8-12.8v-38.4c0-6.4 6.4-12.8 12.8-12.8h38.4c6.4 0 12.8 6.4 12.8 12.8v38.4c0 6.4-6.4 12.8-12.8 12.8zM192 384c0-53.02 42.98-96 96-96s96 42.98 96 96H192zm256-140.8c0 6.4-6.4 12.8-12.8 12.8h-38.4c-6.4 0-12.8-6.4-12.8-12.8v-38.4c0-6.4 6.4-12.8 12.8-12.8h38.4c6.4 0 12.8 6.4 12.8 12.8v38.4zm0-96c0 6.4-6.4 12.8-12.8 12.8h-38.4c-6.4 0-12.8-6.4-12.8-12.8v-38.4c0-6.4 6.4-12.8 12.8-12.8h38.4c6.4 0 12.8 6.4 12.8 12.8v38.4z'
      });

      if (this.selectedVacationSpot) {
        this.focusSelectedIcon(this.selectedVacationSpot.name, "path.hotel-icon", config.UNSELECTED_COLOR, config.SELECTED_COLOR);
      }
    },
    drawFitnessCenterIcons() {
      this.drawIcons({
        'className': 'dumbbel-icon',
        'data': this.searchedFitnessCenters,
        'path' : 'M104 96H56c-13.3 0-24 10.7-24 24v104H8c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h24v104c0 13.3 10.7 24 24 24h48c13.3 0 24-10.7 24-24V120c0-13.3-10.7-24-24-24zm528 128h-24V120c0-13.3-10.7-24-24-24h-48c-13.3 0-24 10.7-24 24v272c0 13.3 10.7 24 24 24h48c13.3 0 24-10.7 24-24V288h24c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zM456 32h-48c-13.3 0-24 10.7-24 24v168H256V56c0-13.3-10.7-24-24-24h-48c-13.3 0-24 10.7-24 24v400c0 13.3 10.7 24 24 24h48c13.3 0 24-10.7 24-24V288h128v168c0 13.3 10.7 24 24 24h48c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24z'
      });

      if (this.selectedFitnessCenter) {
        this.focusSelectedIcon(this.selectedFitnessCenter.name, "path.dumbbel-icon", config.UNSELECTED_COLOR, config.SELECTED_COLOR);
      }
    },
    drawHouseIcons() {
      this.drawIcons({
        'className': 'home-icon',
        'data': this.searchedHouses,
        'path' : 'M280.4 148.3c1.8-1.5 5.3-2.7 7.6-2.7 2.4 0 5.8 1.2 7.7 2.7l184.3 151.7v164c0 8.8-7.2 16-16 16l-112-0.3h0c-8.8 0-16-7.2-16-16 0 0 0 0 0-0.1v-95.6c0-8.8-7.2-16-16-16h-64c-8.8 0-16 7.2-16 16v95.7 0c0 8.8-7.1 16-15.9 16l-112.1 0.3c-8.8 0-16-7.2-16-16v-163.9zM571.6 251.5c2.4 2 4.4 6.2 4.4 9.3 0 2.4-1.2 5.8-2.7 7.6l-25.5 31c-2 2.4-6.1 4.4-9.2 4.4-2.4 0-5.8-1.2-7.7-2.8l-235.2-193.7c-1.8-1.5-5.3-2.7-7.7-2.7-2.4 0-5.8 1.2-7.6 2.7l-235.2 193.7c-1.8 1.5-5.3 2.7-7.6 2.7-3.1 0-7.3-2-9.3-4.4l-25.5-31c-1.5-1.8-2.8-5.3-2.8-7.7 0-3.1 2-7.3 4.4-9.3l253.1-208.5c7.3-6 21-10.9 30.5-10.9 9.5 0 23.2 4.9 30.5 10.9l89.5 73.7v-72.6c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v138.5z'
      });

      if (this.selectedHouse) {
        this.focusSelectedIcon(this.selectedHouse.name, "path.home-icon", config.UNSELECTED_COLOR, config.SELECTED_COLOR);
      }
    },
    drawIcons({className, data, path}) {
      let pathCentroid = [0, 0];
      const shadows = d3.select(".buliding-container").selectAll(`ellipse.icon-shadow.${className}`).data(data);
      const iconPaths = d3.select(".buliding-container").selectAll(`path.${className}`).data(data);

      shadows.exit().remove();
      shadows.enter().append("ellipse").attr("class", `icon-shadow ${className}`);

      iconPaths.exit().remove();
      iconPaths.enter().append("path").attr("class", className);

      d3.select(".buliding-container")
        .selectAll("ellipse.icon-shadow")
        .attr("rx", 20)
        .attr("ry", 10)
        .attr("opacity", 0.4)
        .attr("transform", d=>{
          const scale = 0.5 * (1/this.zoomScale);
          let coord = this.projection([d.lng, d.lat]);
          coord[0] -= pathCentroid[0]*scale;
          coord[1] -= (pathCentroid[1]-14)*scale;
          return `translate(${coord}) scale(${scale})`;
        })

      d3.select(".buliding-container")
        .selectAll(`path.${className}`)
        .attr("name", d=>d.name)
        .attr("fill", config.UNSELECTED_COLOR) 
        .attr("d", path) /* 아이콘 path (by awesome font) */
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
    },
    focusSelectedIcon(name, selection, unselectColor, selectColor) {
      let pathCentroid = [0, 0];
      d3.select(".buliding-container").selectAll(selection)
        .attr("fill", d=>name === d.name ? selectColor : unselectColor)
        .each(function(d, i) {
          const bbox = this.getBBox();
          pathCentroid = [bbox.x + bbox.width/2, bbox.y + bbox.height/2];
        })
        .attr("transform", d=>{
          const defaultScale = d.name === name ? 0.04 : 0.03;
          const scale = defaultScale * (1/this.zoomScale);
          let coord = this.projection([d.lng, d.lat]);
          coord[0] -= pathCentroid[0]*scale;
          coord[1] -= pathCentroid[1]*scale;
          return `translate(${coord}) scale(${scale})`;
        })
        .raise();
      const icon = d3.select(`${selection}[name="${name}"]`);
      if (icon) {
        icon.raise();
      }
    },
    zoomIn() {
      const svg = d3.select(this.$el.querySelector("svg"));
      this.zoom.scaleBy(svg.transition().duration(500), 1.5);
    },
    zoomOut() {
      const svg = d3.select(this.$el.querySelector("svg"));
      this.zoom.scaleBy(svg.transition().duration(500), 0.5);
    }
  },
  watch: {
    searchedHouses(houses) {
      this.drawHouseIcons();
    },
    selectedHouse(house) {
      this.focusSelectedIcon(house.name, "path.home-icon", config.UNSELECTED_COLOR, config.SELECTED_COLOR);
    },
    selectedVacationSpot(spot) {
      this.focusSelectedIcon(spot.name, "path.hotel-icon", config.UNSELECTED_COLOR, config.SELECTED_COLOR);
    },
    selectedFitnessCenter(center) {
      this.focusSelectedIcon(center.name, "path.dumbbel-icon", config.UNSELECTED_COLOR, config.SELECTED_COLOR);
    },
    selectedMenu(menu) {
      this.drawIconsBySelectedMenu(menu);
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
    background-color: #9fc7d8;
  }
  .south-korea >>> .map-path {
    fill: #ffffff;
    stroke: #4c4c4c;
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
  .house-shadow {
    fill: #00000096;
  }
  .selected path {
    fill: #ffce31;
  }
  path {
    transition: all 0.15s ease;
  }
  .zoom-buttons {
    position: fixed;
    top: 54px;
    display: flex;
    left: 8px;
    flex-direction: column;
    background-color: #ffffffd4;
    border-radius: 4px;
    box-shadow: 0px 1px 3px #969696;
  }
  .zoom-buttons span {
    padding: 5px 10px;
  }
  .zoom-buttons span:first-child {
    border-bottom: 1px solid #d2d2d2;
  }
</style>
