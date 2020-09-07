import httper from '../http'

const authAPI = {
  login(data) {
    return httper.post('institution/login', data)
  },
}

export default authAPI
