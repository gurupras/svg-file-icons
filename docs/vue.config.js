const webpack = require('webpack')
const commitHash = require('child_process')
  .execSync('git rev-parse HEAD')
  .toString()

module.exports = {
  baseUrl: process.env.NODE_ENV === 'production' ? '/svg-file-icons/' : '/',
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        __COMMIT_HASH__: JSON.stringify(commitHash)
      })
    ]
  }
}
