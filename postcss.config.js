module.exports = {
  plugins: [
    require('postcss-all-link-colors'),
    require('postcss-custom-properties'),
    require('postcss-color-function'),
    require('postcss-typescale'),
    require('postcss-vertical-rhythm-function'),
    require('postcss-responsive-type'),
    require('postcss-pxtorem')({
      propWhiteList: []
    }),
    require('postcss-custom-media'),
    require('postcss-media-minmax'),
    require('postcss-nested')
  ]
}
