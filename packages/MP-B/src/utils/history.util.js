import { setStorage, getStorage, removeStorage } from './storage'

export default class History {
  constructor(key, records = [], max = 10) {
    this.key = key
    this.records = records
    this.max = max
    setStorage(key, records)
  }

  getHistory() {
    const value = getStorage(this.key)
    return value
  }

  add(value) {
    if (!value) return
    let arr = this.getHistory() || []
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
