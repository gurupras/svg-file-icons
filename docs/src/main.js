import Vue from 'vue'
import App from './App.vue'
import Footer from './components/footer'
import SideNav from './components/sidenav'

import router from './router'
import store from './store'

import '../node_modules/materialize-css/dist/js/materialize.js'
import '../node_modules/prismjs/prism.js'

import VueMarkdown from 'vue-markdown'

Vue.config.productionTip = false

Vue.component('vue-markdown', VueMarkdown)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

new Vue({
  router,
  render: h => h(SideNav)
}).$mount('#sidenav')

new Vue({
  render: h => h(Footer)
}).$mount('#footer')
