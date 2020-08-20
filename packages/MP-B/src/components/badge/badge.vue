<template>
  <text class="badge">
    <text
      v-if="color"
      :class="['badge-status-dot', `badge-status-${type}`]"
      :style="{ backgroundColor: color }"
    ></text>
    <text v-else :class="['badge-status-dot', `badge-status-${type}`]"></text>
    <text v-if="text" class="badge-status-text">{{ text }}</text>
  </text>
</template>
<script>
export default {
  name: 'badge',
  props: {
    type: {
      type: String,
      default: 'default',
    },
    color: {
      type: String,
    },
    text: {
      type: String,
    },
  },
}
</script>

<style lang="scss" scoped>
.badge {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5715;
  list-style: none;
  -webkit-font-feature-settings: 'tnum';
  font-feature-settings: 'tnum';
  position: relative;
  display: inline-block;
  color: unset;
  line-height: 1;
  &-status {
    line-height: inherit;
    vertical-align: baseline;

    &-text {
      margin-left: 8px;
      color: rgba(0, 0, 0, 0.65);
      font-size: 14px;
    }

    &-dot {
      position: relative;
      top: -1px;
      display: inline-block;
      width: 16rpx;
      height: 16rpx;
      vertical-align: middle;
      border-radius: 50%;
    }
    &-error {
      background: #f2647c;
    }
    &-success {
      background: #5cbb89;
    }
    &-processing {
      background: #25e9f3;
      &::after {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: 1rpx solid #25e9f3;
        border-radius: 50%;
        -webkit-animation: statusProcessing 1.2s infinite ease-in-out;
        animation: statusProcessing 1.2s infinite ease-in-out;
        content: '';
      }
    }
    &-warning {
      background: rgb(250, 204, 20);
      &::after {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: 1rpx solid rgb(250, 204, 20);
        border-radius: 50%;
        -webkit-animation: statusProcessing 1.2s infinite ease-in-out;
        animation: statusProcessing 1.2s infinite ease-in-out;
        content: '';
      }
    }
    &-default {
      background: #d9d9d9;
    }
  }

  @keyframes statusProcessing {
    0% {
      -webkit-transform: scale(0.8);
      transform: scale(0.8);
      opacity: 0.5;
    }
    100% {
      -webkit-transform: scale(2.4);
      transform: scale(2.4);
      opacity: 0;
    }
  }
}
</style>
