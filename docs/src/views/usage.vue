<template>
  <div class="row">
    <div class="col s12">
      <vue-markdown :source="usage" :breaks="false"/>
    </div>
  </div>
</template>

<script>
import usage from 'raw-loader!@/../../usage.md' // eslint-disable-line import/no-webpack-loader-syntax

export default {
  name: 'usage',
  data () {
    return {
      usage
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
