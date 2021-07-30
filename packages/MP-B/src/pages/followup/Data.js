const followConfigData = {
  status: ['全部状态', '待随访', '已随访', '终止随访', '随访失败'],

  staffs: [
    {
      staffId: '',
      value: '全部随访',
    },
    {
      staffId: '',
      value: '我的随访',
    },
  ],

  BACKFILTERMODAL: 'backFilterModal',

  mapStatusValue: {
    10: '待随访',
    31: '随访失败',
    35: '已随访',
    40: '终止随访',
  },
  followUpWay: {
    1: '人工服务',
    2: '个人微信',
    3: '公众号',
    4: '企业微信',
  },
  getWeekdays(day) {
    switch (day) {
      case 1:
        return '星期一'
      case 2:
        return '星期二'
      case 3:
        return '星期三'
      case 4:
        return '星期四'
      case 5:
        return '星期五'
      case 6:
        return '星期六'
      case 0:
        return '星期日'
    }
  },
}

export default followConfigData
