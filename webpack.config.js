var path = require('path')

module.exports = {
  entry: {
    bundle: './src/index.js',
    devicons: './compiled-js/devicons/index',
    'file-icons': './compiled-js/file-icons/index',
    fontawesome: './compiled-js/fontawesome/index',
    mfizz: './compiled-js/mfizz/index',
    octicons: './compiled-js/octicons/index',
    icons: './compiled-js/index'
  },
  mode: 'production',
  output: {
    library: 'FileIcons',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/'
  },
  devtool: 'cheap-module-eval-source-map',
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
