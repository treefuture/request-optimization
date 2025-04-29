const path = require("path")
const fs = require('fs');
const {
  getFilesAndFoldersInDir
} = require("./readFile")

function writeFile(entry, output) {
  const list = getFilesAndFoldersInDir(entry);

  // 过滤掉除JSON外的其他文件，并进行一些初始化操作
  const jsonFile = list
    .filter(item => path.extname(item.name) === '.json' && item.name !== "data.json")
    .map(item => {
      const name = item.name.split(".")
      item.fileName = name[0]
      item.hash = name[1]

      return item
    })

  // 异步写入文件
  fs.writeFile(output, JSON.stringify(jsonFile), (err) => {
    if (err) throw err;
    console.log('数据写入已完成');
  });
}

module.exports = {
  writeFile
}