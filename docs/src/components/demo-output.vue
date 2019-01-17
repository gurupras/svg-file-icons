<template>
  <div class="svg-container" :style="{color: svgIconData.colour}">
    <svg :viewBox="svgIconData.viewBox" style="fill: currentColor">
      <path :d="svgIconData.path"/>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'demo-output',
  props: ['svgIconData']
}
</script>

<style lang="scss" scoped>
</style>
