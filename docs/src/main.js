import Vue from 'vue'
import App from './App.vue'
import Footer from './components/footer'
import router from './router'
import store from './store'

import '../node_modules/materialize-css/dist/js/materialize.js'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

new Vue({
  render: h => h(Footer)
}).$mount('#footer')
