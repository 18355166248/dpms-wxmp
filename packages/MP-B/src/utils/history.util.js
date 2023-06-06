import { setStorage, getStorage, removeStorage } from './storage'

export default class History {
  constructor(key, records = [], max = 10) {
    this.key = key
    this.records = records
    this.max = max
    if (!getStorage(this.key)) {
      setStorage(key, records)
    }
  }

  getHistory() {
    const value = getStorage(this.key)
    return value
  }

  add(value) {
    let arr = this.getHistory() || []
    // 为空不添加或者重复不添加
    if (!value || arr.includes(value)) return
    if (arr.length === this.max) {
      arr.shift()
    }
    arr.push(value)
    setStorage(this.key, arr)
  }

  remove() {
    setStorage(this.key, [])
  }
}
