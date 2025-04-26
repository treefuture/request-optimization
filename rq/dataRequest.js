export const dataRequest = async (url, item) => {
  const cacheName = await (await fetch(url)).json()
  cacheName.fileName = item.fileName
  cacheName.hash = item.hash
  console.log(`正在请求：${cacheName.fileName}`)

  localStorage.setItem(cacheName.fileName, JSON.stringify(cacheName))
}