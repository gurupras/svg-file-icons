<template>
  <div class="row">
    <div class="col s12">
      <vue-markdown :source="usage" :breaks="false"/>
      <div class="row">
        <div class="col s12">
          <h3> Try it out </h3>
          <div class="row">
            <div class="col s6 m4">
              <demo-input :file-icons="fileIcons" class="input-field" placeholder="e.g. index.html" label="Enter filename"
                  ref="demoInput"
                  @icon="svgIconData = $event"/>
            </div>
            <div class="col s2">
              <demo-output v-if="svgIconData" :svg-icon-data="svgIconData"/>
            </div>
          </div>
          <div class="row">
            <div class="col s12">
              <h4> Add a rule </h4>
              <div class="row">
                <div class="col s6">
                  <div class="col s12 input-field">
                    <div class="regex-container" ref="regexContainer">
                      <div class="before">/</div>
                      <pre id="regex" contenteditable="true"
                          @input="onRegexInput"
                          @focus="$refs.regexContainer.classList.add('active')"
                          @blur="$refs.regexContainer.classList.remove('active')"
                          v-once
                          v-html="regex">
                      </pre>
                      <div class="after">/</div>
                    </div>
                    <label>Match Rule</label>
                  </div>

                  <div class="col s12 input-field">
                    <input type="text" id="font-family" placeholder="e.g. mfixx" class="autocomplete"
                        autocomplete="off"
                        :value="fontFamily"
                        @keyup="onFontFamilyInput">
                    <label for="font-family">Font Family</label>
                    <span class="helper-text" data-error="" data-success=""></span>
                  </div>

                  <div class="col s12 input-field">
                    <input type="text" id="icon" placeholder="e.g. html" class="autocomplete"
                        autocomplete="off"
                        :value="icon"
                        @keyup="onIconInput">
                    <label for="icon">Icon</label>
                    <span class="helper-text" data-error="" data-success=""></span>
                  </div>

                  <div class="col s12 input-field">
                    <input type="number" id="priority" placeholder="e.g. 100" class="validate"
                        :value="priority"
                        @input="priority = $event.target.value">
                    <label for="priority">Rule Priority</label>
                  </div>
                </div>
                <div class="col s6 m3 center">
                  <chrome-picker :value="color" @input="color = $event.hex" style="width: 100%;"/>
                  <div class="row center" style="margin-top: 5em;">
                    <div class="col s12 center">
                      <demo-output v-if="previewSvgData" id="preview" :svg-icon-data="previewSvgData" :style="{color}" style="display: inline;"/>
                      <button class="waves waves-effect btn btn-small" style="display: inline;"@click="addRule">Add Rule</button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col s12">
                  <vue-markdown :source="code" ref="code"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Chrome as ChromePicker } from 'vue-color'
import usage from 'raw-loader!@/../../usage.md' // eslint-disable-line import/no-webpack-loader-syntax
import FileIcons from '@/../../src/file-icons'

import DemoInput from '@/components/demo-input'
import DemoOutput from '@/components/demo-output'

import fonts from '@/../../compiled-js/fonts.json'

export default {
  name: 'usage',
  components: {
    DemoInput,
    DemoOutput,
    ChromePicker
  },
  computed: {
    code () {
      const { regex, fontFamily, icon, priority, color } = this
      this.$nextTick(() => window.Prism.highlightAllUnder(this.$el))
      return `\`\`\`js
const fileIcons = new FileIcons()
const ruleIndex = fileIcons.addRule([
  ${new RegExp(regex)},
  '${fontFamily}',
  '${icon}',
  ${priority},
  '${color}'
])
\`\`\``
    }
  },
  data () {
    return {
      usage,
      fileIcons: undefined,
      svgIconData: undefined,
      regex: '.*\\.out',
      fontFamily: 'octicons',
      icon: 'file-binary',
      priority: 100,
      color: '#D763CB',
      data: {},
      previewSvgData: undefined,
      fontFamilyInput: undefined,
      iconInput: undefined
    }
  },
  methods: {
    resetFileIcons () {
      this.fileIcons = new FileIcons()
    },
    onRegexInput (e) {
      try {
        const regex = new RegExp(e.target.innerText)
        this.regex = e.target.innerText
        e.target.parentNode.querySelector('.helper-text').dataset.error = ''
        e.target.classList.remove('invalid')
        e.target.classList.add('valid')
      } catch (err) {
        e.target.parentNode.querySelector('.helper-text').dataset.error = 'Invalid regular expression'
        e.target.classList.add('invalid')
        e.target.classList.remove('valid')
      }
    },
    onFontFamilyInput (e) {
      this.fontFamily = e.target.value.trim().toLowerCase()
      const fonts = new Set(Object.keys(this.data))
      if (!fonts.has(this.fontFamily)) {
        e.target.classList.add('invalid')
        e.target.classList.remove('valid')
        this.iconInput.updateData({})
      } else {
        this.updateIconAutocomplete(this.fontFamily)
        e.target.classList.remove('invalid')
        e.target.classList.add('valid')
      }
    },
    async onIconInput (e) {
      this.icon = e.target.value.trim().toLowerCase()
      const fontFamily = this.data[this.fontFamily] || {}
      const icons = new Set(fontFamily.icons || [])
      if (!icons.has(this.icon)) {
        e.target.classList.add('invalid')
        e.target.classList.remove('valid')
      } else {
        e.target.classList.remove('invalid')
        e.target.classList.add('valid')
        this.previewSvgData = await fontFamily.loadIcon(this.icon)
      }
    },
    addRule () {
      const { regex, fontFamily, icon, priority, color } = this
      const idx = this.fileIcons .addRule([
        new RegExp(regex),
        fontFamily,
        icon,
        priority,
        color
      ])
      this.$refs.demoInput.getIcon()
    },
    updateIconAutocomplete (fontFamily) {
      const data = {}
      this.data[this.fontFamily].icons.forEach(icon => { data[icon] = null })
      this.iconInput.updateData(data)
    }
  },
  async beforeMount () {
    const data = {}

    for (const font of fonts) {
      const fontIcons = (await import(`@/../../compiled-js/${font}/icons.json`)).default
      const iconClass = (await import(`@/../../compiled-js/${font}/index`)).default
      data[font] = {
        icons: fontIcons,
        loadIcon: iconClass.loadIcon
      }
    }
    this.$set(this, 'data', data)
    const acData = {}
    fonts.forEach(font => { acData[font] = null })

    const fontFamilyInputEl = this.$el.querySelector('#font-family')
    const iconInputEl = this.$el.querySelector('#icon')
    this.fontFamilyInput = window.M.Autocomplete.init(fontFamilyInputEl, {
      data: acData
    })

    this.iconInput = window.M.Autocomplete.init(iconInputEl)
    this.resetFileIcons()

    this.$refs.demoInput.filename = 'a.out'
    this.$refs.demoInput.getIcon()
    window.M.updateTextFields()
    if (this.fontFamily) {
      this.updateIconAutocomplete(this.fontFamily)
    }
    if (this.icon) {
      this.previewSvgData = await this.data[this.fontFamily].loadIcon(this.icon)
    }
  }
}
</script>

<style lang="scss" scoped>
.regex-container {
  width: 100%;
  display: inline-block;
  position: relative;
  vertical-align: baseline;
  border: 1px solid;
  border-radius: 3px;
  border-color: lightgrey;
  padding: 4px 0;
  @media screen and (max-width: 444px) {
    font-size: 0.8em !important;
  }

  &.active {
    border-color: rgb(95, 137, 187);
  }

  #regex {
    display: inline-block;
    margin: 0 1em;
    height: 1.2em;
    vertical-align: middle;
    font-family: monospace;
    line-height: 1em;
    width: calc(100% - 2em);
    outline: none;
    overflow-x: hidden;
    overflow-y: hidden;
    white-space: pre-wrap;
    word-wrap: normal;
    float: left;
  }
  div {
    display: inline-block;
  }

  .before, .after {
    position: absolute;
    top: 0;
    transform: translateY(0.1em);
    margin-top: auto;
    vertical-align: top;
    font-family: monospace;
    color: grey;
    margin: 0 4px;
    @media screen and (max-width: 444px) {
      margin: 0 1px;
    }
  }
  .before {
    left: 0;
  }
  .after {
    right: 0;
  }
}
label {
  transform: translateY(-1.8em) scale(0.8);
}
/deep/ #preview {
  margin: 0 8px;
  svg {
    vertical-align: bottom;
    width: 24px;
    height: 24px;
  }
}
</style>
