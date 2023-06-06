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
  // 查看详情
  getDetailService(params) {
    return scrmHttper.get('/communication/follow-up/plan/detail', params)
  },
  // 执行随访
  executeNode(params) {
    return scrmHttper.post('/communication/follow-up/node/execute', params, {
      headers: {
        'content-type': 'application/json',
      },
    })
  },
  // 终止节点
  abortFollowupNode({ followUpNodeId, followUpPlanId, terminationReason }) {
    return scrmHttper.post(
      '/communication/follow-up/node/terminate',
      {
        followUpNodeId,
        followUpPlanId,
        terminationReason,
      },
      {
        headers: {
          'content-type': 'application/json',
        },
      },
    )
  },
  // 删除节点
  deleteChildrenCurrentItem(params) {
    return scrmHttper.post('/communication/follow-up/node/delete', params, {
      headers: {
        'content-type': 'application/json',
      },
    })
  },
  // 所有结果模板列表
  getAllResultsService(params) {
    return scrmHttper.get('/communication/follow-up/result-template/list', {
      params,
    })
  },
}

export default followupAPI
