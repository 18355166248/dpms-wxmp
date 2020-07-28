import httper from './http'

const systemAPI = {
  getDataDict(params) {
    return httper.get('system/enums', params)
  },
}

export default systemAPI
