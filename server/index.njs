const express = require('express')
const path = require('path')
const compression = require('compression')

const app = express()

app.use(express.static(path.resolve('build')))

app.get('*', (req, res) => res.sendFile(path.resolve('public', 'index.html')))

const PORT = process.env.PORT || 8080

app.listen(PORT, () => console.log('Production server running at localhost:' + PORT))
