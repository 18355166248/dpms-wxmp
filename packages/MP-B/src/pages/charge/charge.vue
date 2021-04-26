<template>
  <view class="page-wrap">
    <view class="charge-wrap">
      <view class="flex flex-column">
        <view class="item-wrap">
          <view class="item0">
            <itemType :iconData="icon0" />
            <view class="flex">
              <chargeItem class="charge-item dashed" :amountData="amountData" />
              <chargeItem class="charge-item dashed" :amountData="amountData" />
              <chargeItem class="charge-item" :amountData="amountData" />
            </view>
          </view>
        </view>
        <view class="item-wrap">
          <view class="item1">
            <view>
              <itemType :iconData="icon1" />
              <chargeItem class="charge-item dashed" :amountData="amountData" />
            </view>
          </view>
          <view class="item2">
            <itemType :iconData="icon2" />
            <view class="flex">
              <chargeItem class="charge-item dashed" :amountData="amountData" />
              <chargeItem class="charge-item" :amountData="amountData" />
            </view>
          </view>
        </view>
      </view>
      <view class="bottom-wrap">
        <chargeButton type="solid" @click="createOrder">新建账单</chargeButton>
        <chargeButton type="border" @click="overdueCharge">收欠费</chargeButton>
      </view>
    </view>
    <actionSheet @close="hideActionSheet" v-if="showActionSheet">
      <view
        class="action-item"
        v-for="(item, index) in list"
        :key="index"
        @click="selectType"
      >
        {{ item.text }}
      </view>
    </actionSheet>
  </view>

  <!--  <view >-->
  <!--    <empty :disabled="true" text="暂无数据"></empty>-->
  <!--  </view>-->
</template>
<script>
import itemType from './common/itemType'
import chargeItem from './common/chargeItem'
import bottomWrap from './common/bottomWrap'
import chargeButton from './common/chargeButton'
import actionSheet from './common/actionSheet'

export default {
  name: 'charge',
  data() {
    return {
      icon0: {
        iconClass: 'iconconsumption-profile',
        typeName: '消费预览',
        color: '#faad14',
      },
      icon1: {
        iconClass: `icondiagnosis-treatment`,
        typeName: '诊疗项目',
        color: '#75a8f0',
      },
      icon2: {
        iconClass: `iconconsumption-profile`,
        typeName: '储值卡余额',
        color: '#fa5151',
      },
      amountData: {
        amount: 62586,
        des: '开单应收',
      },
      showChargeSheet: false,
      list: [
        {
          text: '简易收费',
        },
      ],
      showActionSheet: false,
    }
  },
  computed: {},
  onLoad() {},
  onShow() {},
  onHide() {},
  onUnload() {},
  methods: {
    //新建订单
    createOrder() {
      this.showActionSheet = true
    },
    hideActionSheet() {
      this.showActionSheet = false
    },
    //选择收费方式
    selectType() {
      this.toSelectChargeProjects()
    },
    //选择收费项目
    toSelectChargeProjects() {
      uni.navigateTo({
        url: '/pages/charge/selectChargeProjects',
      })
    },
    //收欠费
    overdueCharge() {
      uni.navigateTo({
        url: '/pages/charge/overdueCharge',
      })
    },
  },
  watch: {
    watchData: {
      handler(newVal, oldVal) {},
      deep: true,
      immediate: true,
    },
  },
  components: { chargeItem, itemType, bottomWrap, chargeButton, actionSheet },
}
</script>
<style lang="scss" scoped>
.page-wrap {
  display: flex;
  flex-grow: 2;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
.charge-wrap {
  padding: 24rpx;
  flex-grow: 2;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .item-wrap {
    display: flex;
    padding: 32rpx 0;
    background: #feffff;
    border-radius: 8rpx;
    box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(0, 0, 0, 0.06);
    margin-bottom: 24rpx;

    .dashed {
      &::after {
        position: absolute;
        content: '';
        right: 0;
        top: 0;
        height: 100%;
        width: 0;
        border: 1rpx dashed rgba(0, 0, 0, 0.15);
      }
    }

    .item0 {
      width: 100%;

      .charge-item {
        width: 33.33%;
        position: relative;
      }
    }

    .item1 {
      width: 33.33%;
      position: relative;
      display: flex;

      .charge-item {
        width: 100%;
        position: relative;
      }

      &::after {
        position: absolute;
        content: '';
        right: 0;
        top: 0;
        height: 100%;
        width: 0;
        border: 1rpx solid rgba(0, 0, 0, 0.15);
      }
    }

    .item2 {
      width: 66.66%;

      .charge-item {
        width: 50%;
        position: relative;
      }
    }
  }

  .bottom-wrap {
    padding: 16rpx 8rpx;
    display: flex;
    justify-content: space-between;
  }
}
.action-item {
  height: 112rpx;
  width: 100%;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1rpx solid #f2f2f2;
}
.action-item:first-child {
  border-top: none;
  border-radius: 24rpx 24rpx 0 0;
}
</style>
