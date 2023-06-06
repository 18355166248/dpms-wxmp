import moment from 'moment'

export function parseHourPart(part) {
  if (part > 9) {
    return part.toString()
  } else {
    return part + '0'
  }
}

export function getFirstDayOfWeek(data) {
  const date = new Date(data || Date.now())
  const weekday = date.getDay() || 7
  date.setDate(date.getDate() - weekday + 1)
  return date
}

export function getWeekDay(date) {
  console.log('getWeekDay', date)
  const monday = moment().week(moment(date).week()).startOf('week')
  const week = []
  for (let i = 1; i <= 7; i++) {
    const date = monday.clone()
    date.add(i, 'days')
    week.push(date)
  }
  return week
}

export function debounce(fn, delay, ...option) {
  let timer = fn.timer
  return function () {
    if (timer) {
      clearTimeout(timer)
      fn.timer = setTimeout(() => {
        fn(...option)
      }, delay)
    } else {
      fn.timer = setTimeout(() => {
        fn(...option)
      }, delay)
    }
  }
}
export function getClientRect(component, selector) {
  return new Promise((resolve, reject) => {
    uni
      .createSelectorQuery()
      .in(component)
      .select(selector)
      .boundingClientRect((data) => {
        resolve(data)
      })
      .exec()
  })
}

export function getExactValue(original, offset, widthAndHeight) {
  return Math.floor((original - offset) / widthAndHeight) * widthAndHeight
}

export function getTimeFrame(x, y, top, left, hourParts, width, height) {
  return {
    x: Math.floor((x - left) / width) * width,
    y: Math.floor((y - top) / height) * height,
    width,
    hourParts,
    height,
  }
}

/**
 *
 * @param {Number} y y轴坐标位置
 * @param {Number} partHeight 每个part的高度
 * @param {Number} hourParts 1小时的有几个part
 * @param {Number} height 高度
 * @param {Number} begin 工作开始时间
 * @param {Number} end  工作结束时间
 * @returns
 */
export function getVisitTime(y, partHeight, hourParts, height, begin, end) {
  let startFloat = y / Math.ceil(partHeight * hourParts) + begin
  let endFloat = startFloat + Math.ceil(height / partHeight) / hourParts
  if (startFloat < begin) {
    startFloat = begin
  }
  if (endFloat > end) {
    endFloat = end
  }

  const [startHour, startMinute] = getSchedulerTime(startFloat)
  const [endHour, endMinute] = getSchedulerTime(endFloat)
  // console.log(startHour, startMinute, endHour, endMinute)
  return [startHour, startMinute, endHour, endMinute]
}

export function getSchedulerTime(float) {
  const hour = Math.floor(float)
  const minute = Math.ceil(60 * (float - hour))
  return [hour, minute]
}

export function getTopAndHeight(
  startHour,
  startMinute,
  endHour,
  endMinute,
  partHeight,
  hourParts,
  begin,
) {
  const top = (startHour + startMinute / 60 - begin) * partHeight * hourParts
  const end = (endHour + endMinute / 60 - begin) * partHeight * hourParts
  const height = end - top
  return {
    top,
    height,
  }
}
