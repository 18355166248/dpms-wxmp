export const receiveStatusMap = {
  1: '确认中',
  2: '进行中',
  3: '已完成',
  4: '未完成',
  5: '待提交',
  6: '已拒绝',
}

export const receiveStatusArray = [
  { name: '待提交', value: 5 },
  { name: '确认中', value: 1 },
  { name: '进行中', value: 2 },
  { name: '已完成', value: 3 },
  { name: '未完成', value: 4 },
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
  5: '#0BD0DA',
  6: '#F2647C',
}

// 采购状态
export const purchaseStatus = {
  1: '采购待确认',
  2: '采购进行中',
  3: '已完成',
  4: '退货待确认',
  5: '退货进行中',
  6: '已退货',
  7: '已取消',
}

export const purchaseStatusArray = () => {
  let arr = []
  for (let key in purchaseStatus) {
    let obj = { name: purchaseStatus[key], value: +key }
    arr.push(obj)
  }
  return arr
}

export const purchaseStatusColor = {
  1: '#FA8C16',
  2: '#0B7B8F',
  3: '#5CBB89',
  4: '#FA8C16',
  5: '#0B7B8F',
  6: '#F2647C',
  7: '#F2647C',
}

// 入库状态
export const inputWarehouseStatus = [
  {
    name: '未入库',
    value: 1,
  },
  {
    name: '已入库',
    value: 2,
  },
  {
    name: '未出库',
    value: 3,
  },
  {
    name: '已出库',
    value: 4,
  },
  {
    name: '无需出库',
    value: 5,
  },
]

// 结算状态
export const settlementStatus = [
  {
    name: '无需结算',
    value: 1,
  },
  {
    name: '未结算',
    value: 2,
  },
  {
    name: '已结算',
    value: 3,
  },
]
