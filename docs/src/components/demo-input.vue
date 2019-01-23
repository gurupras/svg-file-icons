<template>
  <div>
    <input id="filename" type="text" v-model.trim="filename" @keyup="onInput" placeholder="e.g. index.html">
    <label for="filename">Enter filename</label>
  </div>
</template>

<script>
import FileIcons from '@/../../src/file-icons'

export default {
  name: 'demo-input',
  props: {
    value: {
      type: String,
      default: undefined
    },
    placeholder: {
      type: String,
      default: 'index.html'
    },
    label: {
      type: String,
      default: 'Filename'
    },
    fileIcons: {
      type: Object,
      default () {
        return new FileIcons()
      }
    }
  },
  data () {
    return {
      filename: ''
    }
  },
  methods: {
    async onInput (e) {
      const { target: { value } } = e
      if (value.trim() === '') {
        return this.$emit('icon', undefined)
      }
      this.getIcon()
    },
    async getIcon () {
      this.$emit('icon', await this.fileIcons.getFileIcon(this.filename))
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
