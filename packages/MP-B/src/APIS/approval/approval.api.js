import httpScrm from '../http'

const approvalApi = {
  getApprovalDetail(data) {
    return httpScrm.get('approve/instances/page', data)
  },
}

export default approvalApi
