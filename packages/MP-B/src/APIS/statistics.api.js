import httper from './http'
import httperStatistic from './httpStatistic'

const statisticsAPI = {
  // 获取诊所运营统计
  getStatistics(params) {
    return httper.get('diagnosis/mini-apps/statistics/statistics', params)
  },
  log(data) {
    return httperStatistic.post('https://www.baidu.com', data, {
      headers: {
        'content-type': 'application/json; charset=utf-8',
      },
    })
  },
}

export default statisticsAPI
