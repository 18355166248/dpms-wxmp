import moment from 'moment'

const timeUtil = {
  startOfMToday: moment().startOf('day'),

  startOfToday: moment().startOf('day').valueOf(),

  condition: {
    beforeToday(timestamp) {
      return moment(timestamp).valueOf() < timeUtil.startOfToday
    },
  },

  /**
   * 获取今天开始到现在时间的毫秒数
   * @param timestamp
   * @return {number}
   */
  getTimestampByToday(timestamp = Date.now()) {
    const startByToday = moment().startOf('day')

    return moment(timestamp).diff(startByToday, 'milliseconds')
  },
}

export { timeUtil }
