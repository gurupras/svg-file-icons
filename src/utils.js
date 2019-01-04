import fs from 'fs'
import path from 'path'
import xml2js from 'xml2js'
import glob from 'glob'
import SVGIconData from './svg-icon-data'
import { CLIEngine } from 'eslint'

const root = path.join(__dirname, '..')
const svgDir = path.join(root, 'svgs')
const fontSourcesDir = path.join(root, 'font-sources')
const atomRoot = path.join(fontSourcesDir, 'atom')
const compiledJsDir = path.join(root, 'compiled-js')
const iconDBPath = path.join(compiledJsDir, 'icondb.js')

const woffPaths = {
  'devopicons': path.join(atomRoot, 'fonts', 'devopicons.woff2'),
  'file-icons': path.join(atomRoot, 'fonts', 'file-icons.woff2'),
  'font-awesome': path.join(atomRoot, 'fonts', 'fontawesome.woff2'),
  'mfixx': path.join(atomRoot, 'fonts', 'mfixx.woff2')
}

const svgPaths = {
  'devopicons': {
    path: path.join(svgDir, 'devopicons', 'svg'),
    remap: true
  },
  'file-icons': {
    path: path.join(svgDir, 'file-icons', 'svg'),
    remap: true
  },
  'font-awesome': {
    path: path.join(svgDir, 'font-awesome', 'svg'),
    remap: true
  },
  'mfixx': {
    path: path.join(svgDir, 'mfixx', 'svg'),
    remap: true
  },
  'octicons': {
    path: path.join(fontSourcesDir, 'octicons', 'lib', 'build', 'svg'),
    remap: false
  }
}

function parseXML (xml) {
  if (xml instanceof Buffer) {
    xml = xml.toString('utf-8')
  }
  if (typeof xml !== 'string') {
    throw new Error(`Expected string..`)
  }
  return new Promise((resolve, reject) => {
    return xml2js.parseString(xml, (err, result) => {
      if (err) {
        return reject(err)
      }
      resolve(result)
    })
  })
}

async function loadAllSVGs () {
  const byCode = {}
  const byFont = {}
  await Promise.all(Object.entries(svgPaths).map(([font, { path: svgDir, remap }]) => {
    return new Promise((resolve, reject) => {
      const icomoonPath = path.join(fontSourcesDir, `${font}-icomoon.json`)
      let icomoon = {}
      if (remap) {
        try {
          const icomoonJson = JSON.parse(fs.readFileSync(icomoonPath, 'utf-8'))
          const { icons } = icomoonJson
          icons.forEach(icon => {
            const { properties = {} } = icon
            const { name, code: iconCode } = properties
            const code = icon.defaultCode || iconCode
            icomoon[code] = name
          })
        } catch (e) {
          console.error(`Failed to read file: ${icomoonPath}`)
          throw e
        }
      }

      glob(path.join(svgDir, '*.svg'), async (err, files) => {
        if (err) {
          return reject(err)
        }
        for (const file of files) {
          const basename = path.basename(file)
          let { name, ext } = path.parse(basename)
          if (ext !== '.svg') {
            return
          }

          // const svgName = path.basename(file, ext).toLowerCase()
          var svgString = fs.readFileSync(file, 'utf-8')
          const xml = await parseXML(svgString)
          const { svg } = xml
          const { $: { code, viewBox } } = svg
          if (remap) {
            // We need to update the name
            const codeInt = parseInt(code, 16)
            name = icomoon[codeInt] || name
          }
          let { ref = name } = svg
          ref = ref.startsWith('uni') && ref.toLowerCase().endsWith(code) ? name : ref
          const { path: pathAttr } = svg
          const { $: { d: svgPath } } = pathAttr[0]
          if (!code && !remap) {
            // This icon needs it's code to be pulled up from icomoon.json
          }
          const svgIcon = new SVGIconData({
            font,
            code,
            ref,
            viewBox,
            path: svgPath
          })
          byCode[code] = byCode[code] || {}
          byFont[font] = byFont[font] || {}
          byCode[code][font] = svgIcon
          byFont[font][ref] = svgIcon
        }
        resolve()
      })
    })
  }))
  return { byCode, byFont }
}

let cli
function lint (paths) {
  if (!(paths instanceof Array)) {
    paths = [paths]
  }
  cli = cli || new CLIEngine({
    fix: true,
    useEslintrc: true
  })
  const report = cli.executeOnFiles(paths)
  CLIEngine.outputFixes(report)
}

export {
  root,
  atomRoot,
  svgDir,
  fontSourcesDir,
  compiledJsDir,
  woffPaths,
  svgPaths,
  iconDBPath,
  parseXML,
  lint,
  loadAllSVGs
}
