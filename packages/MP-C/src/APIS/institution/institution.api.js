import httper from '../http'

const institutionAPI = {
  getInstitutionInfo(data) {
    return httper.get('institution-customer/home-page/institution-info', data)
  },
  getProjList(data) {
    return httper.get('institution-customer/home-page/item/list', data)
  },
  getStoreList(data) {
    return httper.get('institution-customer/home-page/institution/list', data)
  },
  getFilterStoreList(data) {
    return httper.get(
      '/institution-customer/home-page/institution/list/all',
      data,
    )
  },
  getInnerProjList(data) {
    return httper.get(
      '/institution-customer/home-page/appointment/item/select/list',
      data,
    )
  },
}

export default institutionAPI
