import less from 'less'

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

function parseLESSIcon (rule, lessOptions) {
  var fullIconName
  var iconName
  var font
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
    font = fontFamilyRule.value.value.split(' ')[0].toLowerCase()
  } catch (e) {
  }
  const formattedRules = {}
  rules.forEach(x => { formattedRules[x.name] = x.value.value })
  return {
    prefixedIconName: `${iconName}-icon`,
    fullIconName,
    iconName,
    font,
    rules: formattedRules,
    css: rules.map(x => x.toCSS(lessOptions)),
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
}

function filterLESSIcon (icon) {
  return icon && icon.iconName && icon.font && icon.rules
}

function registerLESSIcon (iconData, result) {
  const { prefixedIconName, font } = iconData
  result[prefixedIconName] = result[prefixedIconName] || {}
  result[prefixedIconName][font] = iconData
}

export {
  parseLESSIntoRules,
  parseLESSIcon,
  filterLESSIcon,
  registerLESSIcon
}
