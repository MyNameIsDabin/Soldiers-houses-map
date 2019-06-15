<template>
  <transition name="fade">
    <div class="info-view" v-if="focusedHouse" @click.stop="releaseFocusedHouse()">
      <div class="popup">
        <span class="name"> 
          {{focusedHouse.name}}
        </span>
        <span class="content">
          <v-icon name="map-marker-alt" scale="0.7"/>
          {{focusedHouse.location}}
        </span>
        <span class="content">
          <span v-if="hasSubTel(focusedHouse.tel)">
            <div>
              <v-icon name="phone" scale="0.7"/>
              {{mainTel(focusedHouse.tel)}}
            </div>
            <div>
              <v-icon name="phone" scale="0.7"/>
              {{subTel(focusedHouse.tel)}}
            </div>
          </span>
          <span v-else>
            <v-icon name="phone" scale="0.7"/>
            {{focusedHouse.tel}}
          </span>
        </span>
      </div>
    </div>
  </transition>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import * as config from '@/config'
export default {
  name: 'InfoView',
  computed: {
    ...mapState({
      'focusedHouse' : state => state.houses.focusedHouse
    })
  },
  methods: {
    ...mapMutations(['SET_FOCUSED_HOUSE']),
    releaseFocusedHouse() {
      this.SET_FOCUSED_HOUSE(null);
    },
    mainTel(tel) {
      return tel.split("/")[0];
    },
    subTel(tel) {
      return tel.split("/")[1];
    },
    hasSubTel(tel) {
      return tel.includes('/');
    }
  }
}
</script>
<style scoped>
  .info-view {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: #17171799;
    z-index: 1;
  }
  .popup {
    width: 85%;
    background-color: #2f3640;
    border-radius: 4px;
    padding: 8px 15px;
    color: white;
    display: flex;
    flex-direction: column;
  }
  .name {
    border-bottom: 1px solid #48515f;
    padding-bottom: 5px;
    color: #25e890;
    font-size: 0.9rem;
  }
  .popup svg {
    width: 15px;
  }
  .content {
    padding: 2px 4px;
  }
  .fade-enter-active, .fade-leave-active,
  .slide-enter-active, .slide-leave-active {
    transition: all .1s ease;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0; 
    transform: translateY(15px)
  }
</style>
