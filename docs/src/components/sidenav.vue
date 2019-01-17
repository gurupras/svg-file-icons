<template>
  <div>
    <div id="sidenav" class="sidenav sidenav-fixed">
      <ul class="sidenav-content">
        <li v-for="link in links" :key="link.name" :class="{active: $route.name === link.name}">
          <router-link :to="link.path">{{link.label}}</router-link>
        </li>
      </ul>
    </div>

    <a data-target="sidenav" class="sidenav-trigger">
      <i class="material-icons">menu</i>
    </a>
  </div>
</template>

<script>
export default {
  name: 'side-nav',
  data () {
    return {
      links: [
        {
          path: '/',
          name: 'home',
          label: 'Home'
        },
        // {
        //   path: '/getting-started',
        //   name: 'getting-started',
        //   label: 'Getting Started'
        // },
        {
          path: '/usage',
          name: 'usage',
          label: 'Usage'
        },
        {
          path: '/caveats',
          name: 'caveats',
          label: 'Caveats'
        }
      ]
    }
  },
  mounted () {
    window.M.Sidenav.init(this.$el.querySelector('.sidenav'))
  }
}
</script>

<style lang="scss" scoped>
.router-link-exact-active {
  font-weight: bolder;
}

.sidenav-content {
  margin-top: 20vh;
}
.sidenav-trigger {
  cursor: pointer;
  position: fixed;
  top: 10px;
  color: black;
  padding-left: 8px
}
</style>
