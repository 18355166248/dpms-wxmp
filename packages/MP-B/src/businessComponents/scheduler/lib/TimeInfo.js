import moment from 'moment'

class TimeInfo {
  constructor(begin, end, beginHour, endHour, hourParts, partHeight, origin) {
    this.origin = Object.freeze(origin)
    this.beginTime = moment(begin)
    this.endTime = moment(end)
    this.begin =
      this.beginTime.hour() +
      Math.ceil((this.beginTime.minute() / 60) * 100) / 100
    this.end =
      this.endTime.hour() + Math.ceil((this.endTime.minute() / 60) * 100) / 100
    this.length = Math.ceil((this.end - this.begin) * 100) / 100
    this.height = this.length * hourParts * partHeight - 1
    this.hourParts = hourParts
    this.beginHour = beginHour
    this.endHour = endHour
    this.partHeight = partHeight
    this.top = (this.begin - beginHour) * hourParts * partHeight
  }

  /**
   * 判断是否包含其他时间,只要其他时间的起点时间在当前时间段内,即返回true
   * @param { TimeInfo } otherTimeData
   * @returns Boolean： true：包含,false：不包含
   */
  contains(otherTimeData) {
    return otherTimeData.begin >= this.begin && otherTimeData.begin <= this.end
  }

  /**
   * 分割时间时间值,范围小时数值和分钟数值
   * @param { Number } timeValue : 时间值,如果是11:30分,则为11.5
   * @returns Arrar: 返回时间值的小时部分和分钟部分,如timeValue为11.5,则返回[11,30]
   */
  separateTime(timeValue) {
    let hourValue = Math.floor(timeValue)
    let minuteValue = (timeValue - hourValue) * 60
    return [hourValue, minuteValue]
  }
}

export default TimeInfo
