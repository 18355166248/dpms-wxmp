<template>
  <view class="time-item" :style="{ height: utils.addUnit(height) }">
    <view class="title">{{ utils.formatTime(timeTitle) }}</view>
    <view class="time-parts">
      <view class="part-item" v-for="index in parts" :key="index">
        {{ utils.formatTime((60 / parts) * index) }}
      </view>
    </view>
  </view>
</template>
<script module="utils" lang="wxs" src="./utils.wxs"></script>
<script>
import { parseHourPart } from './utils'

const defaultProps = {
  timeTitle: {
    type: Number,
    default: 1,
  },
  parts: {
    type: Number,
    default: 2,
  },
  height: {
    type: Number,
    default: 50,
  },
}

export default {
  props: defaultProps,
  data() {
    return {}
  },
  methods: {
    parseHourPart,
  },
}
</script>
<script module="utils" lang="wxs" src="./utils.wxs"></script>
<style lang="scss" scoped>
.time-item {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.time-item::after {
  position: absolute;
  content: '';
  bottom: 0;
  left: 0;
  right: 0;
  border-bottom: 1px solid #e5e5e5;
}
.time-parts {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
  color: #595959;
  height: 100%;
}
.time-parts::before {
  position: absolute;
  content: '';
  top: 0;
  bottom: 0;
  left: 0;
  border-left: 1px solid #e5e5e5;
  transform: scaleX(0.5);
}
.time-parts::after {
  position: absolute;
  content: '';
  top: 0;
  bottom: 0;
  right: 0;
  border-right: 1px solid #e5e5e5;
  transform: scaleX(0.5);
  z-index: 1;
}
.part-item {
  position: relative;
  flex: 1;
  width: 100%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
.part-item:not(:last-child)::after {
  position: absolute;
  content: '';
  left: 0;
  right: 0;
  bottom: 0;
  border-bottom: 1px solid #e5e5e5;
  transform: scaleY(0.5);
}
.title {
  flex: 1;
  text-align: center;
}
</style>
