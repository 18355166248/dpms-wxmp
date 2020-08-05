import httper from '../http'

const diagnosisAPI = {
  // 今日工作
  getTodayWorkStatistics(data) {
    return httper.get('diagnosis/register-stat/today-work', data)
  },
  // 今日就诊-前台 列表
  getTodayReceptionistList(data) {
    return httper.get('diagnosis/register/page-receptionist', data)
  },

  // 今日就诊-医生 列表
  getTodayDoctorList(data) {
    return httper.get('diagnosis/register/page-doctor', data)
  },

  // 今日就诊-咨询
  getTodayConsultant(data) {
    return httper.get('diagnosis/register/page-consultant', data)
  },

  // 取消挂号
  cancleTodayWorkRegister(data) {
    return httper.post('diagnosis/register/update-status', data)
  },
  // 新建挂号
  createNewRegister(data) {
    return httper.post('diagnosis/register/create', data)
  },
  // 挂号
  createRegister(data) {
    return httper.post('diagnosis/register/create-with-appointment', data)
  },
}

export default diagnosisAPI
