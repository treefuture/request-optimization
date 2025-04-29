import {
  compareArrayObjects
} from '../utils/fileDifference.js'
import {
  localDataMapping
} from "../utils/localDataMapping.js"
import {
  dataRequest
} from "../rq/dataRequest.js"
import {
  LOCAL_MAPPING
} from "./constantPool.js"

// 获取打包后的数据
const data = await (await fetch("/data.json")).json()

// 数据请求
const getData = (cache) => {
  if (cache !== void 0) {
    sessionStorage.setItem("cache", cache)
  }

  if (JSON.parse(sessionStorage.getItem('cache'))) {
    const dataComparison = JSON.parse(sessionStorage.getItem(LOCAL_MAPPING)) ?? []
    if (!dataComparison.length) {
      data.forEach(item => {
        const key = JSON.parse(localStorage.getItem(item.fileName))
        if (key) {
          dataComparison.push({
            fileName: key?.fileName,
            hash: key?.hash
          })
        }
      })
      // 创建存储本地数据映射
      localDataMapping(LOCAL_MAPPING, dataComparison)
    }

    const {
      added,
      modified,
      removed
    } = compareArrayObjects(dataComparison, data, 'fileName', ['hash'])

    // 新增的数据
    added.forEach(item => {
      dataRequest(`/${item.name}`, item)
    })
    // 更改的数据
    modified.forEach(item => {
      const modifiedData = Object.assign(item, {
        name: item.newValue.name,
        fileName: item.newValue.fileName,
        hash: item.newValue.hash
      })
      dataRequest(`/${modifiedData.name}`, modifiedData)
    })
    // 删除的数据
    removed.forEach(item => {
      // localStorage.remove(item.fileName)
    })
  } else {
    data.forEach(item => {
      dataRequest(`/${item.name}`, item)
    });
  }
}
// 启用/禁用加载优化
openCache.addEventListener("click", () => {
  getData(true)
})
closeCache.addEventListener("click", () => {
  getData(false)
})

// 初始化调用
getData()