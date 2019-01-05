<template>
  <div style="display: inline-block">
  </div>
</template>

<script>
export default {
  name: 'rainbow-text',
  props: ['text'],
  methods: {
    generateRainbowText () {
      const { text } = this
      for (let i = 0; i < text.length; i++) {
        const charElem = document.createElement('span')
        charElem.style.color = 'hsl(' + (360 * i / text.length) + ',80%,50%)'
        charElem.innerHTML = text[i]
        this.$el.appendChild(charElem)
      }
    }
  },
  mounted () {
    this.generateRainbowText()
  }
}
</script>
