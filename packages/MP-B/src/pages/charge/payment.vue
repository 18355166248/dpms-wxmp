<template>
  <view class="chargeContentPayment">
    <view class="filterlistPayment">
      <view class="uni-list-cell">
        <picker
          @change="billingTypeChange"
          :value="billSupperTypeTypeIndex"
          :range="billSupperTypeArray"
          range-key="zh_CN"
        >
          <view class="uni-input"
            >{{ billTypePickerText }} <view class="iconfont icon-close"></view
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
            >{{ doctoPickerText }} <view class="iconfont icon-close"></view
          ></view>
        </picker>
      </view>
      <view class="uni-list-cell">
        <picker @change="datePickerChange" :value="dateIndex" :range="dateList">
          <view class="uni-input"
            >{{ dateList[dateIndex] }} <view class="iconfont icon-close"></view
          ></view>
        </picker>
      </view>
    </view>
    <view class="listPayment">
      <view class="listTitle">
        <view class="datetime"
          ><view class="iconfont icon-time-circle"></view> 2020-10-12
          12:30</view
        >
        <view class="pending">收费</view>
      </view>
      <view class="lineHr"></view>
      <view class="listContent">
        <view class="listLine">
          <view class="ml-32">普通收费</view>
          <view class="totalFee"></view>
        </view>
        <view class="listLine">
          <view class="ml-32">北极熊南京分店</view>
          <view class="chargeFee"
            >实收：
            <view class="feeRed">$950.00</view>
          </view>
        </view>
        <view class="listLine">
          <view class="ml-32 remark"
            >备注：备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注</view
          >
        </view>
        <view class="listLine">
          <view class="ml-32 date"></view>
          <view class="user">季冰宇</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import moment from 'moment'
import billAPI from '@/APIS/bill/bill.api'

export default {
  data() {
    return {
      data: {},
      billSupperTypeArray: this.initEnumArray(
        this.$utils.getEnums('PayTradeType'),
      ),
      billSupperTypeTypeIndex: 0,
      doctorList: uni.getStorageSync('allStaffList'),
      doctorIndex: 0,
      dateIndex: 0,
      dateList: ['全部', '今天', '近一周', '近一月'],
    }
  },
  computed: {
    billTypePickerText() {
      return this.billSupperTypeArray[this.billSupperTypeTypeIndex].zh_CN
    },
    doctoPickerText() {
      return this.doctorList[this.doctorIndex].staffName
    },
  },
  mounted() {
    // console.log(this.billSettlementArray)
  },
  methods: {
    billingTypeChange: function (e) {
      this.billSupperTypeTypeIndex = e.detail.value
    },
    doctorChange: function (e) {
      this.doctorIndex = e.detail.value
    },
    datePickerChange: function (e) {
      this.dateIndex = e.detail.value
    },
    initEnumArray: function (obj) {
      if (!obj?.properties) return [{ value: -1, zh_CN: '全部' }]
      let array = Object.values(obj.properties)
      array.unshift({ value: -1, zh_CN: '全部' })
      return array
    },
  },
}
</script>

<style lang="scss" scoped>
.filterlistPayment {
  display: flex;
  background-color: #fff;
  margin-bottom: 16rpx;
  margin-top: 2rpx;
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
  height: 2rpx;
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
  height: 380rpx;
  .listTitle {
    height: 84rpx;
    display: flex;
    align-items: center;
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
    width: 116rpx;
    height: 40rpx;
    background: #fff7e6;
    border: 2rpx solid #fa8c16;
    border-radius: 6rpx;
    text-align: center;
    color: #fa8c16;
    line-height: 40rpx;
    font-size: 28rpx;
    margin-left: 202rpx;
  }
  .listContent {
    height: 204rpx;
  }
  .listLine {
    margin-top: 18rpx;
    display: flex;
    font-size: 28rpx;
  }
  .totalFee {
    margin-left: 86px;
    float: right;
    width: 400rpx;
    text-align: right;
    font-size: 28rpx;
  }
  .chargeFee {
    margin-left: 90rpx;
    width: 400rpx;
    font-size: 28rpx;
    display: flex;
    justify-content: flex-end;
  }
  .arrFee {
    margin-left: 200rpx;
    width: 400rpx;
    font-size: 28rpx;
    display: flex;
    justify-content: flex-end;
  }
  .feeRed {
    color: #fa5151;
  }
  .feeGreen {
    color: #52c41a;
  }
  .remark {
    height: 72rpx;
    width: 690rpx;
    overflow: hidden;
    color: #595959;
  }
  .user {
    color: #595959;
    text-align: right;
    width: 200rpx;
    margin-left: 40rpx;
  }
  .date {
    color: #7f7f7f;
    width: 440rpx;
  }
}
</style>
