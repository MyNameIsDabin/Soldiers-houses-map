import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import InfiniteScroll from 'vue-infinite-scroll'
import 'vue-awesome/icons/flag'
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'

Vue.component('v-icon', Icon)
Vue.use(InfiniteScroll)

Vue.config.ignoredElements = [/^ion-/]  //ignore "Unknown custom element"
Vue.config.productionTip = false

new Vue({
  router,
  store,
  directives : {
    InfiniteScroll
  },
  render: h => h(App)
}).$mount('#app')

