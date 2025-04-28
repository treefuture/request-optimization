/**
 * 本地数据映射
 * @param {本地映射缓存仓库} mappingName 
 * @param {本地映射用于比较的值} mappingData 
 */
export const localDataMapping = (mappingName, mappingData) => {
  const mapping = new Map((JSON.parse(sessionStorage.getItem(mappingName)) ?? []).map(item => [item['fileName'], item]))
  const setMapping = []

  if (Array.isArray(mappingData)) {
    mappingData.forEach(item => mapping.set(item.fileName, {
      fileName: item.fileName,
      hash: item.hash
    }))
  } else {
    mapping.set(mappingData.fileName, {
      fileName: mappingData.fileName,
      hash: mappingData.hash
    })
  }
  Array.from(mapping).forEach(item => {
    if (!Array.isArray(item[1])) {
      setMapping.push(item[1])
    }
  })
  sessionStorage.setItem(mappingName, JSON.stringify(setMapping))
}