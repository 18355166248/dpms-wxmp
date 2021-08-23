<template>
  <view
    class="visit"
    :style="style"
    @tap.stop="onClick"
    @longpress.stop="onLongpress"
    @touchend="onTouchend"
    @touchmove="onTouchMove"
  >
    <view
      :data-flag="timeInfo.origin.flag"
      :style="timeInfo.origin.cardStyle"
      :class="contentClass"
    >
      <view>
        <view class="title ellipsis">
          <view class="name">{{ timeInfo.origin.title }}</view>
          <view class="personalInfo">
            {{ timeInfo.origin.subTitle }}
          </view>
        </view>
        <view
          class="type"
          v-for="(item, index) in timeInfo.origin.items"
          :key="index"
          :style="item.typeStyle"
        >
          <view class="ellipsis">{{ item.typeName }}</view>
        </view>
      </view>
      <view v-if="timeInfo.origin.showTime" class="ellipsis appointmentTime">{{
        betweenTime
      }}</view>
    </view>
  </view>
</template>
<script>
import moment from 'moment'
import { debounce, getVisitTime, getTopAndHeight } from './utils'
const defaultProps = {
  timeInfo: {
    type: Object,
    default: {},
  },
  scroll: {
    type: Object,
    default: {
      top: 300,
      left: 0,
    },
  },
  offSetTop: {
    type: Number,
    value: 0,
  },
  partHeight: {
    type: Number,
    value: 0,
  },
  height: {
    type: Number,
    value: 0,
  },
  contentHeight: {
    type: Number,
    default: 500,
  },
  viewableHeight: {
    type: Number,
    default: 500,
  },
  cellWidth: Number,
  columnGroup: Array,
  disable: Boolean,
}
export default {
  props: defaultProps,
  data() {
    return {
      visitTime: [],
      point: {
        left: 0,
        top: 0,
      },
      style: '',
    }
  },
  created() {
    this.triggerEvent = this.$scope.triggerEvent
    this.render()
  },
  watch: {
    timeInfo() {
      this.render()
    },
    cellWidth() {
      this.render()
    },
  },
  computed: {
    contentClass() {
      return `content ${this.timeInfo.origin.lock ? 'lock' : ''} ${
        this.timeInfo.origin.flag ? 'flag' : ''
      }`
    },
    betweenTime() {
      const { timeInfo, visitTime } = this
      if (visitTime.length > 0) {
        let [startHour, startMinute, endHour, endMinute] = visitTime
        startMinute = startMinute > 10 ? startMinute : startMinute + '0'
        endMinute = endMinute > 10 ? endMinute : endMinute + '0'
        return `${startHour}:${startMinute} - ${endHour}:${endMinute}`
      } else if (timeInfo.origin) {
        return `${moment(timeInfo.origin.begin).format('HH:mm')}-${moment(
          timeInfo.origin.end,
        ).format('HH:mm')}`
      }
    },
  },
  methods: {
    render() {
      const { timeInfo } = this
      this.setStyle(
        timeInfo.left,
        timeInfo.top,
        timeInfo.width,
        timeInfo.height,
      )
    },
    onClick(e) {
      uni.$emit('hideCreateBar')
      this.triggerEvent('detail', [{ detail: this.timeInfo.origin }], {
        bubbles: true,
        composed: true,
      })
    },
    onLongpress(e) {
      const { timeInfo, scroll, disable } = this
      if (!timeInfo.origin.lock && !disable) {
        uni.$emit('hideCreateBar')
        this.triggerEvent(
          'disableScroll',
          {},
          {
            bubbles: true,
            composed: true,
          },
        )
        const { touches, currentTarget } = e
        this.$touch = {
          ...touches[0],
          ...currentTarget,
        }
        this.$top = this.$touch.offsetTop
        this.$oldTop = scroll.top
        this.$canMove = true
        uni.vibrateShort()
      }
    },
    onTouchMove(e) {
      if (this.$canMove) {
        clearInterval(this.$updateScrollTopId)
        const { viewableHeight, offSetTop, scroll, contentHeight } = this
        const {
          left,
          width,
          height,
          partHeight,
          hourParts,
          beginHour,
          endHour,
        } = this.timeInfo
        const { touches, currentTarget } = e
        const touch = {
          ...touches[0],
          ...currentTarget,
        }
        let top = this.$top + (touch.pageY - this.$touch.pageY)
        const visitTime = getVisitTime(
          Math.floor(top / partHeight) * partHeight,
          partHeight,
          hourParts,
          height,
          beginHour,
          endHour,
        )
        this.visitTime = visitTime
        if (touch.clientY - offSetTop + partHeight > viewableHeight) {
          clearInterval(this.$updateScrollTopId)
          this.$touch = touch
          this.updateScrollTop(scroll.top, 10)
        } else if (
          touch.clientY - offSetTop - partHeight <= 0 &&
          this.$oldTop > 0
        ) {
          clearInterval(this.$updateScrollTopId)
          this.$touch = touch
          this.updateScrollTop(scroll.top, -10)
        } else if (touch.clientY - offSetTop > viewableHeight) {
          clearInterval(this.$updateScrollTopId)
          //this.$touch = touch
          top = contentHeight - partHeight
          this.setStyle(left, top, width, height, 10)
        } else {
          clearInterval(this.$updateScrollTopId)
          //this.$touch = touch
          top = top <= 0 ? 0 : top
          this.setStyle(left, top, width, height, 10)
        }
      }
    },
    onTouchend(e) {
      const [touch] = e.changedTouches
      if (this.$canMove) {
        const {
          left,
          width,
          height,
          partHeight,
          hourParts,
          beginHour,
          endHour,
          origin,
        } = this.timeInfo

        const { cellWidth, columnGroup } = this

        this.$top = this.$top + (touch.pageY - this.$touch.pageY)
        this.$top = Math.floor(this.$top / partHeight) * partHeight
        this.$top = this.$top < 0 ? 0 : this.$top
        const visitTime = getVisitTime(
          this.$top,
          partHeight,
          hourParts,
          height,
          beginHour,
          endHour,
        )
        const { top, height: newHeight } = getTopAndHeight(
          ...visitTime,
          partHeight,
          hourParts,
          beginHour,
        )
        this.$top = top
        this.visitTime = visitTime
        const [sh, sm, eh, em] = this.visitTime
        const index = Math.ceil(left / cellWidth)
        this.setStyle(left, this.$top, width, newHeight, 5)
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
        setTimeout(() => {
          this.triggerEvent(
            'changeAppointment',
            [
              {
                detail: {
                  origin,
                  change: {
                    group: columnGroup[index],
                    begin: moment(origin.begin)
                      .hours(sh)
                      .minutes(sm)
                      .second(0)
                      .millisecond(0),
                    end: moment(origin.end)
                      .hours(eh)
                      .minutes(em)
                      .second(0)
                      .millisecond(0),
                  },
                  confirm: this.onConfirm,
                },
              },
            ],
            {
              bubbles: true,
              composed: true,
            },
          )
        }, 0)
      }
    },
    onConfirm(isConfirm) {
      if (!isConfirm) {
        this.visitTime = []
        this.render()
      }
    },
    updateScrollTop(top, offsetTop) {
      clearInterval(this.$updateScrollTopId)
      const {
        scroll,
        timeInfo,
        viewableHeight,
        contentHeight,
        partHeight,
      } = this
      let oldTop = scroll.top
      const setScrollTop = () => {
        if (offsetTop > 0) {
          if (oldTop + offsetTop + partHeight >= contentHeight) {
            oldTop = contentHeight - partHeight
            this.$top = oldTop
          } else if (oldTop + offsetTop + viewableHeight < contentHeight) {
            oldTop += offsetTop
            this.$top = oldTop + offsetTop + viewableHeight - partHeight
          } else if (oldTop != contentHeight - viewableHeight) {
            oldTop = contentHeight - viewableHeight
          }
        } else {
          if (oldTop + offsetTop >= 0) {
            oldTop += offsetTop
            this.$top = oldTop
          } else {
            this.$top = oldTop = 0
          }
        }
        this.$oldTop = oldTop

        this.onVerticalScroll({ top: oldTop })

        this.setStyle(
          timeInfo.left,
          this.$top,
          timeInfo.width,
          timeInfo.height,
          10,
        )
        if (this.$top === 0 || oldTop + viewableHeight >= contentHeight) {
          clearInterval(this.$updateScrollTopId)
        }
      }
      this.$updateScrollTopId = setInterval(setScrollTop, 100)
    },
    onVerticalScroll(detail) {
      this.triggerEvent('updateScroll', detail, {
        bubbles: true,
        composed: true,
      })
    },
    setStyle(left, top, width, height, zIndex) {
      this.style = `
      width:${Math.ceil(width - 1)}px;
      height:${height}px;
      top:${top - 1}px;
      left:${Math.ceil(left)}px;
      z-index:${zIndex || 1}`
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
  word-break: keep-all;
}
.visit {
  position: absolute;
  z-index: 1;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 3px;
  transition: all 3ms;
  overflow: hidden;
}
.flag {
  &::before {
    position: absolute;
    top: -1px;
    right: 5px;
    z-index: 1;
    content: attr(data-flag);
    color: #fff;
    font-size: 10px;
  }
  &::after {
    position: absolute;
    top: 0;
    right: 0;
    content: '';
    width: 0;
    height: 0;
    border-top: 24px solid #f6404a;
    border-left: 30px solid transparent;
  }
}
.content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  height: 100%;
  width: 100%;
  background-color: #fff;
  border-radius: 3px;
  overflow: hidden;

  .title {
    display: inline-block;
    margin: 4px 8px;
    font-weight: 400;
    line-height: 18px;
    .name {
      display: inline-block;
      font-size: 14px;
      margin-right: 5px;
      color: rgba(0, 0, 0, 0.9);
    }
    .personalInfo {
      display: inline-block;
      font-size: 13px;
      color: rgba(0, 0, 0, 0.65);
    }
  }
  .type {
    display: inline-block;
    margin-left: 8px;
    margin-bottom: 8px;
    padding: 2px 8px;
    font-size: 13px;
    border-radius: 2px;
  }
  .appointmentTime {
    margin: 4px 8px;
    color: rgba(0, 0, 0, 0.5);
    font-size: 11px;
  }
}
</style>
