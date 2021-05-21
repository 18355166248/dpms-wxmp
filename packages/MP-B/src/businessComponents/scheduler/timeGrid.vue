<template>
  <view class="grid-wrap" :style="{ width: utils.addUnit(width) }">
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
    <view
      id="grid"
      class="time-grid"
      :style="{
        backgroundImage: `linear-gradient(transparent ${utils.addUnit(
          partHeight - 1,
        )}, #e5e5e5 1px)`,
        backgroundSize: `${utils.addUnit(partHeight)} ${utils.addUnit(
          partHeight,
        )}`,
      }"
      @tap="onClick"
    >
      <createBar
        :show="showCreateBar"
        :frame="frame"
        :hourParts="hourParts"
        :beginHour="beginHour"
        :endHour="endHour"
        :partHeight="partHeight"
        :disable="disable"
        @onCreate.stop="onCreateAppointment"
      />
      <slot></slot>
    </view>
  </view>
</template>
<script module="utils" lang="wxs" src="./utils.wxs"></script>
<script>
import moment from 'moment'
import createBar from './createBar'
import { getClientRect, getTimeFrame, getExactValue } from './utils'
const defaultProps = {
  currentDate: [String, Number],
  disable: Boolean,
  isAll: {
    type: Boolean,
    default: false,
  },
  workBeginHour: {
    type: Number,
    default: 0,
  },
  workEndHour: {
    type: Number,
    default: 0,
  },
  offSetTop: {
    type: Number,
    default: 0,
  },
  viewableHeight: {
    type: Number,
    default: 500,
  },
  beginHour: {
    type: Number,
    default: 7,
  },
  endHour: {
    type: Number,
    default: 20,
  },
  hourParts: {
    type: Number,
    default: 4,
  },
  partHeight: {
    type: Number,
    default: 40,
  },
  cellWidth: {
    type: Number,
    default: 100,
  },
  scroll: {
    type: Object,
    default: {
      top: 0,
      left: 0,
    },
  },
  columnGroup: {
    type: Array,
  },
  width: {
    type: [String, Number],
    default: '100%',
  },
}
export default {
  props: defaultProps,
  data() {
    return {
      cellStyle: '',
      point: {},
      frame: {},
      showCreateBar: false,
    }
  },
  created() {
    uni.$on('hideCreateBar', () => {
      this.showCreateBar = false
    })
    this.triggerEvent = this.$scope.triggerEvent
  },
  beforeDestroy() {
    uni.$off('hideCreateBar')
  },
  computed: {
    morningOffHoursStyle() {
      const bottom = this.workBeginHour * this.partHeight * this.hourParts
      return `height:${bottom}px`
    },
    eveningOffHoursStyle() {
      const top = (24 - this.workEndHour) * this.partHeight * this.hourParts
      return `height:${top}px`
    },
  },
  methods: {
    async onClick({ detail }) {
      if (!this.disable) {
        if (this.showCreateBar) {
          this.showCreateBar = false
        } else {
          const result = await getClientRect(this, '#grid')
          const { x, y } = detail
          const { hourParts, partHeight, cellWidth } = this
          const { top, left } = result
          this.showCreateBar = true
          this.frame = getTimeFrame(
            x,
            y,
            top,
            left,
            hourParts,
            cellWidth,
            partHeight,
          )
        }
      }
    },
    onCreateAppointment(data) {
      const [startHour, startMinute, endHour, endMinute] = data
      const { cellWidth, frame, columnGroup, currentDate } = this
      const index = frame.x / cellWidth
      this.triggerEvent(
        'newAppointment',
        [
          {
            detail: {
              group: columnGroup[index],
              begin: moment(currentDate)
                .hours(startHour)
                .minutes(startMinute)
                .second(0)
                .millisecond(0),
              end: moment(currentDate)
                .hours(endHour)
                .minutes(endMinute)
                .second(0)
                .millisecond(0),
            },
          },
        ],
        {
          bubbles: true,
          composed: true,
        },
      )
      this.showCreateBar = false
    },
  },
  components: {
    createBar,
  },
}
</script>

<style lang="scss" scoped>
.grid-wrap {
  position: relative;
  height: 100%;
}
.time-grid {
  position: relative;
  display: flex;
  height: 100%;
  width: 100%;
  z-index: 1;
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

.time-grid::before {
  position: absolute;
  content: '';
  top: 0;
  bottom: 0;
  left: 0px;
  border-left: 1px solid #e5e5e5;
  transform: scaleX(0.5);
}
.cell {
  position: absolute;
  z-index: 1;
  background: rgba(77, 255, 247, 0.8);
}
</style>
