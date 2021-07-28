import httper from '../http'
import scrmHttper from '../httpScrm'

const followupAPI = {
  getStaffDetail(data) {
    return httper.get('institution/staff/detail', data)
  },
  getFollowupNodeList(data) {
    return scrmHttper.get(
      'communication/follow-up/node/tob-mini-app/page',
      data,
    )
  },
  getStaffList(data) {
    return scrmHttper.get('common/staff/list', data)
  },
}

export default followupAPI
