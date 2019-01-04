var path = require('path')

module.exports = {
  entry: {
    library: './src/library.js',
    'file-icons': './src/file-icons.js',
    'font-devopicons': './compiled-js/devopicons/index',
    'font-file-icons': './compiled-js/file-icons/index',
    'font-font-awesome': './compiled-js/font-awesome/index',
    'font-mfixx': './compiled-js/mfixx/index',
    'font-octicons': './compiled-js/octicons/index'
  },
  mode: 'production',
  output: {
    library: 'FileIcons',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/'
  },
  // devtool: 'cheap-module-eval-source-map',
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
