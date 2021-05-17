<template>
  <view class="scheduler" ref="aaa">
    <headerBar
      :height="headerBarHeight"
      :leftWidth="timeBarWidth"
      :rightWidth="contentWidth"
      :columnGroup="sColumnGroup"
      :groupCount="sGroupCount"
      :scrollLeft="scrollOld.left"
      @changeScroll.stop="setHorizontalScroll"
    />
    <scroll-view
      id="verticalScroll"
      :style="{ height: utils.addUnit(verticalScrollHeight) }"
      :scroll-top="scrollTop"
      :scroll-y="enableScrollY"
      class="scroll-Y"
      :scroll-with-animation="animation"
      @scroll="verticalScroll"
    >
      <timeBar
        :isAll="isAll"
        :workBeginHour="beginHour"
        :workEndHour="endHour"
        :beginHour="sBeginHour"
        :endHour="sEndHour"
        :hourParts="hourParts"
        :partHeight="partHeight"
        :width="timeBarWidth"
      />
      <timeLine
        :date="currentDate"
        :beginHour="sBeginHour"
        :endHour="sEndHour"
        :partHeight="partHeight"
        :hourParts="hourParts"
        :timeWidth="timeBarWidth"
      />
      <view
        class="content-wrap"
        :style="{ left: utils.addUnit(timeBarWidth - 1) }"
        @updateScroll="onUpdateScroll"
        @enableScroll="onEnableScroll"
        @disableScroll="onDisableScroll"
      >
        <swiper
          circular
          :style="{ height: utils.addUnit(contentHeight), background: '#fff' }"
        >
          <swiper-item>
            <scroll-view
              :scroll-x="enableScrollX"
              :style="{ wdith: utils.addUnit(scrollWidth), height: '100%' }"
              :scroll-left="scrollLeft"
              @scroll="horizontalScroll"
            >
              <timeGrid
                :currentDate="currentDate"
                :isAll="isAll"
                :workBeginHour="beginHour"
                :workEndHour="endHour"
                :offSetTop="offSetTop"
                :viewableHeight="verticalScrollHeight"
                :beginHour="sBeginHour"
                :endHour="sEndHour"
                :hourParts="hourParts"
                :partHeight="partHeight"
                :width="contentWidth"
                :cellWidth="columnWidth"
                :scroll="scrollOld"
                :columnGroup="sColumnGroup"
              >
                <column
                  v-for="item in sColumnGroup"
                  :key="item.key"
                  :width="columnWidth"
                />

                <block v-for="(list, index) in scheduleList" :key="index">
                  <visitView
                    v-for="item in list"
                    :key="item.origin.id"
                    :timeInfo="item"
                    :contentHeight="contentHeight"
                    :viewableHeight="verticalScrollHeight"
                    :partHeight="partHeight"
                    :scroll="scrollOld"
                    :offSetTop="offSetTop"
                    :cellWidth="columnWidth"
                    :columnGroup="sColumnGroup"
                  />
                </block>
              </timeGrid>
            </scroll-view>
          </swiper-item>
        </swiper>
      </view>
    </scroll-view>
  </view>
</template>
<script module="utils" lang="wxs" src="./utils.wxs"></script>
<script>
import { getWeekDay, debounce, getClientRect } from './utils'
import moment from 'moment'
import timeBar from './timeBar'
import timeGrid from './timeGrid'
import column from './column'
import visitView from './visitView'
import headerBar from './headerBar'
import timeLine from './timeLine'
import TimeInfo from './lib/TimeInfo'
import MultiwayTree, { traverseDF } from './lib/MultiwayTree'
const systemInfo = uni.getSystemInfoSync()

const defaultProps = {
  currentDate: {
    type: [String, Number],
    default: Date.now(),
  },
  isAll: {
    type: Boolean,
    default: false,
  },
  headerBarHeight: {
    type: Number,
    default: 38,
  },
  beginHour: {
    type: Number,
    default: 9,
  },
  endHour: {
    type: Number,
    default: 20,
  },
  type: {
    type: String,
    default: 'group', // week
  },
  hourParts: {
    type: Number,
    default: 4,
  },
  partHeight: {
    type: Number,
    default: 30,
  },
  columnGroup: {
    type: Array,
    default: [
      {
        key: 1,
        title: '全部',
      },
      {
        key: 2,
        title: '医生1',
      },
      {
        key: 3,
        title: '医生2',
      },
      {
        key: 4,
        title: '其他2',
      },
      {
        key: 5,
        title: '其他3',
      },
      {
        key: 6,
        title: '其他4',
      },
    ],
  },
  displayGroupCount: {
    type: Number,
    default: 2,
  },
  height: {
    type: Number,
    default: 580,
  },
  timeBarWidth: {
    type: Number,
    default: 60,
  },
  resources: {
    type: Array,
    default: [],
  },
}
export default {
  props: defaultProps,
  data() {
    return {
      animation: false,
      sColumnGroup: [],
      sGroupCount: 1,
      scrollTop: 0,
      scrollLeft: 0,
      offSetTop: 0,
      verticalScrollHeight: 500,
      scheduleList: [],
      scrollOld: {
        top: 0,
        left: 0,
      },
      sBeginHour: 0,
      sEndHour: 0,
      enableScrollY: true,
      enableScrollX: true,
    }
  },
  computed: {
    contentHeight() {
      return (
        (this.sEndHour - this.sBeginHour) * this.partHeight * this.hourParts
      )
    },
    contentWidth() {
      const { screenWidth } = systemInfo
      const { timeBarWidth, sColumnGroup, sGroupCount } = this
      const width = screenWidth - timeBarWidth
      if (sColumnGroup.length === sGroupCount) {
        return width
      } else if (sColumnGroup.length < sGroupCount) {
        return width / sGroupCount
      } else {
        return (width / sGroupCount) * sColumnGroup.length
      }
    },
    scrollWidth() {
      const { screenWidth } = systemInfo
      const { timeBarWidth } = this
      return screenWidth - timeBarWidth
    },
    columnWidth() {
      const { screenWidth } = systemInfo
      const { timeBarWidth, sGroupCount } = this
      const width = screenWidth - timeBarWidth
      return width / sGroupCount
    },
  },
  watch: {
    isAll: {
      immediate: true,
      handler(value) {
        if (value) {
          this.sBeginHour = 0
          this.sEndHour = 24
        } else {
          this.sBeginHour = this.beginHour
          this.sEndHour = this.endHour
        }
        debounce(this.setHeight, 0)()
        debounce(this.render, 0)()
      },
    },
    height: {
      immediate: true,
      handler(value) {
        debounce(this.setHeight, 0)()
      },
    },
    headerBarHeight: {
      immediate: true,
      handler(value) {
        debounce(this.setHeight, 0)()
      },
    },
    currentDate: {
      immediate: true,
      handler(value) {
        debounce(this.setType, 0)()
      },
    },
    type: {
      immediate: true,
      handler(value) {
        debounce(this.setType, 0)()
      },
    },
    columnGroup: {
      immediate: true,
      handler(value) {
        debounce(this.setType, 0)()
      },
    },
    displayGroupCount: {
      immediate: true,
      handler(value) {
        debounce(this.setType, 0)()
      },
    },
    resources: {
      immediate: true,
      handler() {
        debounce(this.render, 0)()
      },
    },
  },
  created() {
    console.log(this.isAll)
  },
  updated() {
    if (!this.$firstLoad) {
      this.$firstLoad = true
      if (this.isAll) {
        this.animation = true
        this.$nextTick(() => {
          this.scrollTop = this.hourParts * this.partHeight * this.beginHour
          this.animation = false
        })
      }
    }
  },
  methods: {
    onEnableScroll() {
      this.enableScrollY = true
      this.enableScrollX = true
    },
    onDisableScroll() {
      this.enableScrollY = false
      this.enableScrollX = false
    },
    render() {
      const {
        resources,
        type,
        sColumnGroup,
        sGroupCount,
        date,
        sBeginHour,
        sEndHour,
        partHeight,
        hourParts,
        columnWidth,
      } = this

      let list = []
      const trees = []
      sColumnGroup.map((item, i) => {
        if (type === 'group') {
          list[i] = {
            id: i,
            name: 'group',
            date: item.date,
            children: resources
              .filter((visit) => visit.groupId === item.key)
              .sort((a, b) => {
                const begin = a.begin - b.begin
                const end = b.end - a.end
                if (begin > 0) {
                  //if (end) {
                  return 1
                  // } else {
                  //   return -1
                  // }
                } else {
                  return -1
                }
              }),
          }
        } else {
          const groupDate = moment(item.key)
          list[i] = {
            id: i,
            name: 'week',
            date: item.key,
            children: resources.filter((visit) =>
              groupDate.isSame(moment(visit.begin), 'd'),
            ),
          }
        }
      })
      list.forEach((item, index) => {
        const tree = new MultiwayTree(columnWidth, index)
        item.children.forEach((child) => {
          tree.add(
            new TimeInfo(
              moment(child.begin).toDate().getTime(),
              moment(child.end).toDate().getTime(),
              sBeginHour,
              sEndHour,
              hourParts,
              partHeight,
              child,
            ),
            traverseDF,
          )
        })
        trees.push(tree)
      })
      list = []
      trees.forEach((tree, i) => {
        list[i] = tree.getList()
      })
      this.scheduleList = list
    },
    setHeight() {
      const { height, headerBarHeight } = this
      getClientRect(this, '#verticalScroll').then((result) => {
        this.offSetTop = result.top
        this.verticalScrollHeight = height - headerBarHeight
      })
    },
    setType() {
      const { type, columnGroup, displayGroupCount, currentDate } = this
      uni.$emit('hideCreateBar')
      switch (type) {
        case 'group':
          this.sColumnGroup = columnGroup.map((item) => {
            return { ...item, date: currentDate, type: 'group' }
          })
          this.sGroupCount =
            columnGroup.length < displayGroupCount
              ? columnGroup.length
              : displayGroupCount
          break
        case 'week':
          const group = getWeekDay(currentDate).map((date) => {
            return {
              type: 'week',
              data: Object.freeze({
                day: date.locale('zh-cn').format('ddd'),
                date: date.date(),
                time: date.valueOf(),
                isCurrentDate: moment().isSame(date, 'd'),
              }),
              title: date.date(),
              key: date.valueOf(),
            }
          })
          this.sColumnGroup = group
          this.sGroupCount = group.length
          break
      }
      this.render()
    },
    verticalScroll(e) {
      this.scrollOld.top = e.detail.scrollTop
    },
    setHorizontalScroll(e) {
      this.scrollOld.left = e.detail.scrollLeft
      this.$nextTick(function () {
        this.scrollLeft = this.scrollOld.left
      })
    },
    horizontalScroll(e) {
      if (this.scrollOld.left !== e.detail.scrollLeft) {
        this.scrollOld.left = e.detail.scrollLeft
      }
    },
    setVerticalScroll({ top, left, cb }) {
      this.enableScrollY = true
      this.scrollOld.top = top
      this.scrollTop = top
    },
    onUpdateScroll({ detail }) {
      debounce(this.setVerticalScroll, 0, detail)()
    },
  },
  components: {
    headerBar,
    timeBar,
    timeGrid,
    column,
    visitView,
    timeLine,
  },
}
</script>

<style lang="scss" scoped>
.scheduler {
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica,
    Segoe UI, Arial, Roboto, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft Yahei', sans-serif;
}
.content-wrap {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
}
</style>
