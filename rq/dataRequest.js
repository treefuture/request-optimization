import {
  localDataMapping
} from "../utils/localDataMapping.js"
import {
  LOCAL_MAPPING
} from "../src/constantPool.js"
import {
  inflate
} from 'pako'

export const dataRequest = async (url, item) => {
  console.log(`正在请求：${item.fileName}`)
  const cache = await fetch(url)
  const suffix = cache.url.split(".").at(-1)
  const cacheData = {
    fileName: item.fileName,
    hash: item.hash
  }

  switch (suffix) {
    case 'json':
      Object.assign(cacheData, await cache.json())
      break;
    case 'gz':
      const data = await cache.arrayBuffer()
      Object.assign(cacheData, JSON.parse(inflate(new Uint8Array(data), {
        to: 'string'
      })))
      break;
    default:
      throw new Error("数据类型错误")
  }

  try {
    localStorage.setItem(cacheData.fileName, JSON.stringify(cacheData))
    // 更新存储本地数据映射
    localDataMapping(LOCAL_MAPPING, item)
  } catch (error) {
    const textContent = error.toString().match(/'([^']*)'/g)
    const p = document.createElement("p")
    p.textContent = textContent.at(-1) + "储存失败"

    document.body.appendChild(p)
    setTimeout(() => {
      document.body.removeChild(p)
    }, 3000)
  }
}