import httper from '../http'

const receiveAPI = {
  /**
   * @description 领用列表数据获取
   * @param {*} params
   * @returns
   */
  getReceiveList(params) {
    return httper.get('/physical/merchandise/receive/page', params)
  },
  /**
   * @description 领用详情
   * @param {*} params.merchandiseReceiveOrderId  领用id
   * @returns
   */
  getReceiveDetail(params) {
    return httper.get('/physical/merchandise/receive/detail', params)
  },
}

export default receiveAPI
