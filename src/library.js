import SVGIconData from './svg-icon-data'

class Library {
  constructor () {
    this.clear()
  }

  register (svgIconData) {
    if (!(svgIconData instanceof Array)) {
      svgIconData = [svgIconData]
    }
    for (const icon of svgIconData) {
      const { font, ref } = icon
      this.db[font] = this.db[font] || {}
      const db = this.db[font]
      if (db[ref]) {
        throw new Error(`Already contains a registered icon with name '${ref}'`)
      }
      db[ref] = new SVGIconData(icon)
    }
  }

  get (font, icon) {
    return this.db[font][icon]
  }

  clear () {
    this.db = {}
  }
}

const library = new Library()

export default library
