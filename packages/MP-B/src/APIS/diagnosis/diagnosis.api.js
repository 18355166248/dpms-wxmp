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
}

export default diagnosisAPI
