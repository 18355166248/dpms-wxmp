import httper from '../http'

export default {
  getStoreCardDealRecordChild(param) {
    return httper.get(
      '/institution-customer/stored-card-trade-record/page',
      param,
    )
  },
  memberDetail(param) {
    return httper.get('/institution-customer/member/detail', param)
  },
}
