import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import { library } from '@fortawesome/fontawesome-svg-core'
import { 
  faCaretUp,
  faCaretDown,
  faMapMarkedAlt,
  faHome,
  faBuilding,
  faCircle,
  faPhone,
  faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import InfiniteScroll from 'vue-infinite-scroll'

library.add(faCaretUp)
library.add(faCaretDown)
library.add(faMapMarkedAlt)
library.add(faHome)
library.add(faBuilding)
library.add(faCircle)
library.add(faPhone)
library.add(faSearch)

Vue.component('font-awesome-icon', FontAwesomeIcon)
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

