<template>
  <main id="app" class="container-fluid">
    <div class="row">
      <div class="col s12 offset-m1 m10 offset-l3 l6">
        <div class="row" style="margin-bottom: 0;">
          <div class="col s12">
            <div class="center">
              <h1 style="margin-top: 0.2em; margin-bottom: 8px;">svg-file-icons</h1>
              <span class="tagline"> - File icons for your next JS project</span>
            </div>
          </div>
        </div>
        <router-view/>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  watch: {
    $route () {
      this.$nextTick(window.Prism.highlightAll)
    }
  },
  mounted () {
    window.app = this
  }
}
</script>
<style lang="scss">
@import './styles/app';
@import '../node_modules/materialize-css/sass/materialize';
@import '../node_modules/prismjs/themes/prism.css';

body {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

main {
  flex: 1 0 auto;
}

header, main, footer {
  padding-left: 300px;
}

@media only screen and (max-width : 992px) {
  header, main, footer {
    padding: 0 32px;
  }
}

@media only screen and (min-width: 992px) and (max-width: 1070px) {
  h1 {
    font-size: 3.7rem;
  }
  .tagline {
    padding-left: 12em !important;
  }
}

@media screen and (max-width: 444px) {
  h1 {
    font-size: 4rem;
  }
  .tagline {
    padding-left: 10em !important;
  }
}

h3 {
  margin-top: 1.2rem;
}

.tagline {
  padding-left: 14em;
  font-size: 0.8em
}

footer {}
</style>
