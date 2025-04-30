import {
  localDataMapping
} from "../utils/localDataMapping.js"
import {
  LOCAL_MAPPING
} from "../src/constantPool.js"

export const dataRequest = async (url, item) => {
  const cacheName = await (await fetch(url)).json()
  cacheName.fileName = item.fileName
  cacheName.hash = item.hash
  console.log(`正在请求：${cacheName.fileName}`)
  try {
    localStorage.setItem(cacheName.fileName, JSON.stringify(cacheName))
    // 更新存储本地数据映射
    localDataMapping(LOCAL_MAPPING, item)
  } catch (error) {
    const textContent = error.toString().match(/'([^']*)'/g)
    const p = document.createElement("p")
    p.textContent = textContent[2] + "储存失败"

    document.body.appendChild(p)
    setTimeout(() => {
      document.body.removeChild(p)
    }, 3000)
  }
}