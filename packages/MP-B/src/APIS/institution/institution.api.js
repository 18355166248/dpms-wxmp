import httper from '../http'

const institutionAPI = {
  getStaffDetail(data) {
    return httper.get('institution/staff/detail', data)
  },
  updateStaff(data) {
    return httper.post('institution/staff/update', data)
  },
}

export default institutionAPI
