/**
 * 封装的方法以及用法
 * 打开数据库
 * @param {数据库名称} dbName 
 * @param {仓库名称(表名)} storeName 
 * @param {主键名称,默认为：id} keyPath 
 * @param {数据库版本,默认为：1} version 
 * @returns 返回数据库实例对象，记得保存实例对象，后续需要使用实例对象进行操作
 * 请注意这是一个异步的操作
 */
export function openDB(dbName, storeName, keyPath = "id",
  version = 1) {
  return new Promise((resolve, reject) => {
    let indexedDB = window.indexedDB
    let db = null
    const request = indexedDB.open(dbName, version)
    request.onsuccess = function (event) {
      db = event.target.result // 数据库对象
      console.log(`${dbName}数据库打开成功`)
      resolve(db)
    }

    request.onerror = function (event) {
      console.log(`${dbName}数据库打开失败`)
      reject(event)
    }

    request.onupgradeneeded = function (event) {
      // 数据库创建或升级的时候会触发
      console.log('onupgradeneeded')
      db = event.target.result // 数据库对象
      let objectStore
      if (!db.objectStoreNames.contains(storeName)) {
        // 创建表
        objectStore = db.createObjectStore(storeName, {
          // 存储值的时候的主键，之后储存的值都必须设置该值
          keyPath
        })
        // 创建索引 可以让你搜索任意字段
        // objectStore.createIndex('name', 'fileName', {
        //   unique: true
        // })
      }
    }
  })
}

/**
 * 向数据库中添加数据
 * @param {创建数据库时所传递的实例对象} db 
 * @param {仓库名称(表名)} storeName 
 * @param {*} data 
 * @returns 返回成功或失败的 Promise 对象
 */
export function addData(db, storeName, data) {
  return new Promise((resolve, reject) => {
    let request = db.transaction([storeName], 'readwrite') // 事务对象 指定表格名称和操作模式（"只读"或"读写"）
      .objectStore(storeName) // 仓库对象
      .add(data)

    request.onsuccess = function (event) {
      console.log(`数据 ${data.fileName} 已成功入库`)
      resolve(event)
    }

    request.onerror = function (event) {
      throw new Error(event.target.error)
    }
  })
}

/**
 * 通过主键读取数据
 * @param {创建数据库时所传递的实例对象} db 
 * @param {仓库名称(表名)} storeName  
 * @param {需要查询数据的主键} key 
 * @returns 返回成功或失败的 Promise 对象
 */
export function getDataByKey(db, storeName, key) {
  return new Promise((resolve, reject) => {
    let transaction = db.transaction(storeName) // 事务
    let objectStore = transaction.objectStore(storeName) // 仓库对象
    let request = objectStore.get(key)

    request.onerror = function (event) {
      console.log("数据读取成功")
      reject(event)
    }

    request.onsuccess = function (event) {
      resolve(request.result)
    }
  })
}

/**
 * 通过游标读取数据,获取所有数据
 * @param {创建数据库时所传递的实例对象} db 
 * @param {仓库名称(表名)} storeName  
 * @returns 返回成功或失败的 Promise 对象
 */
export function cursorGetData(db, storeName) {
  let list = []
  let store = db.transaction(storeName, 'readwrite') // 事务
    .objectStore(storeName) // 仓库对象
  let request = store.openCursor() // 指针对象
  return new Promise((resolve, reject) => {
    request.onsuccess = function (e) {
      let cursor = e.target.result
      if (cursor) {
        // 必须要检查
        list.push(cursor.value)
        cursor.continue() // 遍历了存储对象中的所有内容
      } else {
        resolve(list)
      }
    }
    request.onerror = function (e) {
      reject(e)
    }
  })
}

/**
 * 通过索引读取数据，需要在创建数据库时就创建索引
 * @param {创建数据库时所传递的实例对象} db 
 * @param {仓库名称(表名)} storeName 
 * @param {索引名称} indexName 
 * @param {需要查询的数据的索引值} indexValue 
 * @returns 返回成功或失败的 Promise 对象
 */
export function getDataByIndex(db, storeName, indexName, indexValue) {
  let store = db.transaction(storeName, 'readwrite').objectStore(storeName)
  let request = store.index(indexName).get(indexValue)
  console.log(store.index(indexName))
  return new Promise((resolve, reject) => {
    request.onerror = function (e) {
      reject(e)
    }
    request.onsuccess = function (e) {
      resolve(e.target.result)
    }
  })
}

/**
 * 通过索引和游标查询记录
 * @param {创建数据库时所传递的实例对象} db 
 * @param {仓库名称(表名)} storeName 
 * @param {*} indexName 
 * @param {*} indexValue 
 * @returns 返回成功或失败的 Promise 对象
 */
export function cursorGetDataByIndex(db, storeName, indexName, indexValue) {
  let list = []
  let store = db.transaction(storeName, 'readwrite').objectStore(storeName) // 仓库对象
  let request = store.index(indexName) // 索引对象
    .openCursor(IDBKeyRange.only(indexValue)) // 指针对象
  return new Promise((resolve, reject) => {
    request.onsuccess = function (e) {
      let cursor = e.target.result
      if (cursor) {
        list.push(cursor.value)
        cursor.continue() // 遍历了存储对象中的所有内容
      } else {
        resolve(list)
      }
    }
    request.onerror = function (ev) {
      reject(ev)
    }
  })
}

/**
 * 更新数据库中的数据
 * @param {创建数据库时所传递的实例对象} db 
 * @param {仓库名称(表名)} storeName 
 * @param {跟新的数据值} data 
 * @returns 返回成功或失败的 Promise 对象
 */
export function updateDB(db, storeName, data) {
  let request = db.transaction([storeName], 'readwrite') // 事务对象
    .objectStore(storeName) // 仓库对象
    .put(data)

  return new Promise((resolve, reject) => {
    request.onsuccess = function (ev) {
      console.log("数据更新成功")
      resolve(ev)
    }

    request.onerror = function (ev) {
      console.log("数据更新失败")
      resolve(ev)
    }
  })
}

/**
 * 删除数据库中的数据
 * @param {创建数据库时所传递的实例对象} db 
 * @param {仓库名称(表名)} storeName 
 * @param {被删除的值的主键} id 
 * @returns 返回成功或失败的 Promise 对象
 */
export function deleteDB(db, storeName, id) {
  let request = db.transaction([storeName], 'readwrite').objectStore(storeName).delete(id)

  return new Promise((resolve, reject) => {
    request.onsuccess = function (ev) {
      console.log(`${id}已删除`)
      resolve(ev)
    }

    request.onerror = function (ev) {
      console.log(`${id}删除失败`)
      resolve(ev)
    }
  })
}

/**
 * 删除数据库
 * @param {数据库名称} dbName 
 * @returns 返回成功或失败的 Promise 对象
 */
export function deleteDBAll(dbName) {
  let deleteRequest = window.indexedDB.deleteDatabase(dbName)
  return new Promise((resolve, reject) => {
    deleteRequest.onerror = function (event) {
      console.log('删除失败')
    }
    deleteRequest.onsuccess = function (event) {
      console.log('删除成功')
    }
  })
}

/**
 * 关闭数据库
 * @param {创建数据库时所传递的实例对象} db 
 */
export function closeDB(db) {
  db.close()
  console.log('数据库已关闭')
}

export default {
  openDB,
  addData,
  getDataByKey,
  cursorGetData,
  getDataByIndex,
  cursorGetDataByIndex,
  updateDB,
  deleteDB,
  deleteDBAll,
  closeDB
}