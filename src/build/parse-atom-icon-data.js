import fs from 'fs'
import path from 'path'
import CoffeeScript from 'coffee-script'
import { parseLESSIntoRules, parseLESSIcon, filterLESSIcon } from './parse-less'
import { atomRoot, iconDBPath, lint, loadAllSVGs } from '../utils'
import IconCompiler from '../../font-sources/atom/lib/icons/icon-compiler.js'

async function parseAtomLessIcons () {
  const coloursLessPath = path.join(atomRoot, 'styles', 'icons.less')
  var lessStr = fs.readFileSync(coloursLessPath, 'utf-8')
  const { ruleset, options } = await parseLESSIntoRules(lessStr)
  const icons = ruleset.map(rule => parseLESSIcon(rule, options)).filter(filterLESSIcon)
  const result = {}
  icons.forEach(iconData => {
    const { prefixedIconName, font } = iconData
    result[prefixedIconName] = result[prefixedIconName] || {}
    result[prefixedIconName][font] = iconData
  })
  return result
}

async function parseAtomLessColours (backgroundColour = '#282c34') {
  const coloursLessPath = path.join(atomRoot, 'styles', 'colours.less')
  const coloursLess = fs.readFileSync(coloursLessPath, 'utf-8')
  // Remove first line import
  const lessStr = coloursLess.replace(`@import "ui-variables";`, `@tree-view-background-color: ${backgroundColour};`)
  const { ruleset, options } = await parseLESSIntoRules(lessStr)
  const lessVars = {}
  ruleset.forEach(function (rule) {
    if (rule.variable === true) {
      var name = rule.name.substr(1)
      var value = rule.value
      lessVars[name] = value.toCSS(options)
    }
  })
  return lessVars
}

async function parseAtomLess () {
  const lessIcons = await parseAtomLessIcons()
  const lessColours = await parseAtomLessColours()
  return {
    lessIcons,
    lessColours
  }
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

async function buildIconDB (lessData, svgIcons, rawIconDB, writeToFile = false) {
  if (!lessData) {
    lessData = await parseAtomLess()
  }
  const { lessIcons, lessColours } = lessData

  if (!svgIcons) {
    svgIcons = await loadAllSVGs()
  }

  if (!rawIconDB) {
    rawIconDB = parseAtomIconDB()
  }

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
      // Get the respective icon
      const svg = svgIcons.byCode[code][font] || svgIcons.byFont[font][icon]
      if (!svg) {
        // This icon appears to be missing in our font
        throw new Error(`Missing icon font=${font} code=${code} icon=${icon}`)
      }
      return { colour, icon, key, match, priority, fullIconName, prefixedIconName, font, svg }
    } catch (e) {
      // console.error(`Failed to process icon: ${fullIconName}: ${e.message}`)
    }
  }).filter(x => !!x)

  let iconDBContent = []
  const formattedIconDB = iconDB.map(entry => {
    if (writeToFile) {
      iconDBContent.push(`[
        ${entry.match}, // rule
        '${entry.font}', // font
        '${entry.svg.ref}', // icon
        ${entry.priority}, // priority
        '${entry.colour[0]}' // color
      ]`)
    }
    return [
      entry.match,
      entry.font,
      entry.svg.ref,
      entry.priority,
      entry.colour[0]
    ]
  })

  if (writeToFile) {
    const content = [
      `'use strict'`,
      '/* eslint no-useless-escape: 0 */',
      `const iconDB = [
        ${iconDBContent}
      ]
      export default iconDB`
    ]
    fs.writeFileSync(iconDBPath, content.join('\n'), 'utf-8')
    lint(iconDBPath)
  }
  return formattedIconDB
}

export {
  parseAtomLessColours,
  parseAtomLessIcons,
  parseAtomLess,
  parseAtomIconDB,
  buildIconDB
}
