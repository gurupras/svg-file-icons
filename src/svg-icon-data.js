class SVGIconData {
  constructor ({ font = 'unknown', x, y, width, height, viewBox, code, ref, path }) {
    this.viewBox = viewBox || `${x} ${y} ${width} ${height}`
    this.font = font
    this.code = code
    this.ref = ref
    this.path = path
  }

  get svg () {
    return `<svg xmlns="http://www.w3.org/2000/svg" code="${this.code}" ref="${this.ref}" viewBox="${this.viewBox}"><path d="${this.path}"/></svg>`
  }

  stringify () {
    return `"use strict";
import SVGIconData from '{{root}}/src/svg-icon-data'
const svg = new SVGIconData(${JSON.stringify(this, null, 2)})
export default svg
`
  }
}

export default SVGIconData
