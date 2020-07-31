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
}

export default institutionAPI
