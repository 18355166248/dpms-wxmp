import httper from '../http'

const authAPI = {
  getPatientList(data) {
    return httper.get('patient/patient/page', data)
  },
  getPatientTags(data) {
    return httper.get('patient/patient/list/patient-tags', data)
  },
  details(data) {
    return httper.get('institution/current/details', data)
  },
}

export default authAPI
