import IconDB from '../compiled-js/icondb'
import devopicons from '../compiled-js/devopicons'
import fileIcons from '../compiled-js/file-icons'
import fontAwesome from '../compiled-js/font-awesome'
import mfixx from '../compiled-js/mfixx'
import octicons from '../compiled-js/octicons'

class FileIcons {
  constructor (db = IconDB) {
    this.db = db
  }

  addRule ([ rule, font, icon, priority, colour ]) {
    // TODO: Add more rigorous checking
    if (!rule || !font || !icon || !priority || !colour) {
      throw new Error('Invalid rule')
    }
    this.db.push([
      rule,
      font,
      icon,
      priority,
      colour
    ])
    return this.db.length - 1 // Return the index of the rule
  }

  removeRule (index) {
    this.db.splice(index, 1)
  }

  async getFileIcon (filename) {
    for (const entry of this.db) {
      const [ rule, font, icon, /* priority */, colour ] = entry
      if (rule.test(filename)) {
        let fontFamily
        switch (font) {
          case 'devopicons':
            fontFamily = devopicons
            break
          case 'file-icons':
            fontFamily = fileIcons
            break
          case 'font-awesome':
            fontFamily = fontAwesome
            break
          case 'mfixx':
            fontFamily = mfixx
            break
          case 'octicons':
            fontFamily = octicons
            break
          default:
            throw new Error(`Unimplemented font family: ${font}`)
        }
        const importIcon = await fontFamily.loadIcon(icon)
        if (importIcon) {
          const { default: svgIcon } = importIcon
          svgIcon.colour = colour
          return svgIcon
        }
      }
    }
  }
}

export default FileIcons
