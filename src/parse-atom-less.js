import fs from 'fs'
import path from 'path'
import less from 'less'
import { root, atomRoot } from './utils'

function parseLESSIntoRules (lessStr) {
  return new Promise((resolve, reject) => {
    less.parse(lessStr, {
      paths: []
    }, (err, root, imports, options) => {
      if (err) {
        return reject(err)
      }
      try {
        var evalEnv = new less.contexts.Eval(options)
        var evaldRoot = root.eval(evalEnv)
        var ruleset = evaldRoot.rules
        resolve({ ruleset, root, imports, options })
      } catch (e) {
        return reject(e)
      }
    })
  })
}

async function parseAtomLessIcons () {
  const coloursLessPath = path.join(atomRoot, 'styles', 'icons.less')
  var lessStr = fs.readFileSync(coloursLessPath, 'utf-8')
  const { ruleset, options } = await parseLESSIntoRules(lessStr)
  const rawIconData = ruleset.map(rule => {
    var fullIconName
    var iconName
    var iconClass
    // Remove comments
    if (rule.isLineComment) {
      return
    }
    const { rules = [], selectors = [] } = rule

    // Has only 1 selector
    if (selectors.length !== 1) {
      return
    }
    const selector = selectors[0]
    var { elements, _elements = [] } = selector
    // selectors should be of the form .*-icon:before
    if (elements.length !== 2) {
      return
    }
    if (_elements.length === 0) {
      _elements = elements.map(x => x.value)
    }
    if (!_elements[0].includes('-icon') || !_elements[1] === 'before') {
      return
    }

    // Get the icon name without the leading .
    fullIconName = _elements[0].substr(1)
    iconName = fullIconName.replace('-icon', '')

    // Now, get the class of icon. Whether it is octicon, fontawesome, etc
    try {
      const fontFamilyRule = rules.filter(x => x.name === 'font-family')[0]
      iconClass = fontFamilyRule.value.value.split(' ')[0].toLowerCase()
    } catch (e) {
    }
    const formattedRules = {}
    rules.forEach(x => { formattedRules[x.name] = x.value.value })
    return {
      prefixedIconName: `${iconName}-icon`,
      fullIconName,
      iconName,
      iconClass,
      rules: formattedRules,
      css: rules.map(x => x.toCSS(options)),
      get code () {
        const { rules } = this
        var { content } = rules
        if (content.startsWith('\\')) {
          content = content.substr(1)
        } else {
          // It's a string..probably a direct character code.
          content = content.charCodeAt(0).toString()
        }
        return content
      }
    }
  })
  const result = {}
  rawIconData.forEach(x => {
    if (!x || !(x.iconName && x.iconClass && x.rules)) {
      return
    }
    result[x.prefixedIconName] = result[x.prefixedIconName] || {}
    result[x.prefixedIconName][x.iconClass] = x
  })
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
  parseAtomLess
}