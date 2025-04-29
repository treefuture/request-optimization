const fs = require('fs');

// 读取某个目录下的文件列表
function getFilesAndFoldersInDir(path, ReadFolder = true) {
  const items = fs.readdirSync(path);
  const result = [];
  items.forEach(item => {
    const itemPath = `${path}/${item}`;
    const stat = fs.statSync(itemPath);
    if (stat.isDirectory()) {
      if (ReadFolder) {
        let data = {
          name: item,
          birthtime: stat.birthtime
        }
        let children = getFilesAndFoldersInDir(itemPath)
        if (children && children.length) {
          data.children = children
        }
        result.push(data);
      }
    } else {
      result.push({
        name: item,
        birthtime: stat.birthtime
      });
    }
  });
  return result;
}

module.exports = {
  getFilesAndFoldersInDir
}