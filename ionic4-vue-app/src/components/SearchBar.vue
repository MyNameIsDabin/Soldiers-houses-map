<template>
  <div class="searchbar">
    <div class="input">
      <span>
        <font-awesome-icon icon="search"/>
      </span>
      <input type="search" placeholder="시,도">
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
      'searchText' : state => state.common.searchText
    })
  },
  methods: {
    ...mapMutations(['SET_SEARCH_TEXT'])
  }
}
</script>
<style scoped>
  div.searchbar {
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
    margin: 8px;
    flex-grow: 1;
    border-radius: 4px;
    background: #3c3c3c;
    border: 0px solid #272727;
    padding: 7px;
    color: white;
    -webkit-box-shadow: 0px 1px 3px #4a4a4a;
    box-shadow: 0px 1px 3px #4a4a4a;
  }
  span {
    text-align: center;
    flex-basis: 26px;
    margin-bottom: 2px;
  }
  input {
    flex-grow: 1;
    font-weight: bold;
    background: #3c3c3c;
    border: 0;
    color: white;
    padding: 0;
  }
  input:focus {
    outline: none;
  }
  svg {
    vertical-align: middle;
  }
</style>
