import httper from '../http'
import { getStorage, STORAGE_KEY } from '@/utils/storage'

export default {
  getCustomerList(param) {
    return httper.get('institution-customer/personnel/list', param)
  },
  sentSms(param) {
    return httper.get('institution-customer/personnel/send-sms', param)
  },
  getPersonCount(param) {
    return httper.get('institution-customer/personnel/count', param)
  },
  getAppointCount(param) {
    return httper.get(
      'institution-customer/online-appointment/select-online-appointment-info',
      param,
    )
  },
  logOut(param) {
    return httper.get('institution-customer/logout', param)
  },
  userDetail(param) {
    return httper.get('institution-customer/user/mini-apps/detail', param)
  },
  getfunctionConfigDetail(param) {
    return httper.get(
      'institution-customer/mini-app/function-config/detail',
      param,
    )
  },
  getMemberDetails(param) {
    return httper.get(
      'institution-customer/user/mini-apps/select/member-details',
      param,
    )
  },
  needVerify(param) {
    return httper.get(
      'institution-customer/personnel/check/if-need-verify',
      param,
    )
  },
  creatCustomer(data) {
    // TODO 暂时只给新建员工传_cmtType 其他地方不传 后面需要修改业务逻辑

    const medicalInstitution = getStorage(STORAGE_KEY.MEDICALINSTITUTION)
    data._cmtType =
      medicalInstitution?.medicalInstitutionDTO?.institutionChainType
    return httper.post('institution-customer/personnel/create', data)
  },
  deleteCustomer(data) {
    return httper.post('institution-customer/personnel/delete', data)
  },
  updateCustomer(data) {
    return httper.post('institution-customer/personnel/update', data)
  },
  // 获取绑定客户list
  getBindCustomerList(param) {
    return httper.get('institution-customer/customer/bindCustomerList', param)
  },
  // 确认绑定人员
  bindCustomer(param) {
    return httper.get('institution-customer/customer/bindCustomer', param)
  },
  bill(param) {
    return httper.get('institution-customer/bill/page', param)
  },
  billGoods(param) {
    return httper.get('institution-customer/bill/goods', param)
  },
  healthRecordsSelectUserList(param) {
    return httper.get(
      '/institution-customer/mini-app/health-records/select-user',
      param,
    )
  },
  healthRecordsList(param) {
    return httper.get(
      'institution-customer/mini-app/health-records/list',
      param,
    )
  },
  healthRecordsImageList(param) {
    return httper.get(
      'institution-customer/mini-app/health-records/image-list',
      param,
    )
  },
  healthRecordsMedicalRecord(param) {
    return httper.get(
      'institution-customer/mini-app/health-records/e-medical-record',
      param,
    )
  },
}
