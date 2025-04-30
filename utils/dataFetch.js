import {
  inflate
} from '../node_modules/pako/dist/pako.esm.mjs'

export const dataFetch = async (value) => {

  const suffix = value.url.split(".").at(-1)
  switch (suffix) {
    case 'json':
      return await value.json()
    case 'gz':
      const data = await value.arrayBuffer()
      return JSON.parse(inflate(new Uint8Array(data), {
        to: 'string'
      }))
    default:
      throw new Error("数据类型错误")
  }
}