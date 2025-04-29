const path = require("path")
const {
  writeFile
} = require('../utils/writeFile')

writeFile(path.resolve(__dirname, '../release'), path.resolve(__dirname, '../release/data.json'))