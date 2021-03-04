import httper from '../http'

const billAPI = {
  //小程序-统计报表-营收报表-营收日报表
  revenueList(data) {
    return httper.get('billing/mini-apps/analyze/revenue/list', data)
  },
  //小程序-统计报表-营收报表-预约日报表
  appointmentList(data) {
    return httper.get(
      'patient/mini-apps/stat/operating/appointment-analysis/list',
      data,
    )
  },
  //小程序-统计报表-营收报表-到诊日报表
  diagnosisList(data) {
    return httper.get(
      'patient/mini-apps/stat/operating/register-analysis/list',
      data,
    )
  },
  //待处理账单
  pendingOrderList(data) {
    return httper.get('billing/bill/order/process/list', data)
  },
  //已收费账单
  chargedOrderList(data) {
    return httper.get('billing/bill/order/page', data)
  },
}

export default billAPI
