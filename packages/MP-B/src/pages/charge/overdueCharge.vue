<template>
  <view class="overdue-charge-wrap">
    <view class="list-wrap">
      <view class="item" v-for="(item, index) in list" :key="index">
        <view class="overdue-infos">
          <view class="info-left">
            <view>普通收费</view>
            <view>北吉熊南京分店</view>
            <view>2020-09-20 09:30</view>
          </view>
          <view class="info-right">
            <view class="labels">
              <view>应收金额：</view>
              <view>实收金额：</view>
              <view>欠费：</view>
            </view>
            <view class="values">
              <view>¥200,950.00</view>
              <view class="red-color">¥150.00</view>
              <view class="green-color">¥150.00</view>
            </view>
          </view>
        </view>
        <view class="checkbox">
          <dpmsCheckbox shape="square" :value="item.checked"> </dpmsCheckbox>
        </view>
      </view>
    </view>
    <view class="bottom-wrap">
      <view>总计金额：<span>¥200,950.00</span></view>
      <chargeButton type="solid" :buttonStyle="buttonStyle" @click="nextStep"
        >下一步</chargeButton
      >
    </view>
  </view>
</template>
<script>
import chargeButton from './common/chargeButton'

export default {
  name: '',
  data() {
    return {
      list: [
        {
          checked: false,
        },
        {
          checked: true,
        },
        {
          checked: false,
        },
        {
          checked: false,
        },
        {
          checked: true,
        },
        {
          checked: false,
        },
        {
          checked: false,
        },
        {
          checked: true,
        },
        {
          checked: false,
        },
      ],
      buttonStyle: { width: '332rpx' },
    }
  },
  computed: {},
  onLoad() {},
  onShow() {},
  onHide() {},
  onUnload() {},
  methods: {
    hideActionSheet() {
      this.showActionSheet = false
    },
  },
  watch: {
    watchData: {
      handler(newVal, oldVal) {},
      deep: true,
      immediate: true,
    },
  },
  components: { chargeButton },
}
</script>
<style lang="scss" scoped>
.overdue-charge-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 28rpx;
  color: #191919;
  line-height: 1;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  box-sizing: border-box;

  .list-wrap {
    display: flex;
    flex-direction: column;
    flex-grow: 2;
    overflow-y: scroll;

    .item {
      background: #fff;
      margin-bottom: 16rpx;
      padding: 32rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .overdue-infos {
        flex-grow: 2;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .info-left {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 254rpx;
          margin-right: 62rpx;
        }
        .info-right {
          display: flex;
          .labels {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            view {
              flex-wrap: nowrap;
            }
          }

          .values {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
          }
        }
      }
      .checkbox {
        display: flex;
        align-items: center;
        flex-shrink: 0;
      }
      .red-color {
        color: #fa5151;
      }
      .green-color {
        color: #52c41a;
      }
      .info-left > view:nth-child(2),
      .labels > view:nth-child(2),
      .values > view:nth-child(2) {
        padding-bottom: 18rpx;
        padding-top: 18rpx;
      }
    }
  }

  .bottom-wrap {
    display: flex;
    padding: 16rpx 32rpx;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    span {
      font-weight: 500;
    }
  }
}
</style>
