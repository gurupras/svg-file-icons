import fs from 'fs'
import path from 'path'
import rimraf from 'rimraf'
import woff2 from 'woff2'
import ttf2svg from 'ttf2svg'
import fontBlast from '@gurupras/font-blast'
import { atomRoot, svgDir } from './utils'

const fontPaths = {
  'devicons': path.join(atomRoot, 'fonts', 'devopicons.woff2'),
  'file-icons': path.join(atomRoot, 'fonts', 'file-icons.woff2'),
  'fontawesome': path.join(atomRoot, 'fonts', 'fontawesome.woff2'),
  'mfizz': path.join(atomRoot, 'fonts', 'mfixx.woff2'),
  'octicons': path.join(atomRoot, 'fonts', 'octicons.woff2')
}

async function convertAtomWoffToSVG () {
  const outdir = svgDir
  if (fs.existsSync(outdir)) {
    rimraf.sync(outdir)
  }
  fs.mkdirSync(outdir)
  // We're good to go
  for (const font of Object.keys(fontPaths)) {
    const fontPath = fontPaths[font]
    const fontOutdir = path.join(outdir, font)
    fs.mkdirSync(fontOutdir)
    const ttf = woff2.decode(fs.readFileSync(fontPath))
    const svg = ttf2svg(ttf)
    const fixedSvg = svg
      .replace(/(^[ \t]*\n)/gm, '')

    const svgFile = path.join(fontOutdir, 'source.svg')
    fs.writeFileSync(svgFile, fixedSvg)

    await fontBlast(svgFile, path.join(outdir, font))
  }
}

export default convertAtomWoffToSVG
