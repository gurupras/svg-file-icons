import path from 'path'
import xml2js from 'xml2js'

const root = path.join(__dirname, '..')
const atomRoot = path.join(root, 'atom')
const svgDir = path.join(root, 'svgs')

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

export {
  root,
  atomRoot,
  svgDir,
  parseXML
}
