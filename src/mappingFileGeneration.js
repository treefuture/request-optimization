const path = require("path")
const {
  writeFile
} = require('../utils/writeFile')

writeFile(path.resolve(__dirname, '../dist'), path.resolve(__dirname, '../dist/data.json'))