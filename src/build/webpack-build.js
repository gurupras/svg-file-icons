require = require('esm')(module) // eslint-disable-line
const path = require('path')
const webpack = require('webpack')
const { convertAtomWoffToSVG } = require('./extract-svgs')
const { convertAllSVGToJS } = require('./svg2js')
const { buildIconDB } = require('./parse-atom-icon-data')

const { root } = require('../utils')
const webpackConfig = require(path.join(root, 'webpack.config.js'))

// First, we need to run convertAtomWoffToSVG, followed by convertAllSVGToJS and finally buildIconDB
process.stdout.write('Converting all woff2 files to SVG ...')
convertAtomWoffToSVG().then(() => {
  process.stdout.write(' done\nConverting all SVGs to JS ...')
  convertAllSVGToJS().then(() => {
    process.stdout.write(' done\nBuilding iconDB from Atom ...')
    buildIconDB(null, null, null, true).then(() => {
      process.stdout.write(' done\nRunning webpack ...')
      const compiler = webpack(webpackConfig)
      compiler.run((err, stats) => {
        if (err) {
          process.stdout.write('\n')
          console.error(err)
          return
        }
        process.stdout.write(' done\n')
        // console.log(stats)
      })
    })
  })
})
