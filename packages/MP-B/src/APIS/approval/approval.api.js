import scrmHttper from '../httpScrm'

const approvalApi = {
  getApprovalDetail(data) {
    return scrmHttper.get('approve/instances/page', data)
  },
}

export default approvalApi
