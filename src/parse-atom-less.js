import fs from 'fs'
import path from 'path'
import { parseLESSIntoRules, parseLESSIcon, registerLESSIcon, filterLESSIcon } from './parse-less'
import { atomRoot } from './utils'

async function parseAtomLessIcons () {
  const coloursLessPath = path.join(atomRoot, 'styles', 'icons.less')
  var lessStr = fs.readFileSync(coloursLessPath, 'utf-8')
  const { ruleset, options } = await parseLESSIntoRules(lessStr)
  const icons = ruleset.map(rule => parseLESSIcon(rule, options)).filter(filterLESSIcon)
  const result = {}
  icons.forEach(x => registerLESSIcon(x, result))
  return result
}

async function parseAtomLessColours () {
  const coloursLessPath = path.join(atomRoot, 'styles', 'colours.less')
  const coloursLess = fs.readFileSync(coloursLessPath, 'utf-8')
  // Remove first line import
  const lessStr = coloursLess.replace(`@import "ui-variables";`, '@tree-view-background-color: #000;')
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

export {
  parseAtomLessColours,
  parseAtomLessIcons,
  parseAtomLess,
  parseLESSIcon,
  registerLESSIcon
}
