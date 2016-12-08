const path = require('path')

// path.format({
//   dir: '/Users/tylers_mac/Dev/Portfolio',
//   root: '/Users/tylers_mac/Dev/Portfolio'
// })

const env = process.env

const myPath = path.join('build', 'index.html')

const myRelPath = path.relative(__dirname, 'public/index.html')

const myAbsPath = path.resolve('public', 'index.html')

const buildPath = path.resolve('build')

console.log(buildPath)
