<template>
  <view class="apply">
    <view class="apply-head">
      <view class="apply-head-unit">
        <view class="label">领用单位</view>
        <view>
          <text>请选择</text>
          <text class="value">员工</text>
        </view>
        <view>
          <text class="iconfont icon-arrow-right"></text>
        </view>
      </view>
      <view class="apply-head-person">
        <view class="label">领用员工</view>
        <view>
          <text>请选择</text>
          <text class="value">员工</text>
        </view>
        <view>
          <text class="iconfont icon-arrow-right"></text>
        </view>
      </view>
      <view class="apply-head-desc">
        <view class="label">领用说明</view>
        <view class="value">电动机案件达的骄傲的骄傲晋控电力</view>
      </view>
    </view>
    <view class="apply-add">
      <view>
        <text class="iconfont icon-codesandbox"></text>
        <text>领用物品</text>
      </view>
      <view><text class="iconfont icon-plus-circle"></text></view>
    </view>
    <view class="apply-goods">
      <scroll-view scroll-y="true" style="height: 100%;">
        <view class="apply-goods-item">
          <applyGood
            v-for="(item, index) in goodsList"
            :key="index"
            :info="item"
            @on-clear="handleDelete(item)"
          >
            <view class="apply-goods-item-number">
              <view>领用数量：</view>
              <view>
                <inputNumber
                  :min="1"
                  v-model="item.applyNum"
                  @on-change="changeApplyNumber(item)"
                />
              </view>
            </view>
          </applyGood>
        </view>
      </scroll-view>
    </view>
    <view class="apply-action">
      <view class="apply-action-info">
        <view>已选择2件物品</view>
        <view>合计4件</view>
      </view>
      <view class="apply-action-btn">
        <view>保存</view>
        <view>提交申请</view>
      </view>
    </view>
  </view>
</template>
<script>
import { mapMutations, mapState } from 'vuex'
import checkBox from '@/components/checkbox/checkbox.vue'
import applyGood from './components/apply-good.vue'
import inputNumber from '@/components/input-number/input-number.vue'
export default {
  components: { checkBox, applyGood, inputNumber },
  computed: {
    ...mapState('warehouse', ['applyGoods']),
  },
  data() {
    return {
      isShow: false,
      goodsList: [],
    }
  },
  watch: {
    applyGoods(val) {
      this.goodsList = val
    },
  },
  created() {
    this.goodsList = this.applyGoods
  },
  methods: {
    ...mapMutations('warehouse', ['updateGood', 'selectGood', 'deleteGood']),
    changeApplyNumber(item) {
      console.log('领用数量变化后', item)
      this.updateGood(item)
    },
    // 删除已选项
    handleDelete(item) {
      this.deleteGood(item)
    },
  },
}
</script>
<style lang="scss" scoped>
.apply {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  > view {
    box-sizing: inherit;
  }
  &-head {
    padding-left: 32rpx;
    background-color: #ffffff;
    font-size: 30rpx;
    &-unit,
    &-person {
      height: 104rpx;
      padding-right: 32rpx;
      display: flex;
      align-items: center;
      border-bottom: 1rpx solid rgba(0, 0, 0, 0.15);
      view:nth-child(2) {
        flex: 1;
        text-align: right;
        padding-right: 17rpx;
      }
    }
    &-desc {
      height: 104rpx;
      padding-right: 32rpx;
      display: flex;
      justify-content: space-between;
      > view {
        height: 104rpx;
        line-height: 104rpx;
      }
      view:last-child {
        flex: 1;
        text-align: right;
      }
    }
  }
  &-add {
    width: 100%;
    height: 64rpx;
    padding: 0 32rpx;
    background-color: #eef8f3;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: $common-color;
    font-size: 30rpx;
    .icon-codesandbox {
      font-size: 28rpxrpx;
      margin-right: 14rpx;
    }
    .icon-plus-circle {
      font-size: 35rpx;
    }
  }
  &-goods {
    flex: 1;
    background-color: #ffffff;
    overflow: hidden;
    &-item {
      padding-left: 32rpx;
      &-number {
        display: flex;
      }
    }
  }
  &-action {
    width: 100%;
    height: 176rpx;
    padding: 0 32rpx 68rpx 32rpx;
    background-color: #ffffff;
    border-top: 16rpx solid #f5f5f5;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-info {
      view:nth-child(1) {
        font-size: 28rpx;
        color: #191919;
      }
      view:nth-child(2) {
        font-size: 22rpx;
        color: #4c4c4c;
      }
    }
    &-btn {
      display: flex;
      font-size: 28rpx;
      view:nth-child(1) {
        width: 120rpx;
        height: 56rpx;
        margin-right: 16rpx;
        text-align: center;
        line-height: 56rpx;
        background: #ffffff;
        border: 2rpx solid #5cbb89;
        border-radius: 30rpx;
        color: #5cbb89;
      }
      view:nth-child(2) {
        width: 176rpx;
        height: 56rpx;
        text-align: center;
        line-height: 56rpx;
        background: #5cbb89;
        border-radius: 28rpx;
        color: #ffffff;
      }
    }
  }
  .label {
    color: #4c4c4c;
  }
  .value {
    color: #191919;
  }
}
</style>
