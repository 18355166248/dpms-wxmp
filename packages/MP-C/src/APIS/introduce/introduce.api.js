import httper from '../http'

const introduceAPI = {
  getIntroduceInfo(params) {
    return httper.get(
      '/institution-customer/home-page/institution/introduce',
      params,
    )
  },

  getStoreList(params) {
    return httper.get(
      '/institution-customer/home-page/institution/list',
      params,
    )
  },
}

export default introduceAPI
