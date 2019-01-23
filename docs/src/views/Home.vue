<template>
  <div class="row">
    <div class="col s12">
      <div class="row">
        <div class="col s12">
          <h3>What is it?</h3>
          <img class="responsive-img" style="width: 75%" src="https://raw.githubusercontent.com/file-icons/atom/6714706f268e257100e03c9eb52819cb97ad570b/preview.png">
          <ul>
            <li>svg-file-icons takes all the icons you know and love and makes them available through a simple API</li>
            <li>
              Currently, it supports icons from
              <ul class="font-sources-ul">
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
            <div class="col s8 m4">
              <demo-input class="input-field" placeholder="e.g. index.html" label="Enter filename" @icon="svgIconData = $event"/>
            </div>
            <div class="col s4">
              <demo-output v-if="svgIconData" :svg-icon-data="svgIconData"/>
            </div>
          </div>
          <p>
            You can also create your own icon rules in case you don't get back an icon that properly represents your file-type or if you would like to override the default icon.
            Head over to <router-link :to="{name: 'usage'}">Usage</router-link> for more information.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RainbowText from '@/components/rainbow-text'

import DemoInput from '@/components/demo-input'
import DemoOutput from '@/components/demo-output'

export default {
  name: 'home',
  components: {
    RainbowText,
    DemoInput,
    DemoOutput
  },
  data () {
    return {
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
  }
}
</script>

<style lang="scss" scoped>
.font-sources-ul {
  list-style-type: circle;
  margin-left: 1.5em;
}

ul li {
  & > .title {
    font-size: 1.8em;
  }
  span {
    // margin-left: 1.5em;
  }
}
</style>
