import fs from 'fs'
import path from 'path'
import rimraf from 'rimraf'
import { fontSourcesDir, svgPaths, compiledJsDir, parseXML, lint } from '../utils'
import SVGIconData from '../svg-icon-data'
import mkdirp from 'mkdirp'

function stringifySVGIcon (icon) {
  return JSON.stringify(icon, null, 2)
}

async function convertAllSVGToJS () {
  rimraf.sync(compiledJsDir)
  mkdirp(compiledJsDir)

  for (const font of Object.keys(svgPaths)) {
    const compiledJsFontPath = path.join(compiledJsDir, font)
    const individualFilesPath = path.join(compiledJsFontPath, 'js')
    mkdirp.sync(individualFilesPath)

    const { path: svgPath, remap } = svgPaths[font]
    const icomoonPath = path.join(fontSourcesDir, `${font}-icomoon.json`)
    let icomoon = {}
    if (remap) {
      try {
        const icomoonJson = JSON.parse(fs.readFileSync(icomoonPath, 'utf-8'))
        const { icons: iconArray } = icomoonJson
        iconArray.forEach(icon => {
          const { properties = {} } = icon
          const { name, code: iconCode } = properties
          const code = icon.defaultCode || iconCode
          if (!code) {
            return
          }
          icomoon[code] = name || icon.tags[0]
        })
      } catch (e) {
        console.error(`Failed to read file: ${icomoonPath}`)
        throw e
      }
    }

    let indexJsContent = `'use strict'
      const data = {
        name: '${font}',
        async loadIcon (name) {
          switch (name) {
            {{icons}}
          }
        }
      }
      export default data
      `
    const indexJsIconContent = []

    const files = fs.readdirSync(svgPath)
    for (const file of files) {
      const basename = path.basename(file)
      let { name } = path.parse(basename)
      // All names begin with 'uni' followed by HEX
      const xml = await parseXML(fs.readFileSync(path.join(svgPath, file), 'utf-8'))
      const { svg } = xml
      const { $: { code, ref = name, viewBox } } = svg
      const { path: pathAttr } = svg
      const { $: { d: svgPathData } } = pathAttr[0]
      const finalCode = code
      if (remap) {
        // We need to update the name
        const codeInt = parseInt(finalCode, 16)
        name = icomoon[codeInt] || name
      }
      const svgIcon = new SVGIconData({
        font,
        code: finalCode,
        ref: ref.startsWith('uni') && ref.toLowerCase().endsWith(finalCode) ? name : ref,
        viewBox,
        path: svgPathData
      })
      let metadata = { name }
      let codeInt

      if (!metadata) {
        console.warn(`Did not find icon: ${basename} code=${codeInt} in ${icomoonPath}`)
      } else {
        const filePath = path.join(individualFilesPath, `${name}.json`)
        fs.writeFileSync(filePath, stringifySVGIcon(svgIcon))
        indexJsIconContent.push(`case '${name}': return import(/*webpackChunkName:"${font}_${name}"*/ './js/${name}.json')`)
      }
    }
    if (indexJsIconContent.length > 0) {
      indexJsContent = indexJsContent.replace(/{{icons}}/, indexJsIconContent.join('\n'))
      const indexFile = path.join(compiledJsFontPath, 'index.js')
      fs.writeFileSync(indexFile, indexJsContent)
      lint(indexFile)
    }
  }
}

export {
  convertAllSVGToJS
}
