const path = require('path')

function ScriptsPathPlugin() {}

ScriptsPathPlugin.prototype.apply = function (compiler) {

  compiler.plugin('compilation', function (compilation) {

    compilation.plugin('html-webpack-plugin-alter-asset-tags', function (htmlPluginData, callback) {
      const src = htmlPluginData.body[0].attributes.src
      const parsed = path.parse(src)
      const formated = path.format({
        name: parsed.base
      })
      htmlPluginData.body[0].attributes.src = formated
      callback(null, htmlPluginData)
    })

  })

}

module.exports = ScriptsPathPlugin
