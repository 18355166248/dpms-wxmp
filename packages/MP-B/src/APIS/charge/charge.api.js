import httper from '../http'
import scrmHttper from '../httpScrm'

const chargeAPI = {
  //获取就诊列表
  getRegisterList(data) {
    return httper.get('/diagnosis/register/list-pay', data)
  },
}

export default chargeAPI
