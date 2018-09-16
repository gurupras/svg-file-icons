var path = require('path')

module.exports = {
  entry: './src/index.js',
  mode: 'production',
  output: {
    library: 'FileIcons',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
}
