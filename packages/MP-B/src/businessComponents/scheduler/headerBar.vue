<template>
  <view class="header">
    <view
      class="menu-left"
      hover-class="hover"
      @click.stop="onMenu"
      :style="{
        height: utils.addUnit(height),
        width: utils.addUnit(leftWidth),
      }"
    >
      <view class="iconfont icon-whole" />
    </view>
    <view
      v-if="showPrev"
      class="prev"
      hover-class="hover"
      :style="{ left: utils.addUnit(leftWidth - 1) }"
      @click.stop="onPrev"
    >
      <view class="iconfont icon-arrow-left"></view>
    </view>
    <view v-if="showNext" class="next" hover-class="hover" @click.stop="onNext">
      <view class="iconfont icon-arrow-right"></view>
    </view>
    <view
      class="group"
      :style="{
        width: utils.addUnit(rightWidth),
        left: utils.addUnit(leftWidth - 1),
        transform: `translateX(-${utils.addUnit(scrollLeft)})`,
      }"
    >
      <block v-for="item in columnGroup" :key="item.key">
        <view class="item item-day" v-if="item.type === 'week'">
          <view :class="{ active: item.data.isCurrentDate }">{{
            item.data.day
          }}</view>
          <view :class="{ active: item.data.isCurrentDate }">
            {{ item.title }}
          </view>
        </view>
        <view class="item" v-if="item.type === 'group'">
          <view class="ellipsis">
            {{ item.title }}
          </view>
        </view>
      </block>
    </view>
  </view>
</template>
<script module="utils" lang="wxs" src="./utils.wxs"></script>
<script>
const defaultProps = {
  height: {
    type: Number,
    default: 40,
  },
  leftWidth: {
    type: Number,
    default: 60,
  },
  rightWidth: {
    type: Number,
    default: 60,
  },
  columnGroup: {
    type: Array,
    default: [],
  },
  groupCount: {
    type: Number,
    default: 1,
  },
  scrollLeft: {
    type: Number,
    default: 0,
  },
}
export default {
  props: defaultProps,
  created() {
    this.triggerEvent = this.$scope.triggerEvent
  },
  computed: {
    showPrev() {
      const { rightWidth, columnGroup, scrollLeft } = this
      const columnWidth = Math.floor(rightWidth / columnGroup.length)

      return scrollLeft > columnWidth / 1.25
    },
    showNext() {
      const { rightWidth, groupCount, columnGroup, scrollLeft } = this
      const columnWidth = Math.ceil(rightWidth / columnGroup.length)
      return (
        scrollLeft + columnWidth * groupCount + columnWidth / 1.25 < rightWidth
      )
    },
  },
  methods: {
    onMenu(e) {
      this.triggerEvent('menu', [e], {
        bubbles: true,
        composed: true,
      })
    },
    onPrev() {
      const { rightWidth, columnGroup, scrollLeft } = this
      const columnWidth = Math.ceil(rightWidth / columnGroup.length)
      let left = (Math.ceil(scrollLeft / columnWidth) - 1) * columnWidth
      left = left < 0 ? 0 : left
      this.$emit('changeScroll', {
        detail: {
          scrollLeft: left,
        },
      })
    },
    onNext() {
      const { rightWidth, groupCount, columnGroup, scrollLeft } = this
      const columnWidth = Math.ceil(rightWidth / columnGroup.length)
      if (scrollLeft + columnWidth * groupCount < rightWidth) {
        let left = (Math.ceil(scrollLeft / columnWidth) + 1) * columnWidth
        left =
          left + columnWidth * groupCount > rightWidth
            ? rightWidth - columnWidth * groupCount
            : left
        this.$emit('changeScroll', {
          detail: {
            scrollLeft: left,
          },
        })
      }
    },
  },
}
</script>
<style lang="scss">
.iconfont {
  font-size: 16px !important;
}
.icon-whole {
  font-size: 20px !important;
  color: #6cc194;
}
</style>
<style lang="scss" scoped>
.ellipsis {
  display: -webkit-box !important;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  word-break: keep-all;
}
.header {
  position: relative;
  background: #feffff;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
  z-index: 10;
}
.menu-left {
  position: relative;
  z-index: 10;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #feffff;
  &::before {
    position: absolute;
    content: '';
    right: 0px;
    top: 0;
    bottom: 0;
    border-right: 1px solid #e5e5e5;
    transform: scaleX(0.5);
  }
}
.prev,
.next {
  top: 0;
  position: absolute;
  background-color: #feffff;
  height: 100%;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  border-left: 1px solid #e5e5e5;
  border-right: 1px solid #e5e5e5;
  color: #bfbfbf;
}
.next {
  right: 0;
}

.group {
  position: absolute;
  top: 0;
  font-size: 14px;
  display: flex;
  height: 100%;
  transition: all;
  .item {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    &::before {
      position: absolute;
      content: '';
      right: 0px;
      top: 0;
      bottom: 0;
      border-right: 1px solid #e5e5e5;
      transform: scaleX(0.5);
    }
  }
  .item-day {
    flex-direction: column;
  }
}
.active {
  color: #6cc194;
}
.hover::before {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  border: inherit;
  border-radius: inherit;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  opacity: 0;
  content: ' ';
  background-color: rgba(0, 0, 0, 0.1);
  opacity: 0.7 !important;
}
</style>
