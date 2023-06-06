import httper from '../http'

const purchaseAPI = {
  /**
   * @description 采购列表数据获取
   * @param {*} params
   * @returns
   */
  getPurchaseList(params) {
    return httper.get('/physical/inventory/purchase/page', params)
  },
  /**
   * @description 获取采购详情
   * @param {*} params.merchandisePurchaseOrderId  采购id
   * @returns
   */
  getPurchaseDetail(params) {
    return httper.get('/physical/inventory/purchase/detail', params)
  },
  /**
   * @description 获取供应商
   * @param {*} params
   * @returns
   */
  getSupplierList(params) {
    return httper.get('/physical/merchandise/supplier/list', params)
  },
  /**
   * @description 新增采购单
   * @param {*} data
   * @returns
   */
  createPurchase(data) {
    return httper.post('/physical/inventory/purchase/create', data, {
      headers: {
        'content-type': 'application/json',
      },
    })
  },
  /**
   * @description 修改采购单
   * @param {*} data.merchandisePurchaseOrderId 同新增
   * @returns
   */
  updatePurchase(data) {
    return httper.post('/physical/inventory/purchase/update', data, {
      headers: {
        'content-type': 'application/json',
      },
    })
  },
}

export default purchaseAPI
