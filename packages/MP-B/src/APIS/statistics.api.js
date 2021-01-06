import httper from './http'

const statisticsAPI = {
  // 获取诊所运营统计
  getStatistics(params) {
    return httper.get('diagnosis/mini-apps/statistics/statistics', params)
  },
}

export default statisticsAPI
