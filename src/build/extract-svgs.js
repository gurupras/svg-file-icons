import fs from 'fs'
import path from 'path'
import rimraf from 'rimraf'
import { svgDir, woffPaths } from '../utils'
import Woff2SVG from './woff2svg'
import mkdirp from 'mkdirp'

async function convertAtomWoffToSVG () {
  const outdir = svgDir
  if (fs.existsSync(outdir)) {
    rimraf.sync(outdir)
  }
  mkdirp.sync(outdir)
  // We're good to go
  await Promise.all(Object.keys(woffPaths).map(font => {
    const fontPath = woffPaths[font]
    const fontOutdir = path.join(outdir, font)
    mkdirp.sync(fontOutdir)
    return Woff2SVG(fontPath, fontOutdir)
  }))
}

export {
  convertAtomWoffToSVG
}
