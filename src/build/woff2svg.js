import fs from 'fs'
import path from 'path'
import woff2 from 'woff2'
import ttf2svg from 'ttf2svg'
import fontBlast from '@gurupras/font-blast'

export default async function (woffPath, outdir) {
  const ttf = woff2.decode(fs.readFileSync(woffPath))
  const svg = ttf2svg(ttf)
  const fixedSvg = svg
    .replace(/(^[ \t]*\n)/gm, '')

  const svgFile = path.join(outdir, 'source.svg')
  fs.writeFileSync(svgFile, fixedSvg)

  await fontBlast(svgFile, outdir)
}
