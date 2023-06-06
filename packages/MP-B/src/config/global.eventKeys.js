// 使用方法参考 https://uniapp.dcloud.io/collocation/frame/communication?id=on
// 这里配置的是 eventName
const globalEventKeys = {
  // 新建/编辑 预约 新建挂号 挂号通讯
  apptFormWithSaveSuccess: 'apptFormWithSaveSuccess',
  // 取消预约成功
  cancleApptSuccess: 'cancleApptSuccess',
  // 搜索患者 点击患者卡片
  selectPatientCardFromSearchPatient: 'selectPatientCardFromSearchPatient',
  // 新建患者
  newPatient: 'newPatient',
  // 预约视图选择医生确认
  onSelectApptViewDoctor: 'onSelectApptViewDoctor',
  // 预约视图获取在职医生列表
  getDoctorListByPosition: 'getDoctorListByPosition',
  // 预约视图通知医生页面更新在职医生列表
  updateDoctorListByPosition: 'updateDoctorListByPosition',
  // 终止随访
  terminationFollowUp: 'terminationFollowUp',
}

export { globalEventKeys }
