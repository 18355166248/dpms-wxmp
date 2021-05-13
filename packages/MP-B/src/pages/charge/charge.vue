<template>
  <view class="page-wrap">
    <view class="charge-wrap">
      <view class="list-wrap">
        <view class="item-wrap">
          <view class="item0">
            <itemType :iconData="icon0" />
            <view class="flex">
              <chargeItem
                class="charge-item dashed"
                :amountData="receivableData"
              />
              <chargeItem
                class="charge-item dashed"
                :amountData="receiptData"
              />
              <chargeItem class="charge-item" :amountData="arrearageData" />
            </view>
          </view>
        </view>
        <view class="item-wrap">
          <view class="item1">
            <view>
              <itemType :iconData="icon1" />
              <chargeItem
                class="charge-item dashed"
                :amountData="advancePaymentsData"
              />
            </view>
          </view>
          <view class="item2">
            <itemType :iconData="icon2" />
            <view class="flex">
              <chargeItem
                class="charge-item dashed"
                :amountData="capitalBalanceData"
              />
              <chargeItem class="charge-item" :amountData="giftBalanceData" />
            </view>
          </view>
        </view>
      </view>
      <view class="bottom-wrap" v-if="isOverdue || isCreateOrder">
        <view class="btns">
          <chargeButton
            type="solid"
            @click="createOrder"
            :buttonStyle="{ width: isOverdue ? '336rpx' : '686rpx' }"
            v-if="isCreateOrder"
            >新建账单</chargeButton
          >
          <chargeButton type="border" @click="overdueCharge" v-if="isOverdue"
            >收欠费</chargeButton
          >
        </view>
      </view>
    </view>

    <actionSheet @close="hideActionSheet" v-if="showActionSheet">
      <view
        class="action-item"
        v-for="(item, index) in list"
        :key="index"
        @click="selectType(item)"
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
import { mapMutations, mapState } from 'vuex'
import billAPI from '@/APIS/bill/bill.api'

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
        iconClass: `icon-stored-value-card`,
        typeName: '储值卡余额',
        color: '#fa5151',
      },
      amountData: {
        amount: 62586,
        des: '开单应收',
      },

      list: [
        {
          text: '简易收费',
          type: 1,
        },
      ],
      showActionSheet: false,
      receivableData: {
        name: '开单应收',
        amount: 0,
      },
      receiptData: {
        name: '消费总额',
        amount: 0,
      },
      arrearageData: {
        name: '总欠费',
        amount: 0,
      },
      advancePaymentsData: {
        name: '预收款',
        amount: 0,
      },
      capitalBalanceData: {
        name: '本金余额',
        amount: 0,
      },
      giftBalanceData: {
        name: '赠金余额',
        amount: 0,
      },
      //是否获取到接口数据
      isGetResult: false,
    }
  },
  computed: {
    ...mapState('searchProjectStore', ['searchProjectList']),
    ...mapState('patient', ['patientDetail']),
    isOverdue() {
      return (
        this.btnPremisstion('arrears_of_fees') &&
        this.arrearageData.amount > 0 &&
        this.isGetResult
      )
    },
    isCreateOrder() {
      return this.btnPremisstion('patient_new_bill') && this.isGetResult
    },
  },
  created() {
    this.initData()
  },
  methods: {
    ...mapMutations('checkstand', ['setChargeType']),
    initData() {
      //获取消费预览和诊疗项目数据
      // Promise.all()
      let promise1 = billAPI
        .getStatistical({
          patientId: this.patientDetail.patientId,
        })
        .then((res) => {
          if (res.data) {
            this.receivableData.amount = res.data.receivableAmount
            this.receiptData.amount = res.data.receiptAmount
            this.arrearageData.amount = res.data.arrearageAmount
            this.advancePaymentsData.amount = res.data.advancePaymentsAmount
          }
        })
      //获取储值卡余额数据
      let promise2 = billAPI
        .getSoredCardDetail({
          memberId: this.patientDetail.memberId,
          customerId: this.patientDetail.customerId,
          patientId: this.patientDetail.patientId,
        })
        .then((res) => {
          if (res.data) {
            this.capitalBalanceData.amount = res.data.capitalBalance
            this.giftBalanceData.amount = res.data.giftBalance
          }
        })

      Promise.all([promise1, promise2])
        .then(() => {
          this.isGetResult = true
        })
        .catch((err) => {
          this.isGetResult = true
        })
    },
    //新建订单
    createOrder() {
      this.showActionSheet = true
    },
    hideActionSheet() {
      this.showActionSheet = false
    },
    //选择收费方式
    selectType(item) {
      this.setChargeType(item.type)
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
  .charge-wrap {
    display: flex;
    flex-grow: 2;
    flex-direction: column;
    justify-content: space-between;
  }
  .list-wrap {
    display: flex;
    flex-direction: column;
    padding: 24rpx 24rpx 0;
  }
}

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
      border: 2rpx dashed rgba(0, 0, 0, 0.15);
      transform-origin: 50% 0;
      transform: scale(0.5,1);
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
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  background: #fff;
  .btns {
    padding: 16rpx 32rpx;
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
