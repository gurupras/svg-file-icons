import fs from 'fs'
import path from 'path'
import glob from 'glob'
import rimraf from 'rimraf'
import CoffeeScript from 'coffee-script'

import { parseAtomLess } from './parse-atom-less'
import { root, atomRoot, svgDir, compiledJsDir, parseXML } from './utils'
import SVGIconData from './svg-icon-data'
import extractSVGs from './extract-svgs'

import IconCompiler from '../atom/lib/icons/icon-compiler.js'

function loadSVGs () {
  return new Promise((resolve, reject) => {
    const result = {}
    glob(path.join(svgDir, '*/svg/*.svg'), async (err, files) => {
      if (err) {
        return reject(err)
      }

      for (const file of files) {
        const ext = path.extname(file)
        if (ext !== '.svg') {
          return
        }
        const font = path.basename(path.dirname(path.dirname(file))).toLowerCase()
        // const svgName = path.basename(file, ext).toLowerCase()
        var svgString = fs.readFileSync(file, 'utf-8')
        const xml = await parseXML(svgString)
        const { svg } = xml
        const { $: { code, ref, viewBox } } = svg
        const { path: pathAttr } = svg
        const { $: { d: svgPath } } = pathAttr[0]
        result[code] = result[code] || {}
        result[code][font] = new SVGIconData({
          font,
          code,
          ref,
          viewBox,
          path: svgPath
        })
      }
      resolve(result)
    })
  })
}

function writeSVGs (svgs) {
  if (fs.existsSync(compiledJsDir)) {
    rimraf.sync(compiledJsDir)
  }
  fs.mkdirSync(compiledJsDir)
  const fonts = {}
  Object.values(svgs).forEach(data => {
    Object.values(data).forEach(svgIconData => {
      const { font } = svgIconData
      fonts[font] = fonts[font] || []
      const fontData = fonts[font]
      const name = writeSVGAsJS(svgIconData)
      fontData.push(name)
    })
  })
  // Now, write this as a file called index.js
  const compiledIndexContent = [`'use strict'`]
  const compiledIndexImports = []
  const compiledIndexExports = ['export {']
  Object.entries(fonts).forEach(([font, names]) => {
    const files = names.map(x => `${x}.js`)
    const content = [`'use strict'`]
    const imports = []
    const exports = ['export {']
    files.forEach((file, idx) => {
      const name = names[idx]
      imports.push(`import ${name} from './${file}'`)
      exports.push(`  ${name},`)
    })
    exports.push('}')

    content.push('', ...imports, '', ...exports, '')
    fs.writeFileSync(path.join(compiledJsDir, font, 'index.js'), content.join('\n'))

    const fontNameCamelCased = font.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase() })
    compiledIndexImports.push(`import * as ${fontNameCamelCased} from './${font}/index'`)
    compiledIndexExports.push(`  ${fontNameCamelCased},`)
  })
  compiledIndexExports.push('}')
  compiledIndexContent.push('', ...compiledIndexImports, '', ...compiledIndexExports, '')
  fs.writeFileSync(path.join(compiledJsDir, 'index.js'), compiledIndexContent.join('\n'))
}

function writeSVGAsJS (svgIconData) {
  const { font, code } = svgIconData
  const outdir = path.join(compiledJsDir, font)
  if (!fs.existsSync(outdir)) {
    fs.mkdirSync(outdir)
  }
  var string = svgIconData.stringify()
  // We need to replace {{root}}
  const rootPath = path.relative(outdir, root)
  string = string.replace(/{{root}}/g, rootPath)
  const name = `uni${code}`
  fs.writeFileSync(path.join(outdir, `${name}.js`), string)
  return name
}

function parseAtomIconDB () {
  const csonPath = path.join(atomRoot, 'config.cson')

  var data
  try {
    data = fs.readFileSync(csonPath, 'utf-8')
  } catch (e) {
    throw new Error(`Failed to process file '${csonPath}': ` + e.message)
  }
  const source = CoffeeScript.eval(data)
  // const directoryIcons = IconCompiler.compileList(source.directoryIcons)
  const icondb = IconCompiler.compileList(source.fileIcons)
  return icondb
}

async function buildIconDB () {
  const { lessIcons, lessColours } = await parseAtomLess()
  const svgIcons = await loadSVGs()
  writeSVGs(svgIcons)

  const rawIconDB = parseAtomIconDB()
  const iconDB = rawIconDB.map(entry => {
    var { colour, icon, key, match, priority } = entry
    const fullIconName = icon
    icon = icon.replace('-icon', '')
    const prefixedIconName = `${icon}-icon`
    colour = colour.map(c => lessColours[c])

    try {
      const font = Object.keys(lessIcons[prefixedIconName])[0]
      const cssData = lessIcons[prefixedIconName][font]
      const { code } = cssData
      // Get the respective icon using the icons LESS entries
      const svg = svgIcons[code][font]
      return { colour, icon, key, match, priority, fullIconName, prefixedIconName, font, svg }
    } catch (e) {
      // console.error(`Failed to process icon: ${fullIconName}: ${e.message}`)
    }
  }).filter(x => !!x)

  return {
    svgIcons,
    lessIcons,
    lessColours,
    iconDB
  }
}

async function build () {
  // await extractSVGs()
  const { svgIcons, lessIcons, lessColours, iconDB } = await buildIconDB()
  var regexIdx = 0
  const src = `"use strict";
// This file was generated by compile-icons.js. For the sake of your sanity
// please do not edit it by hand.

const cssIcons = ${JSON.stringify(lessIcons, null, 2)}

const cssColours = ${JSON.stringify(lessColours, null, 2)}

const iconDB = ${JSON.stringify(iconDB, null, 2)}

export {
  cssIcons,
  cssColours,
  iconDB
}
`.replace(/"match": {}/g, () => {
    const regex = iconDB[regexIdx++].match
    return `"match": ${regex}`
  }) // Replace the RegExp string with regex
  fs.writeFileSync(path.join(root, 'src', 'icondb.js'), src)
}

build().then(() => { console.log('Done') })
