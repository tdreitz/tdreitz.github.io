/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import webpack from 'webpack'

export default {
  context: __dirname,
  entry: './index.jsx',
  output: {
    path: `${__dirname}/__build__`,
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel' },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: 'style!css?modules&importLoaders=1&localIdentName=[name]__[local]__[hash:base64:5]!postcss' 
      }
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.react.js'],
  },
  devServer: {
    contentBase: __dirname,
    inline: true
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
