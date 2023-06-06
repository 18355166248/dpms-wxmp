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
  /**
   * @description 获取对应领用单位下拉基础数据
   * @param {Number} params.receiveDeptType  1 员工  2 诊室  3 科室
   * @returns
   */
  getReceiveDeptTypeList(params) {
    return httper.get(
      '/physical/merchandise/receive/queryReceiveDeptList',
      params,
    )
  },
  /**
   * @description 新增领用申请
   * @param {String} data.description
   * @param {Number} data.receiveDeptId
   * @param {String} data.receiveDeptName
   * @param {String} data.receiveDeptType
   * @param {Number} data.medicalInstitutionId
   * @param {Array<object>} data.receiveOrderItemVOList
   * @returns
   */
  addReceiveApply(data) {
    return httper.post('/physical/merchandise/receive/insert', data, {
      headers: {
        'content-type': 'application/json',
      },
    })
  },
  /**
   * @description 修改领用申请
   * @param {*} data  参数同新增
   * @param {Number} data.merchandiseReceiveOrderId  领用id
   * @returns
   */
  updateReceiveApply(data) {
    return httper.post('/physical/merchandise/receive/update', data, {
      headers: {
        'content-type': 'application/json',
      },
    })
  },
  /**
   * @description 直接修改领用单状态
   * @param {Number} data.merchandiseReceiveOrderId  领用单id
   * @param {Number} data.receiveStatus              状态值
   * @returns
   */
  editReceiveApplyStatus(data) {
    return httper.post('/physical/merchandise/receive/submitApply', data, {
      headers: {
        'content-type': 'application/json',
      },
    })
  },
}

export default receiveAPI
