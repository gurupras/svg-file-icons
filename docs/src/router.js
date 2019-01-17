import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import GettingStarted from '@/views/getting-started.vue'
import Usage from '@/views/usage.vue'
import Caveats from '@/views/caveats.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/getting-started',
      name: 'getting-started',
      component: GettingStarted
    },
    {
      path: '/usage',
      name: 'usage',
      component: Usage
    },
    {
      path: '/caveats',
      name: 'caveats',
      component: Caveats
    }
  ]
})
