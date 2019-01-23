import devopicons from '../compiled-js/devopicons'
import fileIcons from '../compiled-js/file-icons'
import fontAwesome from '../compiled-js/font-awesome'
import mfixx from '../compiled-js/mfixx'
import octicons from '../compiled-js/octicons'
import IconDB from '../compiled-js/icondb'

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
    if (isNaN(index)) {
      index = this.db.indexOf(index)
    }
    this.db.splice(index, 1)
  }

  async getFileIcon (filename) {
    const matchedEntries = this.getMatchingEntries(filename)
    let importIcon
    if (matchedEntries.length > 0) {
      const maxPriorityEntry = matchedEntries.reduce((a, b) => a[3] > b[3] ? a : b)
      const maxPriority = maxPriorityEntry[3]
      matchedEntries.filter(x => x[3] === maxPriority)
      const entry = matchedEntries.slice(-1)[0]
      if (entry) {
        const [ /* rule */, font, icon, /* priority */, colour ] = entry // eslint-disable-line
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
        importIcon = await fontFamily.loadIcon(icon)
        if (importIcon) {
          const { default: svgIcon } = importIcon
          svgIcon.colour = colour
          return svgIcon
        }
      }
    }
    // Default icon handling
    importIcon = await octicons.loadIcon('file')
    return importIcon
  }

  getMatchingEntries (input) {
    return this.db.filter(x => x[0].test(input))
  }
}

export default FileIcons
