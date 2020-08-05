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
    return httper.get('institution/staff/list/position', { params })
  },
}

export default institutionAPI
