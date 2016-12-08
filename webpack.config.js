const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackHardDiskPlugin = require('html-webpack-harddisk-plugin')
// const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: {
    app: './index.react.js'
    // about: './about.js'
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].bundle.[hash].js',
    publicPath: path.join(__dirname, 'build')
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.react.js']
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: 'style!css?modules&importLoaders=1&localIdentName=[name]__[local]__[hash:base64:5]!postcss'
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    inline: true
  },
  devtool: 'cheap-eval-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      favicon: path.resolve('public', 'image', 'thumbsup.png'),
      filename: path.resolve(__dirname, 'public', 'index.html'),
      template: path.join(__dirname, 'src', 'index.html'),
      title: 'Tyler Reitz',
      alwaysWriteToDisk: true,
      chunks: ['app'],
      // hash: true,
    }),

    new HtmlWebpackHardDiskPlugin()

    // new HtmlWebpackPlugin({
    //   template: path.join(__dirname, 'src', 'index.html'),
    //   filename: 'about.html',
    //   chunks: ['about']
    // }),

    // new ExtractTextWebpackPlugin('styles.css')
  ]
}
