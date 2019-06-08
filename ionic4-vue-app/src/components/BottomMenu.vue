<template>
  <div class="bottom-menu">
    <span 
      class="button" 
      v-for="button in buttonList"
      :class="{'selected':button.idx===selectedMenu}"
      @click="SET_SELECTED_MENU(button.idx)"
      :key="button.idx">
      <v-icon :name="button.icon" scale="1.3"/>
      <span>{{button.text}}</span>
    </span>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import * as config from '@/config'
export default {
  name: 'BottomMenu',
  data() {
    return {
      buttonList: config.MENU_LIST
    };
  },
  computed: {
    ...mapState({
      'selectedMenu' : state => state.common.selectedMenu
    })
  },
  methods: {
    ...mapMutations(['SET_SELECTED_MENU'])
  }
}
</script>
<style scoped>
  .bottom-menu {
    display: flex;
    position: fixed;
    width: 100%;
    align-items: center;
    justify-content: space-evenly;
    background-color: #0d1119;
    bottom: 0;
    height: 50px;
    color: white;
    z-index: 1;
    /* border-top: 1px solid #535353; */
  }
  .button {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    font-size: 1.3rem;
    flex-grow: 1;
  }
  .button span {
    font-size: 0.7rem;
  }
  .selected {
    color: #5bd2c8;
    transition: all 0.4s cubic-bezier(0.07, 0.38, 0.04, 1.28);
  }
</style>
