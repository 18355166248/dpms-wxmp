<template>
  <view v-if="show" class="create-bar" :style="style">
    <view class="content">
      <view
        class="header"
        @touchstart.stop="onTouchStart('up', $event)"
        @touchmove="onTouchMove"
        @touchend="onTouchMoveEnd"
      />
      <view
        class="body"
        @touchstart.stop="onTouchStart('move', $event)"
        @touchmove="onTouchMove"
        @touchend="onTouchMoveEnd"
      >
        <view class="ellipsis">再次点击新建预约</view>
        <view v-if="currentHeight > minHeight" class="times ellipsis">{{
          betweenTime
        }}</view>
      </view>
      <view
        class="footer"
        @touchstart.stop="onTouchStart('down', $event)"
        @touchmove.stop="onTouchMove"
        @touchend.stop="onTouchMoveEnd"
      />
    </view>
  </view>
</template>

<script>
import { debounce, getVisitTime, getTopAndHeight } from './utils'
const defaultProps = {
  beginHour: Number,
  endHour: Number,
  partHeight: Number,
  hourParts: Number,
  frame: Object,
  show: Boolean,
  disable: Boolean,
}
export default {
  props: defaultProps,
  data() {
    return {
      style: '',
      currentHeight: 0,
      minHeight: 50,
      visitTime: [],
      part: 1,
    }
  },
  watch: {
    show: {
      immediate: true,
      handler() {
        this.part = 1
      },
    },
    frame: {
      immediate: true,
      handler(value) {
        this.$top = value.y
        debounce(this.render, 0)()
      },
    },
  },
  created() {
    this.triggerEvent = this.$scope.triggerEvent
  },
  computed: {
    betweenTime() {
      const { visitTime } = this
      if (visitTime.length > 0) {
        let [startHour, startMinute, endHour, endMinute] = visitTime
        startMinute = startMinute > 10 ? startMinute : startMinute + '0'
        endMinute = endMinute > 10 ? endMinute : endMinute + '0'
        return `${startHour}:${startMinute} - ${endHour}:${endMinute}`
      }
      return ''
    },
  },
  methods: {
    render() {
      const { partHeight, hourParts, beginHour, endHour, part } = this
      const { x, width } = this.frame
      this.$h = partHeight * part

      const visitTime = getVisitTime(
        this.$top || 0,
        partHeight,
        hourParts,
        this.$h,
        beginHour,
        endHour,
      )
      const { top, height } = getTopAndHeight(
        ...visitTime,
        partHeight,
        hourParts,
        beginHour,
      )
      this.$h = height
      this.$top = top
      this.visitTime = visitTime
      this.setStyle(x, this.$top, width, this.$h)
    },
    onTouchStart(type, e) {
      const [touch] = e.touches
      this.$canMove = true
      this.$type = type
      this.$touch = touch
      this.triggerEvent(
        'disableScroll',
        {},
        {
          bubbles: true,
          composed: true,
        },
      )
      uni.vibrateShort()
    },
    onTouchMove(e) {
      const [touch] = e.touches
      const { part, partHeight, hourParts, beginHour, endHour } = this
      const { x, width } = this.frame
      if (this.$canMove) {
        if (this.$type === 'down') {
          this.$h = partHeight * part + (touch.pageY - this.$touch.pageY)
          const visitTime = getVisitTime(
            this.$top,
            partHeight,
            hourParts,
            this.$h,
            beginHour,
            endHour,
          )
          this.visitTime = visitTime
          this.setStyle(x, this.$top, width, this.$h)
        } else if (this.$type === 'up') {
          const top = this.$top + (touch.pageY - this.$touch.pageY)
          this.$h = partHeight * part + (this.$touch.pageY - touch.pageY)
          const visitTime = getVisitTime(
            Math.floor(top / partHeight) * partHeight,
            partHeight,
            hourParts,
            this.$h,
            beginHour,
            endHour,
          )
          this.visitTime = visitTime
          this.setStyle(x, top, width, this.$h)
        } else {
          const top = this.$top + (touch.pageY - this.$touch.pageY)
          const visitTime = getVisitTime(
            Math.floor(top / partHeight) * partHeight,
            partHeight,
            hourParts,
            this.$h,
            beginHour,
            endHour,
          )
          this.visitTime = visitTime
          this.setStyle(x, top, width, this.$h)
        }
      }
    },
    onTouchMoveEnd(e) {
      const { partHeight } = this
      const [touch] = e.changedTouches
      const offsetTop = touch.pageY - this.$touch.pageY
      if (offsetTop === 0) {
        this.$emit('onCreate', this.visitTime)
        this.triggerEvent(
          'enableScroll',
          {},
          {
            bubbles: true,
            composed: true,
          },
        )
        return
      } else if (this.$canMove) {
        if (this.$type === 'down') {
          this.part = Math.ceil(this.$h / partHeight)
          this.$h = this.part * partHeight
          this.render()
        } else if (this.$type === 'up') {
          const top = this.$top + (touch.pageY - this.$touch.pageY)
          this.part = Math.ceil(this.$h / partHeight)
          this.$h = this.part * partHeight
          this.$top = Math.floor(top / partHeight) * partHeight
          this.render()
        } else {
          const top = this.$top + (touch.pageY - this.$touch.pageY)
          this.$top = Math.floor(top / partHeight) * partHeight
          this.render()
        }
        this.$canMove = false
        this.triggerEvent(
          'enableScroll',
          {},
          {
            bubbles: true,
            composed: true,
          },
        )
        uni.vibrateShort()
      }
    },
    // onCreateAppointment(e) {
    //   this.$emit('onCreate', this.visitTime)
    // },
    setStyle(x, y, width, height) {
      this.currentHeight = height
      this.style = `top:${y}px; left:${x}px; z-index:10; width:${
        width - 1
      }px;height:${height - 1}px;`
    },
  },
}
</script>

<style lang="scss" scoped>
.ellipsis {
  display: -webkit-box !important;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  word-break: break-all !important;
}
.create-bar {
  position: absolute;
  background: #5cbb89;
  border-radius: 2px;
}
.content {
  position: relative;
  color: #fff;
  height: 100%;
}
.body {
  padding: 7px 8px;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  line-height: 16px;
}
.header,
.footer {
  position: absolute;
  z-index: 1;
  height: 7px;
  left: 0;
  right: 0;

  &:before {
    position: absolute;
    z-index: 2;
    background-color: #fff;
    content: '';
    width: 5px;
    height: 5px;
    border-radius: 50%;
    border: 1px solid #5cbb89;
  }
}
.header {
  top: 0;
  &:before {
    top: -3px;
    left: 25px;
  }
}
.footer {
  bottom: 0;
  &:before {
    bottom: -3px;
    right: 25px;
  }
  justify-content: space-between;
}
.times {
  margin-top: auto;
  font-size: 12px;
  color: #ccc;
}
</style>
