import { cssIcons as defaultCSSIcons, iconDB as defaultIconDB } from './icondb'
import { parseLESSIntoRules, parseLESSIcon, filterLESSIcon, registerLESSIcon } from './parse-less'
import { library } from './library'
import { unif016 } from '../compiled-js/octicons/index'

class SvgFileIcons {
  constructor ({ cssIcons = defaultCSSIcons, iconDB = defaultIconDB } = {}) {
    this.cssIcons = cssIcons
    this.iconDB = iconDB
    this.library = library
  }
  /**
   * Match an icon using a resource's basename.
   *
   * @param {String} name - Name of filesystem entity
   * @return {Icon}
   */
  getIcon (path) {
    for (const icon of this.iconDB) {
      if (icon.match.test(path)) {
        return icon
      }
    }
    return null
  }

  getIconByCSSClass (cssClass, fontClass) {
    const iconData = this.cssIcons[cssClass]
    if (!iconData) {
      return null
    }
    var cssData
    if (fontClass) {
      cssData = iconData[fontClass]
    }
    // Just use the first available icon
    cssData = iconData[Object.keys(iconData)[0]]
    const { code, font } = cssData
    const svg = this.library.db[code][font]
    return {
      ...cssData,
      svg
    }
  }

  async registerLESSIcon (lessStr) {
    const { ruleset, options } = await parseLESSIntoRules(lessStr)
    const icons = ruleset.map(rule => parseLESSIcon(rule, options)).filter(filterLESSIcon)
    icons.forEach(icon => registerLESSIcon(icon, this.cssIcons))
  }

  addFolderIcon () {
    const folderIcon = {
      'prefixedIconName': 'folder-icon',
      'fullIconName': 'folder-icon',
      'iconName': 'folder',
      'font': 'octicons',
      'rules': {
        'font-family': 'octicons',
        'font-size': '16px',
        'top': '1px',
        'content': '\\f016'
      },
      'css': [
        'font-family: octicons;',
        'font-size: 16px;',
        'top: 1px;',
        'content: "\\f016";'
      ],
      'code': 'f016'
    }
    registerLESSIcon(folderIcon, this.cssIcons)
    this.library.register(unif016)
  }
}

export {
  SvgFileIcons,
  library
}
