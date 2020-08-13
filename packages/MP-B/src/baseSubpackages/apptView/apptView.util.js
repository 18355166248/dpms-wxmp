import _ from 'lodash'

const apptViewUtil = {
  findCanSelectId(list, key, childListkey, filterFn) {
    let arr = []
    if (
      !Array.isArray(list) ||
      !_.isFunction(filterFn) ||
      !_.isString(key) ||
      !_.isString(childListkey)
    )
      return arr
    list.forEach((item) => {
      const isSelect = filterFn(item)

      if (isSelect) arr.push(item[key])

      if (Array.isArray(item[childListkey])) {
        let childArr = apptViewUtil.findCanSelectId(
          item[childListkey],
          key,
          childListkey,
          filterFn,
        )

        arr = [...arr, ...childArr]
      }
    })

    return arr
  },
  findSelectInfo(list, key, childListkey, value) {
    let info = {}
    if (!Array.isArray(list) || !_.isString(key) || !_.isString(childListkey))
      return null

    const newList = apptViewUtil.flatten(list, childListkey)

    info = newList.find((item) => item[key] === value)

    return info
  },
  flatten(arr, childListkey) {
    let res = []
    arr.forEach((item) => {
      if (Array.isArray(item[childListkey])) {
        res = [
          ...res,
          ...apptViewUtil.flatten(item[childListkey], childListkey),
        ]
      }

      res.push(item)
    })
    return res
  },
}

export { apptViewUtil }
