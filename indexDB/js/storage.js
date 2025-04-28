import {
  compareArrayObjects
} from '../../utils/fileDifference.js'
import {
  DB_NAME,
  DB_STORE_NAME
} from "./constantPool.js"
import {
  promiseAll
} from '../../rq/promiseAll.js'
import {
  LOCAL_MAPPING
} from '../../src/constantPool.js'
import {
  localDataMapping
} from '../../utils/localDataMapping.js'
import {
  openDB,
  addData,
  updateDB,
  cursorGetData,
  deleteDB,
} from "./indexDB.js"

// 获取更新的数据索引
const data = await (await fetch("/dist/data.json")).json()
// 打开数据库并获取数据库实例
const DB_EXAMPLE = await openDB(DB_NAME, DB_STORE_NAME, 'fileName')
// 获取本地数据库中的数据
let dataComparison = JSON.parse(sessionStorage.getItem(LOCAL_MAPPING)) ?? []
if (!dataComparison.length) {
  dataComparison = await cursorGetData(DB_EXAMPLE, DB_STORE_NAME)
  // 创建存储本地数据映射
  localDataMapping(LOCAL_MAPPING, dataComparison)
}

// console.log("本地数据")
// console.log(dataComparison)

// console.log("新数据")
// console.log(data)

// 比较本地数据和更新数据的差异 新增-更新-废除
const {
  added,
  modified,
  removed
} =
compareArrayObjects(dataComparison, data, 'fileName', 'hash')

console.log(added)
console.log(modified)
console.log(removed)

const fetchList = []

// 新增的数据
added.forEach(item => {
  fetchList.push([fetch(`/dist/${item.name}`), (value) => {
    console.log(`正在添加${item.fileName}到缓存中`)
    addData(DB_EXAMPLE, DB_STORE_NAME, Object.assign(value, {
      fileName: item.fileName,
      hash: item.hash
    }))
    // 更新存储本地数据映射
    localDataMapping(LOCAL_MAPPING, item)
  }])
})
// 更改的数据
modified.forEach(item => {
  fetchList.push([fetch(`/dist/${item.newValue.name}`), (value) => {
    const modifiedData = Object.assign(value, {
      fileName: item.newValue.fileName,
      hash: item.newValue.hash
    })
    console.log(`正在更新${modifiedData.fileName}缓存数据`)
    updateDB(DB_EXAMPLE, DB_STORE_NAME, modifiedData)
    // 更新存储本地数据映射
    localDataMapping(LOCAL_MAPPING, item)
  }])
})
// 删除的数据
removed.forEach(item => {
  deleteDB(DB_EXAMPLE, DB_STORE_NAME, item.fileName)
})

promiseAll(fetchList, (value) => {})
  .then(value => {
    console.log("数据已经全部请求完毕")
  })