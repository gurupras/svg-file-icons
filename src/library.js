class Library {
  constructor () {
    this.db = {}
  }
  register (svgIconData) {
    if (svgIconData instanceof Array) {
      return svgIconData.forEach(icon => this.register(icon), this)
    }
    const { code, font } = svgIconData
    this.db[code] = this.db[code] || {}
    this.db[code][font] = svgIconData
  }

  registerIconSet (iconSet) {
    Object.values(iconSet).forEach(icon => this.register(icon), this)
  }
}

const library = new Library()

export {
  library
}
