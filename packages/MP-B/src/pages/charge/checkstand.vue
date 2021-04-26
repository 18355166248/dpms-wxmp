<template>
  <view class="checkstand-wrap">
    <div class="content-wrapper">
      <chargestand-title>
        <div slot="content" class="flex">
          <div class="iconfont icon-savings" style="font-size: 36rpx;margin-right: 11rpx"></div>
          <div class="ellipsis" style="width: 550rpx">支付方式（应收金额{{ 4022 }}）</div>
        </div>
        <div slot="extra">
          <span class="iconfont icon-right" style="font-size: 36rpx"></span>
        </div>
      </chargestand-title>
      <dpmsCellInput
        type="number"
        title="支付宝"
        :value="testValue1"
      />
      <dpmsCellInput
        hideBorderBottom
        type="number"
        title="储值卡"
        :value="testValue2"
      />
      <div v-if=""></div>
      <chargestand-title>
        <div slot="content" class="flex">
          <div class="iconfont icon-customer-management" style="font-size: 36rpx;margin-right: 11rpx"></div>
          <div class="ellipsis" style="width: 550rpx">开单时间</div>
        </div>
        <div slot="extra">
          <div style="padding-left: 36rpx" @click="toggleInfomation = !toggleInfomation">
            <template v-if="toggleInfomation">
              <span class="iconfont icon-closed" style="font-size: 22rpx" />
            </template>
            <template v-else>
              <span class="iconfont icon-open" style="font-size: 22rpx" />
            </template>
          </div>
        </div>
      </chargestand-title>
      <dpmsCell
        title="测试"
        value="啦啦啦"
      />
    </div>
    <div class="footer-wrapper flexBt">
      <div>
        <div>
          <span>实收:</span><span>200,950.00</span>
        </div>
        <div>
          <span>欠费:</span><span>20.00</span>
          <span>找零:</span><span>0.00</span>
        </div>
      </div>
      <div class="btn-wrapper flexBt">
        <button class="save-btn">保存</button>
        <button class="charge-btn">收费</button>
      </div>
    </div>
  </view>
</template>
<script>
import ChargestandTitle from '@/pages/charge/components/checkstandstandTitle';

export default {
  name: 'checkstand',
  data() {
    return {
      form: {
        payChannelList: [],
      },
      testValue1: 4000,
      testValue2: 400,
      toggleInfomation: false,
    };
  },
  components: {
    ChargestandTitle,
  },
  computed: {},
  onLoad() {},
  onShow() {},
  onHide() {},
  onUnload() {},
  methods: {},
  watch: {
    watchData: {
      handler(newVal, oldVal) {},
      deep: true,
      immediate: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.checkstand-wrap {
  width: 750rpx;
  height: 100vh;
  display: flex;
  flex-direction: column;

  .content-wrapper {
    flex: 1;
    width: 100%;
    background: #f5f5f5;
    overflow-y: scroll;
  }

  .footer-wrapper {
    flex: 0 0 92rpx;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    background: #fff;
    padding: 0 32rpx;

    .btn-wrapper {
      box-sizing: border-box;
      button {
        width: 120rpx;
        height: 56rpx;
        line-height: 56rpx;
        font-size: 28rpx;
        border-radius: 30rpx;
        box-sizing: border-box;
      }

      .save-btn {
        color: #5CBB89;
        border: 2rpx solid #5cbb89;
        margin-right: 16rpx;
      }

      .charge-btn {
        color: #fff;
        background: #5CBB89;
      }
    }

  }
}
</style>
