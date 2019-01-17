<template>
  <div class="row">
    <div class="col s12">
      <h2> Caveats </h2>
        <vue-markdown :source="caveats"/>
    </div>
  </div>
</template>

<script>
import caveats from 'raw-loader!@/../../caveats.md' // eslint-disable-line import/no-webpack-loader-syntax

export default {
  name: 'caveats',
  data () {
    return {
      caveats
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ h3 {
  font-size: 1.8rem;
}
</style>
