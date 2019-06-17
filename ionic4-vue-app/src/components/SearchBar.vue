<template>
  <div class="searchbar">
    <div class="input">
      <span>
        <v-icon name="search"/>
      </span>
      <input 
        type="search"
        placeholder="시,도"
        :value="searchText"
        @input.stop="search">
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: 'SearchBar',
  data() {
    return {
    };
  },
  computed: {
    ...mapState({
      'houses' : state => state.houses.houses,
      'searchText' : state => state.common.searchText
    })
  },
  methods: {
    ...mapMutations(['SET_SEARCH_TEXT', 'SET_SEARCHED_HOUSES', 'SET_SLICED_HOUSES']),
    ...mapActions(['searchVacationSpots', 'searchFitnessCenters', 'searchHouses']),
    search(e) {
      const text = e.target.value;
      this.SET_SEARCH_TEXT(text);
      this.searchHouses(text);
      this.searchFitnessCenters(text);
      this.searchVacationSpots(text);
    }
  }
}
</script>
<style scoped>
  div.searchbar {
    top: 0px;
    width: 100%;
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
  }
  .input {
    display: flex;
    justify-content: center;
    flex-direction: row;
    flex-grow: 1;
    background: #2f3640e0;
    padding: 7px;
    color: white;
    box-shadow: 0px 1px 3px #35444e70;
  }
  span {
    text-align: center;
    flex-basis: 26px;
    margin-bottom: 2px;
  }
  input {
    flex-grow: 1;
    font-weight: bold;
    background: none;
    border: 0;
    color: white;
    padding: 0;
  }
  input:focus {
    outline: none;
  }
  input::placeholder {
    color: #ffffffa1;
  }
  svg {
    vertical-align: middle;
  }
</style>
