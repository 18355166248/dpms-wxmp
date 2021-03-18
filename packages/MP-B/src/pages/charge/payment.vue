<template>
  <view class="chargeContentPayment">
    <view class="filterlistPayment">
      <view class="uni-list-cell">
        <picker
          @change="onPayTradeTypeChange"
          :value="payTradeTypeIndex"
          :range="payTradeTypeArray"
          range-key="zh_CN"
        >
          <view class="uni-input"
            >{{ billTypePickerText }} <view class="iconfont icon-closed"></view
          ></view>
        </picker>
      </view>
      <view class="uni-list-cell">
        <picker
          @change="doctorChange"
          :value="doctorIndex"
          :range="doctorList"
          range-key="staffName"
        >
          <view class="uni-input"
            >{{ doctoPickerText }} <view class="iconfont icon-closed"></view
          ></view>
        </picker>
      </view>
      <view class="uni-list-cell">
        <picker @change="datePickerChange" :value="dateIndex" :range="dateList">
          <view class="uni-input"
            >{{ dateList[dateIndex] }} <view class="iconfont icon-closed"></view
          ></view>
        </picker>
      </view>
    </view>
    <view v-if="paymentList.length > 0">
      <view
        class="listPayment"
        v-for="order in paymentList"
        :key="order.businessNo"
      >
        <view class="listTitle">
          <view class="datetime"
            ><view class="iconfont icon-time-circle"></view>
            {{ order.payTradeDate }}</view
          >
          <view class="pending">{{ order.payTradeTypeText }}</view>
        </view>
        <view class="lineHr"></view>
        <view class="listContent">
          <view class="listLine">
            <view class="ml-32">{{ order.businessTypeName }}</view>
          </view>
          <view class="listLine">
            <view class="ml-32">{{ order.medicalInstitutionName }}</view>
            <view class="chargeFee"
              >实收：
              <view class="feeRed">{{
                $utils.formatPrice(order.receiveAmount)
              }}</view>
            </view>
          </view>
          <view class="listLine">
            <view class="ml-32 remark">备注：{{ order.memo || '-' }}</view>
          </view>
          <view class="listLine" style="padding-bottom: 32rpx;">
            <view class="ml-32 date"></view>
            <view class="user">{{ order.cashierStaffName }}</view>
          </view>
        </view>
      </view>
      <load-more :status="dataSourceStatus.status" />
    </view>
    <view v-else>
      <empty :disabled="true" text="暂无数据"></empty>
    </view>
  </view>
</template>

<script>
import moment from 'moment'
import billAPI from '@/APIS/bill/bill.api'

export default {
  props: ['patientId'],
  data() {
    return {
      payTradeTypeArray: this.initEnumArray(
        this.$utils.getEnums('PayTradeType'),
        'PayTradeType',
      ),
      payTradeTypeIndex: 0,
      doctorList: uni.getStorageSync('allStaffList'),
      doctorIndex: 0,
      dateIndex: 0,
      dateList: ['全部', '今天', '近一周', '近一月'],
      paymentList: [],
      current: 1,
      total: 1,
      size: 5,
      dataSourceStatus: {
        // 数据列表的状态
        loading: true,
        status: 'loading',
        request: 'loading',
      },
      params: {},
    }
  },
  computed: {
    billTypePickerText() {
      return this.payTradeTypeArray[this.payTradeTypeIndex].zh_CN
    },
    doctoPickerText() {
      return this.doctorList[this.doctorIndex].staffName.length > 6
        ? this.doctorList[this.doctorIndex].staffName.substring(0, 6) + '...'
        : this.doctorList[this.doctorIndex].staffName
    },
  },
  destroyed() {
    uni.$off('refreshPayment')
  },
  mounted() {
    this.init()
    uni.$on('refreshPayment', () => {
      if (this.paymentList.length < this.total) {
        this.current += 1
        this.getPaymentOrder()
      }
    })
  },
  methods: {
    init() {
      this.getPaymentOrder()
    },
    async getPaymentOrder(params = {}) {
      uni.showLoading({
        title: '数据加载中',
        mask: true,
      })

      const {
        data: { total, current, records },
      } = await billAPI.paymentOrderList({
        payerId: this.patientId,
        current: this.current,
        size: this.size,
        ...params,
      })

      uni.hideLoading()

      records &&
        records.forEach((element) => {
          element.payTradeDate = moment(element.payTradeTime).format(
            'YYYY-MM-DD HH:mm:ss',
          )
          element.cashierTimeDate = moment(element.cashierDate).format(
            'YYYY-MM-DD HH:mm:ss',
          )
          const findObj = this.payTradeTypeArray.find((v) => {
            return v.value === element.payTradeType
          })
          element.payTradeTypeText = findObj?.zh_CN
        })

      if (current === 1) {
        this.paymentList = records
      } else {
        this.paymentList = this.paymentList.concat(records)
      }
      this.total = total

      if (total === this.paymentList.length) {
        this.dataSourceStatus.status = 'noMore'
      } else {
        this.dataSourceStatus.status = 'more'
      }
    },
    onPayTradeTypeChange: function (e) {
      this.payTradeTypeIndex = e.detail.value
      if (Number(this.payTradeTypeIndex) === 0) {
        delete this.params.payTradeType
      } else {
        this.params.payTradeType = this.payTradeTypeArray[
          this.payTradeTypeIndex
        ].value
      }
      this.current = 1

      this.getPaymentOrder(this.params)
    },
    doctorChange: function (e) {
      this.doctorIndex = e.detail.value
      if (Number(this.doctorIndex) === 0) {
        delete this.params.cashierStaffId
      } else {
        this.params.cashierStaffId = this.doctorList[this.doctorIndex].staffId
      }
      this.current = 1
      this.getPaymentOrder(this.params)
    },
    datePickerChange: function (e) {
      this.dateIndex = e.detail.value
      if (Number(this.dateIndex) === 0) {
        delete this.params.payTimeStartStamp
        delete this.params.payTimeEndStamp
      }
      if (Number(this.dateIndex) === 1) {
        this.params.payTimeStartStamp = moment().startOf('day').format('x')
        this.params.payTimeEndStamp = moment().endOf('day').format('x')
      }
      if (Number(this.dateIndex) === 2) {
        this.params.payTimeStartStamp = moment().startOf('week').format('x')
        this.params.payTimeEndStamp = moment().endOf('week').format('x')
      }
      if (Number(this.dateIndex) === 3) {
        this.params.payTimeStartStamp = moment().startOf('month').format('x')
        this.params.payTimeEndStamp = moment().endOf('month').format('x')
      }
      this.getPaymentOrder(this.params)
    },
    initEnumArray: function (obj, type) {
      if (type === 'PayTradeType') {
        type = '全部交易类型'
      }
      if (!obj?.properties) return [{ value: -1, zh_CN: type }]
      let array = Object.values(obj.properties)
      array.unshift({ value: -1, zh_CN: type })
      return array
    },
  },
}
</script>

<style lang="scss" scoped>
.chargeContentPayment {
  .filterlistPayment {
    display: flex;
    background-color: #fff;
    margin-bottom: 16rpx;
    margin-top: 1rpx;
    height: 80rpx;
    font-size: 28rpx;
    color: #595959;
    .uni-list-cell {
      width: 250rpx;
    }
    .iconfont {
      font-size: 24rpx;
      margin-left: 8rpx;
    }
    .uni-list-cell {
      line-height: 80rpx;
    }
    .uni-input {
      display: flex;
      justify-content: center;
    }
  }
  .lineHr {
    width: 686rpx;
    height: 1rpx;
    margin-left: 32rpx;
    background: rgba(0, 0, 0, 0.15);
  }
  .ml-32 {
    margin-left: 32rpx;
  }
  .listPayment {
    background-color: #fff;
    margin-bottom: 20rpx;
    margin-top: 18rpx;
    .listTitle {
      height: 84rpx;
      margin-bottom: 1rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .datetime {
      display: flex;
      width: 400rpx;
      align-items: center;
      font-size: 28rpx;
      color: #595959;
    }
    .icon-time-circle {
      margin-left: 28rpx;
      margin-right: 14rpx;
    }
    .pending {
      height: 40rpx;
      background: #fff7e6;
      border: 2rpx solid #fa8c16;
      border-radius: 6rpx;
      text-align: center;
      color: #fa8c16;
      line-height: 40rpx;
      font-size: 28rpx;
      margin-right: 32rpx;
      padding-left: 10rpx;
      padding-right: 10rpx;
    }
    .listLine {
      margin-top: 18rpx;
      display: flex;
      font-size: 28rpx;
      justify-content: space-between;
    }
    .chargeFee {
      font-size: 28rpx;
      display: flex;
      justify-content: flex-end;
      margin-right: 32rpx;
    }
    .feeRed {
      color: #fa5151;
    }
    .feeGreen {
      color: #52c41a;
    }
    .remark {
      width: 690rpx;
      overflow: hidden;
      color: #595959;
    }
    .user {
      color: #595959;
      text-align: right;
      width: 200rpx;
      margin-right: 40rpx;
    }
    .date {
      color: #7f7f7f;
      width: 440rpx;
    }
  }
}
</style>
