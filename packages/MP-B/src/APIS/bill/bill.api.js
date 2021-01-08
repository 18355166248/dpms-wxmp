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
}

export default billAPI