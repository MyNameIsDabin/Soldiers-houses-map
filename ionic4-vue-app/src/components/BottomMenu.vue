<template>
  <div class="bottom-menu">
    <span 
      class="button" 
      v-for="button in buttonList"
      :class="{'selected':button.idx===selectedMenu}"
      @click="SET_SELECTED_MENU(button.idx)">
      <font-awesome-icon :icon="button.icon"/>
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
      buttonList: [{
        icon: 'home',
        text: '홈',
        idx: config.MENU_HOME
      },{
        icon: 'map-marked-alt',
        text: '지도',
        idx: config.MENU_MAP
      }]
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
    background-color: #3c3c3c;
    bottom: 0;
    height: 50px;
    color: white;
    z-index: 1;
    border-top: 1px solid #535353;
  }
  .button {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    font-size: 1.3rem;
    flex-grow: 1;
    height: 100%;
  }
  .button span {
    font-size: 0.75rem;
  }
  .selected {
    color: #ffce31;
    transition: all 0.4s cubic-bezier(0.07, 0.38, 0.04, 1.28);
  }
</style>
