import httper from '../http'

const billAPI = {
  // 小程序-财务对账
  calendarList(data) {
    return httper.get('billing/stat/reconciliation/calendar/list', data)
  },
  calendarDetail(data) {
    return httper.get('/billing/stat/reconciliation/calendar/detail', data)
  },
  getStatPage(data) {
    return httper.get('/billing/project/detail/stat/page', data)
  },
  //
  getOrderPage(data) {
    return httper.get('/billing/stat/bill/order/page', data)
  },
  // 项目明细
  getDetailStatPage(data) {
    return httper.get('/billing/project/detail/stat/page', data)
  },
  payReconciliation(data) {
    return httper.get(
      '/pay/statement-manager/pay-style-reconciliation/list',
      data,
    )
  },
  // 交易明细
  getItemStatPage(data) {
    return httper.get('/billing/pay/item/stat/page', data)
  },
  // 项目明细
  getDetailStatePage(data) {
    return httper.get('/billing/project/detail/stat/page', data)
  },
  // 欠费患者
  getArrearsList(data) {
    return httper.get('/billing/stat/patient/arrears/list', data)
  },
  //小程序-统计报表-营收报表-营收日报表
  revenueList(data) {
    return httper.get('billing/mini-apps/analyze/revenue/list', data)
  },
  //小程序-统计报表-营收报表-预约日报表
  appointmentList(data) {
    return httper.get(
      'patient/mini-apps/stat/operating/appointment-analysis/list',
      data,
    )
  },
  //小程序-统计报表-营收报表-到诊日报表
  diagnosisList(data) {
    return httper.get(
      'patient/mini-apps/stat/operating/register-analysis/list',
      data,
    )
  },
  //待处理账单
  pendingOrderList(data) {
    return httper.get('billing/bill/order/process/page', data)
  },
  //已收费账单
  chargedOrderList(data) {
    return httper.get('billing/bill/order/page', data)
  },
  //账单详情
  orderDetail(data) {
    return httper.get('billing/bill/order/item', data)
  },
  //支付记录
  paymentOrderList(data) {
    return httper.get('pay/pay-order/page-by-payer-id', data)
  },
  //护士业绩
  nurseList(data) {
    return httper.get('billing/stat/nurse/performance/page', data)
  },
  //医生业绩
  doctorList(data) {
    return httper.get(
      'billing/mini-apps/stat/doctor/performance/sum/page',
      data,
    )
  },
  //医生业绩详情
  doctorDetailList(data) {
    return httper.get(
      'billing/mini-apps/stat/doctor/performance/detail/page',
      data,
    )
  },
  //医生助理业绩
  assistantList(data) {
    return httper.get('billing/stat/doctor/assistant/performance/page', data)
  },
  //咨询师业绩
  consultantList(data) {
    return httper.get('billing/stat/consultant/performance/page', data)
  },
  //项目列表
  chargeTypeParentList(data) {
    return httper.get('billing/settings/charge-type/select-parent', data)
  },
  //收费项目 获取一级和二级分类
  getChargeTypes(data) {
    return httper.get('billing/settings/charge-type/list', data)
  },
  //收费项目 获取二级和三级分类
  getChargeItems(data) {
    return httper.get('billing/settings/charge-type/select-item-list', data)
  },
  //搜索一级分类下的二级分类
  searchChargeType(data) {
    return httper.get('billing/settings/charge-type/search', data)
  },
  //搜索二级分类下的三级分类
  searchChargeItem(data) {
    return httper.get('billing/settings/charge-item/select-list/fuzzy', data)
  },
  //获取套餐项目分类
  getCategoryList(data) {
    return httper.get(
      'billing/settings/charge-package-type/category-list',
      data,
    )
  },
  //获取套餐下的收费项目
  getPackageChargeItems(data) {
    return httper.get(
      'billing/settings/charge-package-item/selectByTypeId',
      data,
    )
  },
  //获取销售商品列表
  getMerchandiseList(data) {
    return httper.get('physical/merchandise/list-select', data)
  },
  //支付方式
  getPayTypes(data) {
    return httper.get('pay/settings/pay-transaction-channel/list', data)
  },
  //消费预览和诊疗项目
  getStatistical(data) {
    return httper.get('billing/bill/order/statistical', data)
  },
  //储值卡详情
  getSoredCardDetail(data) {
    return httper.get('member/sored-card/details', data)
  },
  //获取就诊列表
  getRegisterList(data) {
    return httper.get('/diagnosis/register/list-pay', data)
  },
  // 分诊业绩
  getTriageList(data) {
    return httper.get('diagnosis/stat-triage-statistics/stat/list', data)
  },
  // 转诊业绩
  getReferralList(data) {
    return httper.get('diagnosis/stat-referral-statistics/stat/list', data)
  },
  // 获取欠费列表
  getPayDebtList(data) {
    return httper.get('billing/bill/order/pay-debt', data)
  },
  //收欠费
  payDebt(data) {
    return httper.post('/billing/bill/order/pay-debt', data, {
      headers: {
        'content-type': 'application/json',
      },
    })
  },
  //获取订单支付结果
  getPayChannelResult(data) {
    return httper.get('/billing/bill/pay/channel', data)
  },
  /* 收费结果-数据 */
  getDeductionData(data) {
    return httper.get(
      '/billing/bill-order-item/planned-deduction/select-current-pay-deduction',
      data,
    )
  },
  // 查询账单数据
  getOrderDetail(data) {
    return httper.get('/billing/bill/order/wait', data)
  },
  //
  getPayTransactionChannel(data) {
    return httper.get('/pay/settings/pay-transaction-channel/list/apps', data)
  },
  // 账单保存接口
  saveOrderBill(data) {
    return httper.post('/billing/bill/order/saveOrUpdate', data, {
      headers: {
        'content-type': 'application/json',
      },
    })
  },
  orderPayOne(data) {
    return httper.post('/billing/bill/order/pay-one', data, {
      headers: {
        'content-type': 'application/json',
      },
    })
  },
}

export default billAPI
