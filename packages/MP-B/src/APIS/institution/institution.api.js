import httper from '../http'

const institutionAPI = {
  getStaffDetail(data) {
    return httper.get('institution/staff/detail', data)
  },
  updateStaff(data) {
    return httper.post('institution/staff/update', data)
  },
  getAllPlace(data) {
    return httper.get('institution/system/all/place', data, {
      headers: {
        'content-type': 'application/json',
      },
    })
  },
  // 通过医生获取排班诊所信息
  getMedicalInstitutionInfoByDoctorSchedule(params) {
    return httper.get(
      'institution/schedule/get-medical-institution-info-by-doctor-schedule',
      params,
    )
  },
  // 获取员工列表
  getStaffListByPosition(params) {
    return httper.get('institution/staff/list/position', params)
  },
  // 获取预约排班列表
  getApptScheduleListByStaff(params) {
    return httper.get('/institution/schedule/select/one-staff', params)
  },
  // 机构ID 获取连锁诊所（树状结构）
  getInstitutionList(params) {
    return httper.get('institution/medical-institution/detail-child-id', params)
  },
  details(data) {
    return httper.get('institution/current/details', data)
  },
}

export default institutionAPI
