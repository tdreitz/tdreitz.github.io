/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import path from 'path'
import webpack from 'webpack'

export default {
  context: __dirname,
  entry: './index.jsx',
  output: {
    path: `${__dirname}/__build__`,
    filename: 'bundle.js',
    publicPath: '/__build__/'
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel' }
    ],
  },
  devServer: {
    contentBase: __dirname
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  plugins: (() => {
    if (process.argv.indexOf('-p') !== -1) {
      return [
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: JSON.stringify('production'),
          },
        }),
        new webpack.optimize.UglifyJsPlugin({
          output: {
            comments: false,
          },
        }),
      ]
    }
    return []
  })(),
}
