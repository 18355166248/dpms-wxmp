<template>
  <view class="page-wrap">
    <!-- 列表-->
    <view class="list-wrap">
      <view class="chargeContentDetail">
        <view class="paymentTitle">账单号：{{ data.billSerialNo }}</view>
        <view
          class="listChargeDetail"
          v-for="item in data.orderItemVOList"
          :key="item.billOrderItemId"
        >
          <view class="listTitle">{{ item.itemName }}</view>
          <view class="listLine grey">
            <view
              >{{ $utils.formatPrice(item.unitAmount) }}&nbsp;&nbsp;&nbsp;×
              {{ item.itemNum }}（{{ item.unit || '-' }}）
            </view>
            <view>{{ $utils.formatPrice(item.totalAmount) }}</view>
          </view>
          <view class="listLine">
            <view>应收金额：</view>
            <view> {{ $utils.formatPrice(item.receivableAmount) }}</view>
          </view>
          <view class="listLineBottom">
            <view>医生：{{ item.doctorNameStr }}</view>
            <view>护士：{{ item.nurseNameStr }}</view>
            <view>其他：{{ item.otherNameStr }}</view>
          </view>
          <!--牙位图组件-->
          <div class="teeth-select" v-if="data.billType === 6">
            <!--牙位 -->
            <div class="flex">
              <div class="label">牙位：</div>
              <TeethSelect class="teeth" :value="getTeethVal(item)" />
            </div>
            <!--处置说明 -->
            <div class="flex">
              <span class="label2">处置说明：</span>
              <div class="memo">
                <textarea
                  v-model="item.toothPositionDesc || '-'"
                  auto-height
                  placeholder-style="font-size: 34rpx; font-weight: 400; color: rgba(0, 0, 0, 0.25);"
                  :maxlength="500"
                  disabled
                />
              </div>
            </div>
          </div>
          <view class="lineHr"></view>
        </view>
        <view class="listChargeTotal">
          <view class="line">
            <view>总计金额</view>
            <view>{{ $utils.formatPrice(data.totalAmount) }}</view>
          </view>
          <view class="line">
            <view>整单折扣</view>
            <view>{{ data.mainOrderDiscount }}%</view>
          </view>
          <view class="lineTotal">
            <view style="display: flex;"
              >应收金额：
              <view style="color: red; font-size: 36rpx; line-height: 36rpx;"
                >{{ $utils.formatPrice(data.receivableAmount) }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="btn-wrap" v-if="canOperation && isOverdue">
      <view class="btns">
        <chargeButton
          type="solid"
          @click="overdueCharge"
          :buttonStyle="{ width: '686rpx' }"
          v-if="btnPremisstion('arrears_of_fees')"
        >
          收欠费
        </chargeButton>
      </view>
    </view>
    <!-- 底部收费项-->
  </view>
</template>

<script>
import billAPI from '@/APIS/bill/bill.api'
import chargeButton from './common/chargeButton'
import { mapState } from 'vuex'
import TeethSelect from '@/businessComponents/TeethSelect/TeethSelect.vue'

export default {
  data() {
    return {
      billSerialNo: '',
      createYouSelf: 'false',
      data: {},
    }
  },
  components: {
    chargeButton,
    TeethSelect,
  },
  onLoad(params) {
    this.billSerialNo = params.billSerialNo
    this.createYouSelf = params.createYouSelf || 'false'
    this.init()
  },
  computed: {
    ...mapState('workbenchStore', ['medicalInstitution']),
    isOverdue() {
      return (
        this.btnPremisstion('paid_arrears') &&
        this.data.receivableAmount > this.data.paymentAmount
      )
    },
    canOperation() {
      const { institutionChainType, topParentId } = this.medicalInstitution
      // 1，单店，2，直营(如果topParentId===0则为总部，总部也是直营)，3，大区，4，加盟
      // 注意：web端与小程序的判断不一样！！！
      if (
        institutionChainType === 3 ||
        (institutionChainType === 2 && topParentId === 0)
      ) {
        return false
      }
      return true
    },
  },
  methods: {
    getTeethVal(item) {
      if (item.toothPositionStr) {
        try {
          return JSON.parse(item.toothPositionStr)
        } catch (err) {
          return { teeth: {} }
        }
      }
      return { teeth: {} }
    },
    init() {
      billAPI
        .orderDetail({
          billSerialNo: this.billSerialNo,
        })
        .then((res) => {
          this.data = res.data
        })
    },
    //收欠费
    overdueCharge() {
      // uni.redirectTo({
      //   url: `/pages/charge/overdueCharge?billOrderId=${this.data.billOrderId}`,
      // })
      if (this.createYouSelf === 'true') {
        uni.redirectTo({
          url: `/pages/charge/overdueCharge?billOrderId=${this.data.billOrderId}`,
        })
      } else {
        uni.showToast({
          title: '收欠费需到对应机构操作!',
          icon: 'none',
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.page-wrap {
  display: flex;
  flex-grow: 2;
  flex-direction: column;
  justify-content: space-between;
  background: rgba(0, 0, 0, 0.04);
  height: 100%;
  box-sizing: border-box;
  .list-wrap {
    display: flex;
    flex-grow: 100;
    height: 0;
  }

  .chargeContentDetail {
    height: 100%;
    width: 100%;
    overflow-y: scroll;

    .listChargeDetail {
      background-color: #ffffff;

      .listTitle {
        font-size: 34rpx;
        color: #191919;
        margin-left: 32rpx;
        padding-top: 30rpx;
        font-weight: 500;
      }

      .listLine {
        margin-top: 18rpx;
        display: flex;
        font-size: 28rpx;
        justify-content: space-between;
        margin-left: 32rpx;
        width: 686rpx;
      }

      .listLineBottom {
        justify-content: space-between;
        display: flex;
        font-size: 28rpx;
        width: 686rpx;
        color: #7f7f7f;
        margin: 18rpx 32rpx 32rpx;
        view {
          width: 33.33%;
          overflow-x: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: block;
        }
      }

      .grey {
        color: #4c4c4c;
      }
    }

    .listChargeTotal {
      margin-top: 16rpx;
      margin-bottom: 16rpx;
      background-color: #ffffff;

      .line {
        margin-left: 32rpx;
        justify-content: space-between;
        display: flex;
        width: 686rpx;
        font-size: 28rpx;
        line-height: 36rpx;
        padding-top: 20rpx;
      }

      .lineTotal {
        margin-left: 32rpx;
        justify-content: flex-end;
        display: flex;
        width: 686rpx;
        font-size: 28rpx;
        line-height: 36rpx;
        padding-top: 30rpx;
        padding-bottom: 30rpx;
      }
    }
  }

  .btn-wrap {
    display: flex;
    justify-content: center;
    background: #fff;
    padding: 16rpx 32rpx;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
  }
}

.lineHr {
  width: 686rpx;
  height: 2rpx;
  margin-left: 32rpx;
  background: rgba(0, 0, 0, 0.1);
}

.ml-32 {
  margin-left: 32rpx;
}

.paymentTitle {
  height: 84rpx;
  margin-left: 32rpx;
  color: #595959;
  line-height: 90rpx;
  font-size: 28rpx;
}

.teeth-select {
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 32rpx;
  box-sizing: border-box;
  border-top: 1rpx solid #e5e5e5;
  .flex {
    display: flex;
    width: 100%;
    color: #4c4c4c;
    .label {
      width: 116rpx;
      flex-shrink: 0;
      color: #191919;
    }
    .teeth {
      width: 100%;
    }
    .label2 {
      width: 182rpx;
      flex-shrink: 0;
      color: #191919;
    }
    .memo {
      width: 100%;
      background-color: #fff;
      color: #191919;
      font-size: 30rpx;
      box-sizing: border-box;
      textarea {
        width: 100%;
      }
    }
  }
  .flex:last-child {
    padding-top: 16rpx;
  }
}
</style>
