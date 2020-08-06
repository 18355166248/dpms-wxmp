<template>
  <view class="appt-detail">
    <view class="circular-arc-top"></view>
    <view class="appt-detail-wrapper">
      <view class="appt-detail-wrapper-info-card">
        <card
          :marginConfig="{ position: ['left', 'right'] }"
          name="鱼"
          :avatarUrl="null"
          :gender="null"
          :age="12"
          :status="1"
        >
        </card>
      </view>
      <view class="appt-detail-wrapper-main-cotent">
        <view class="description-item">
          <view class="description-item-label">预约诊所</view>
          <view class="description-item-con">北吉熊直营店</view>
        </view>
        <view class="description-item">
          <view class="description-item-label">预约时间</view>
          <view class="description-item-con">2020-06-15 15:00</view>
        </view>
        <view class="description-item">
          <view class="description-item-label">预约</view>
          <view class="description-item-con">2020-06-15 15:00</view>
        </view>
        <view class="description-item">
          <view class="description-item-label">预约备注</view>
          <view class="description-item-con"
            >2020-06-15 15:00,内容内容内容内容内容内容内容内容,
            内容内容内容内容内容内容内容内容,内容内容内容内容内容内容内容内容,内容内容内容内容内容内容内容内容内容容</view
          >
        </view>
      </view>
    </view>
    <fixed-footer>
      <view class="button-group">
        <button class="button">取消</button>
        <button class="button">挂号</button>
        <button class="button">编辑</button>
      </view>
    </fixed-footer>
  </view>
</template>
<script>
import fixedFooter from '@/components/fixed-footer/fixed-footer.vue'
import card from '@/components/card/card.vue'
export default {
  data() {
    return {
      requestStatus: {
        loading: true,
        status: 'loading',
      },
    }
  },
  components: {
    card,
  },
  onLoad() {
    // 小程序请求数据，一般写在健壮的onLoad， 因为onShow会导致返回页面也加载
    uni.showNavigationBarLoading()
  },
  methods: {
    // 请求数据
    async loadData() {
      const [listErr, listRes] = await this.$utils.asyncTasks(
        appointmentAPI.getAppointmentDetail({
          appointmentId: appointmentId,
        }),
      )

      uni.hideNavigationBarLoading()
    },
  },
}
</script>
<style lang="scss" scoped>
.appt-detail {
  padding-top: 162rpx;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  background: $bg-color;

  .circular-arc-top {
    width: 100%;
    height: 162rpx;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 0;
    overflow: hidden;
    &::after {
      content: ' ';
      width: 100%;
      height: 162rpx;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 0;
      border-radius: 0 0 80% 80%;
      background: linear-gradient(
        160deg,
        $dpms-color-primary,
        $dpms-color-primary
      );
    }
  }
  &-wrapper {
    height: 100%;
    box-sizing: border-box;
    padding-top: 142rpx;
    position: relative;
    &-info-card {
      width: 100%;
      position: absolute;
      left: 0;
      top: 0;
      transform: translateY(-50%);
    }
    &-main-cotent {
      padding: 0 32rpx;
      color: $common-text-color;
      font-size: $dpms-font-size-base;

      .description-item {
        display: flex;
        align-items: flex-start;
        font-size: $dpms-font-size-base;
        color: $common-text-color;
        margin-bottom: $dpms-spacing-col-base;
        &-label {
          position: relative;
          display: -webkit-inline-box;
          display: -ms-inline-flexbox;
          display: inline-flex;
          min-width: 150rpx;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
          white-space: nowrap;

          &::after {
            content: ':';
            position: relative;
            top: -2rpx;
            margin: 0 16rpx 0 4rpx;
          }
        }
      }
    }
  }
  .button-group {
    display: flex;
    align-items: center;
    .button {
      flex: 1;
      height: 90rpx;
      line-height: 90rpx;
      text-align: center;
      background-color: $dpms-color-primary;
      color: #fff;
      box-sizing: border-box;
      border-radius: 0;
    }
    .button-ghost {
      background-color: #fff;
      color: $dpms-color-primary;
      border: 2rpx solid $dpms-color-primary;
    }
  }
}
</style>
