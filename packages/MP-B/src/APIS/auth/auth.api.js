// import httper from '../http'
import scrmHttper from '../httpScrm'

const authAPI = {
  login(data) {
    // return httper.post('institution/login', data)
    return scrmHttper.post('scrm/auth/login-general', data)
  },
  qyLogin(data) {
    return scrmHttper.post('scrm/auth/enterprise-mini-app-login', data)
  },
}

export default authAPI
