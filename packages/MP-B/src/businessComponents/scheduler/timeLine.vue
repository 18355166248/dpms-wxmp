<template>
  <view v-if="show" class="time-line" :style="{ top: utils.addUnit(top) }">
    <view class="wrap">
      <view
        class="time"
        :style="{
          top: '-' + utils.addUnit(partHeight / 2),
          height: utils.addUnit(partHeight),
          wdith: utils.addUnit(timeWidth - 1),
        }"
        >{{ time }}</view
      >
      <view
        class="line"
        :style="{
          left: utils.addUnit(timeWidth - 1),
        }"
      />
    </view>
  </view>
</template>
<script module="utils" lang="wxs" src="./utils.wxs"></script>
<script>
import moment from 'moment'
import { getTopAndHeight } from './utils'
const defaultProps = {
  date: [String, Number],
  beginHour: Number,
  endHour: Number,
  partHeight: Number,
  hourParts: Number,
  timeWidth: Number,
}
export default {
  props: defaultProps,
  data() {
    return {
      currentDate: moment(),
      time: '',
      top: 0,
      show: true,
    }
  },
  created() {
    this.currentDate = moment()
    this.$intervalID = setInterval(() => {
      this.currentDate = moment()
    }, 60 * 1000)
  },

  beforeDestroy() {
    clearInterval(this.$intervalID)
  },
  watch: {
    currentDate(date) {
      const { beginHour, partHeight, hourParts } = this
      const hour = date.hour()
      const minute = date.minute()
      const { top } = getTopAndHeight(
        hour,
        minute,
        hour,
        minute,
        partHeight,
        hourParts,
        beginHour,
      )
      this.top = top
      this.time = date.format('HH:mm')
    },
    date(value) {
      this.show = moment(value).isSame(this.currentDate, 'd')
    },
  },
  components: {},
}
</script>

<style lang="scss" scoped>
.time-line {
  position: absolute;
  z-index: 20;
  left: 0;
  right: 0;
  top: 300px;
}
.wrap {
  position: relative;
  > .time {
    position: absolute;
    background: white;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #f00;
    width: 58px;
    text-align: center;
  }
  > .line {
    position: absolute;
    right: 0;
    border-top: 1px solid #f00;
    &::before {
      position: absolute;
      content: '';
      left: 0;
      top: -3px;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background-color: #f00;
    }
  }
}
</style>
