import fs from 'fs'
import path from 'path'
import glob from 'glob'
import CoffeeScript from 'coffee-script'

import { parseAtomLess } from './parse-atom-less'
import { root, atomRoot, svgDir, parseXML } from './utils'
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
        const svgClass = path.basename(path.dirname(path.dirname(file))).toLowerCase()
        // const svgName = path.basename(file, ext).toLowerCase()
        var svgString = fs.readFileSync(file, 'utf-8')
        const xml = await parseXML(svgString)
        const { svg: { $: { code } } } = xml

        result[code] = result[code] || {}
        result[code][svgClass] = {
          svgClass,
          svg: svgString
        }
      }
      resolve(result)
    })
  })
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
  const icondb = parseAtomIconDB()
  return icondb.map(entry => {
    var { colour, icon, key, match, priority } = entry
    const fullIconName = icon
    icon = icon.replace('-icon', '')
    const prefixedIconName = `${icon}-icon`
    colour = colour.map(c => lessColours[c])

    try {
      const svgClass = Object.keys(lessIcons[prefixedIconName])[0]
      const cssData = lessIcons[prefixedIconName][svgClass]
      const { code } = cssData
      // Get the respective icon using the icons LESS entries
      const { svg } = svgIcons[code][svgClass]
      return { colour, icon, key, match, priority, fullIconName, prefixedIconName, svg }
    } catch (e) {
      // console.error(`Failed to process icon: ${fullIconName}: ${e.message}`)
    }
  }).filter(x => !!x)
}

async function build () {
  await extractSVGs()
  const icondb = await buildIconDB()
  var regexIdx = 0
  const src = `const db = ${JSON.stringify(icondb, null, 2)}

export default db
  `.replace(/"match": {}/g, () => {
      const regex = icondb[regexIdx++].match
      return `"match": ${regex}`
    }) // Replace the RegExp string with regex
  fs.writeFileSync(path.join(root, 'src', 'icondb.js'), src)
}

build().then(() => { console.log('Done') })
