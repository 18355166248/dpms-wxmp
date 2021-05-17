<template>
  <view class="time-bar" :style="{ width: utils.addUnit(width) }">
    <view
      v-if="isAll"
      class="morning-work-time"
      :style="morningOffHoursStyle"
    ></view>
    <view
      v-if="isAll"
      class="evening-work-time"
      :style="eveningOffHoursStyle"
    ></view>
    <timeItem
      v-for="hour in hourAmountOneDay"
      :key="hour"
      :timeTitle="beginHour + hour"
      :parts="hourParts"
      :height="partHeight * hourParts"
    />
  </view>
</template>
<script module="utils" lang="wxs" src="./utils.wxs"></script>
<script>
import timeItem from './timeItem'

const defaultProps = {
  isAll: Boolean,
  workBeginHour: Number,
  workEndHour: Number,
  beginHour: Number,
  endHour: Number,
  hourParts: Number,
  partHeight: Number,
  width: Number,
}
export default {
  props: defaultProps,
  components: {
    timeItem,
  },
  computed: {
    hourAmountOneDay() {
      return this.endHour - this.beginHour
    },
    morningOffHoursStyle() {
      const bottom = this.workBeginHour * this.partHeight * this.hourParts
      return `height:${bottom}px`
    },
    eveningOffHoursStyle() {
      const top = (24 - this.workEndHour) * this.partHeight * this.hourParts
      return `height:${top}px`
    },
  },
}
</script>
<style lang="scss" scoped>
.time-bar {
  position: relative;
  color: #595959;
  background: #fff;
}
.morning-work-time,
.evening-work-time {
  position: absolute;
  left: 0;
  right: 0;
  background: #d9d9d9;
}
.morning-work-time {
  top: 0;
}
.evening-work-time {
  bottom: 0;
}
</style>
