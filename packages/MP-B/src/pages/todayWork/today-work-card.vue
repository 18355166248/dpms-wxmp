<template>
  <view class="today-work-card">
    <view class="today-work-card-body">
      <view class="today-work-card-imgBox">
        <image
          class="today-work-card-imgBox-img"
          src="~@/static/avatar-male.png"
        ></image>
      </view>

      <view class="today-work-card-content">
        <view class="today-work-card-baseInfo">
          <text class="today-work-card-baseInfo-name">张三丰</text>

          <uni-tag
            text="32"
            :inverted="true"
            :circle="false"
            type="error"
          ></uni-tag>
          <uni-tag
            text="男"
            :inverted="true"
            :circle="false"
            type="primary"
          ></uni-tag>
        </view>
        <view class="today-work-card-tel">
          联系电话：15900451752
        </view>
        <view class="today-work-card-time">
          预约时间：{{ moment(data.appointmentBeginTimestamp).format('HH:mm') }}
          ~
          {{ moment(data.appointmentEndTimestamp).format('HH:mm') }}
        </view>
      </view>
    </view>

    <view>
      <badge type="processing" text="已预约"></badge>
    </view>
  </view>
</template>

<script>
import moment from 'moment'
import uniTag from '@/components/uni-tag/uni-tag.vue'
import badge from '@/components/badge/badge.vue'

export default {
  name: 'todayWorkCard',
  props: {
    data: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      moment,
    }
  },

  components: {
    uniTag,
    badge,
  },

  methods: {},
}
</script>
<style lang="scss" scoped>
.today-work-card {
  position: relative;

  margin: 32rpx;
  border-radius: $uni-border-radius-base;
  background: $dpms-bg-color;
  padding: 32rpx;
  border-top: 12rpx solid $dpms-color-primary;

  &-body {
    display: flex;
  }
  &-imgBox {
    width: 120rpx;
    height: 120rpx;
    overflow: hidden;
    &-img {
      height: 100%;
      width: 100%;
    }
  }
  &-content {
    margin-left: 32rpx;
    margin-bottom: 48rpx;
    font-size: 28rpx;
    color: rgba(0, 0, 0, 0.5);

    .today-work-card-baseInfo {
      margin-bottom: 16rpx;
      &-name {
        font-size: 36rpx;
        font-weight: 500;
        margin-right: 16rpx;
      }
    }
    &-tel {
      margin-bottom: 8rpx;
    }
  }
}
</style>
