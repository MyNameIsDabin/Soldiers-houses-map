<template>
  <div class="info-view-house">
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import * as config from '@/config'
export default {
  name: 'InfoViewHouse',
  data() {
    return {
    }
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
 
</style>
