<template>
  <view class="today-work-card">
    <view class="today-work-card-tag">
      <uni-tag text="标签"></uni-tag>
    </view>

    <view class="today-work-card-imgBox">
      <image
        class="today-work-card-imgBox-img"
        src="~@/static/avatar-male.png"
      ></image>
    </view>

    <view class="today-work-card-content">
      <view class="today-work-card-baseInfo">
        张三丰
      </view>
      <view class="today-work-card-tel">
        联系电话：15900451752
      </view>
      <view class="today-work-card-time">
        预约时间：{{ moment(data.appointmentBeginTimestamp).format('HH:mm') }} ~
        {{ moment(data.appointmentEndTimestamp).format('HH:mm') }}
      </view>
    </view>
  </view>
</template>

<script>
import moment from 'moment'
import uniTag from '@/components/uni-tag/uni-tag.vue'

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
  },

  methods: {},
}
</script>
<style lang="scss" scoped>
.today-work-card {
  position: relative;
  display: flex;
  margin: 20rpx 30rpx 0;
  border-radius: $uni-border-radius-base;
  background: $uni-color-success;
  padding: 10rpx;
  &-tag {
    position: absolute;
    right: 10rpx;
    top: 0;
  }
  &-imgBox {
    width: 200rpx;
    height: 200rpx;
    overflow: hidden;
    &-img {
      height: 100%;
      width: 100%;
    }
  }
  &-content {
    margin-left: 20rpx;
  }
}
</style>
