import scrmHttper from '../httpScrm'

const authAPI = {
  login(data) {
    return scrmHttper.post('scrm/auth/login-general', data)
  },
}

export default authAPI
