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

    <view class="today-work-card-footer">
      <badge :type="badge.type" :color="badge.color" :text="badge.text"></badge>
      <view class="today-work-card-footer-right">
        <text class="button">取 消</text>
        <text class="button">编 辑</text>
        <text class="button">挂 号</text>
      </view>
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
      cardClass: '',
      badge: {
        type: 'success',
        text: '--',
      },
    }
  },

  mounted() {
    // console.log("enums:", this.$utils.getEnums("Register"))

    this.cardClass = 'today-work-card-default'

    if (this.data.registerStatus === 1) {
      this.badge = { type: 'success', text: '已预约' }
      // this.cardClass = 'today-work-card-reserved'
    } else if (this.data.registerStatus === 2) {
      // this.cardClass = 'today-work-card-registered'
      this.badge = { type: 'error', text: '已挂号' }
    } else if (this.data.registerStatus === 3) {
      // this.cardClass = 'today-work-card-consulting'
      this.badge = { type: 'warning', text: '治疗中' }
    } else if (this.data.registerStatus === 4) {
      // this.cardClass = 'today-work-card-inTreatment'
      this.badge = { type: 'processing', text: '咨询中' }
    } else if (this.data.registerStatus === 5) {
      // this.cardClass = 'today-work-card-reserved'
      this.badge = { type: 'success', text: '治疗完成' }
    }
  },

  computed: {},

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

  margin: 32rpx 32rpx 0;
  border-radius: $uni-border-radius-base;
  background: $dpms-bg-color;
  padding: 32rpx;
  // border-top-width: 12rpx;
  // border-top-style: solid;

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
  &-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-right {
      .button {
        margin-left: 16rpx;
        padding: 8rpx 32rpx;
        font-size: 28rpx;
        border-radius: 28rpx;
        color: $dpms-color-primary;
        border: 2rpx solid $dpms-color-primary;
      }
    }
  }
}
.today-work-card-reserved {
  border-top-color: $dpms-color-primary;
}
.today-work-card-registered {
  border-top-color: #f2647c;
}
.today-work-card-inTreatment {
  border-top-color: #fbd438;
}
.today-work-card-consulting {
  border-top-color: #25e9f3;
}
.today-work-card-default {
  border-top-color: #666;
}
</style>
