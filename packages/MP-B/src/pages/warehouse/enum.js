export const receiveStatusMap = {
  1: '确认中',
  2: '执行中',
  3: '已完成',
  4: '待提交',
  5: '已拒绝',
}

export const receiveStatusArray = () => {
  let arr = []
  for (const key in receiveStatusMap) {
    let obj = { name: receiveStatusMap[key], value: +key }
    arr.push(obj)
  }
  return arr
}

export const receiveDeptTypeMap = {
  1: '员工',
  2: '诊室',
  3: '科室',
}

export const receiveDeptTypeArray = () => {
  let arr = []
  for (const key in receiveDeptTypeMap) {
    let obj = { name: receiveDeptTypeMap[key], value: +key }
    arr.push(obj)
  }
  return arr
}

export const receiveStatusColor = {
  1: '#FA8C16',
  2: '#0B7B8F',
  3: '#5CBB89',
  4: '#0BD0DA',
  5: '#0B7B8F',
}

//  default {
//   receiveStatusMap,
//   receiveStatusArray,
//   receiveDeptTypeMap,
//   receiveDeptTypeArray,
//   receiveStatusColor
// }
