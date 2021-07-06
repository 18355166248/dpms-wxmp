export const receiveStatusMap = {
  1: '确认中',
  2: '进行中',
  3: '已完成',
  4: '未完成',
  5: '待提交',
  6: '已拒绝',
}

export const receiveStatusArray = [
  { name: '确认中', value: 1 },
  { name: '进行中', value: 2 },
  { name: '已完成', value: 3 },
  { name: '未完成', value: 4 },
  { name: '待提交', value: 5 },
  { name: '已拒绝', value: 6 },
]

export const receiveDeptTypeMap = {
  1: '员工',
  2: '诊室',
  3: '科室',
}

export const receiveDeptTypeArray = () => {
  let arr = []
  for (let key in receiveDeptTypeMap) {
    let obj = { name: receiveDeptTypeMap[key], value: key }
    arr.push(obj)
  }
  return arr
}

export const receiveStatusColor = {
  1: '#FA8C16',
  2: '#0B7B8F',
  3: '#5CBB89',
  4: '#0BD0DA',
  5: '#0BD0DA',
  6: '#F2647C',
}
