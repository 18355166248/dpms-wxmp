import scrmHttper from '../httpScrm'

const approvalApi = {
  getApprovalDetail(data) {
    return scrmHttper.get('approve/instances/page', data)
  },
  //更新审批状态
  updateApprovalStatus(data) {
    return scrmHttper.post('approve/instances/check', data, {
      headers: {
        'content-type': 'application/json; charset=utf-8',
      },
    })
  },
}

export default approvalApi
