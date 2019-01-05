<template>
  <div id="app" class="container-fluid">
    <div class="row">
      <div class="col s12 offset-m2 m8 offset-l3 l6">
        <div class="row">
          <div class="col s12">
            <div class="center">
              <h1 style="margin-bottom: 8px;">svg-file-icons</h1>
              <span class="tagline"> - File icons for your next JS project</span>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col s12">
            <h3>What is it?</h3>
            <img class="responsive-img" style="width: 80%" src="https://raw.githubusercontent.com/file-icons/atom/6714706f268e257100e03c9eb52819cb97ad570b/preview.png">
            <ul>
              <li>svg-file-icons takes all the icons you know and love and makes them available through a simple API</li>
              <li>
                Currently, it supports icons from
                <ul style="list-style-type: circle; margin-left: 1.5em;">
                  <li v-for="font in fontSources" :key="font.name">
                    <a target="_blank" :href="font.href">{{ font.name }}</a>
                  </li>
                </ul>
              </li>
              <li>You can import just the icons you need for your project from any of the aforementioned sources</li>
              <li>The library also includes Atom's icon database for quick lookups and <rainbow-text style="font-weight: bold; font-size: 1.2em;" text="colours"/>!</li>
            </ul>
          </div>
        </div>

        <div class="row">
          <div class="col s12">
            <h3 id="#demo">Try it out!</h3>
            <div class="row">
              <div class="col s8 m4 input-field">
                <input id="filename" type="text" v-model="filename" @keyup="onInput" placeholder="e.g. index.html">
                <label for="filename">Enter filename</label>
              </div>
              <div class="col s4">
                <div class="svg-container" v-if="filename.length > 0 && svgIconData" :style="{color: svgIconData.colour}">
                  <svg :viewBox="svgIconData.viewBox" style="fill: currentColor">
                    <path :d="svgIconData.path"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col s12">
            <h3> Caveats </h3>
            <ul>
              <li>
                <h6 class="title">Colours</h6>
                <span>Currently, there is no easy way to change the colours. The colours are obtained from atom's icon database and baked into the library.</span>
              </li>
              <li>
                <h6 class="title">Icon Sizes</h6>
                <span>
                  The sizes of icons don't all match. Atom's stylesheet has specialized handling of several icons which isn't handled by the library.
                  This is in the pipeline however, and should be fixed soon.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RainbowText from '@/components/rainbow-text'
import FileIcons from '../../src/file-icons'

export default {
  components: {
    RainbowText
  },
  data () {
    return {
      fileIcons: new FileIcons(),
      filename: '',
      svgIconData: undefined,
      fontSources: [
        {
          name: 'FontAwesome',
          href: 'https://github.com/fortawesome/font-awesome'
        },
        {
          name: 'Octicons',
          href: 'https://github.com/primer/octicons'
        },
        {
          name: 'Devicons',
          href: 'https://github.com/file-icons/devopicons'
        },
        {
          name: 'Mfizz',
          href: 'https://github.com/file-icons/mfixx'
        },
        {
          name: 'Atom',
          href: 'https://github.com/file-icons/source'
        }
      ]
    }
  },
  methods: {
    async onInput () {
      this.svgIconData = await this.fileIcons.getFileIcon(this.filename)
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

@media screen and (max-width: 366px) {
  h1 {
    font-size: 4rem;
  }
  .tagline {
    padding-left: 10em !important;
  }
}

.tagline {
  padding-left: 14em;
  font-size: 0.8em
}

#app {
  // text-align: center;
  color: #2c3e50;
}

ul li {
  & > .title {
    font-size: 1.8em;
  }
  span {
    // margin-left: 1.5em;
  }
}

.svg-container {
  margin-top: 1.5em;
  width: 32px;
}

.svg-container svg {
}
</style>
