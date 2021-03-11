<template>
  <view class="chargeContent">
    <view class="filterlistCharged">
      <view class="uni-list-cell">
        <picker
          @change="billSettlementChange"
          :value="billSettlementIndex"
          :range="billSettlementArray"
          range-key="zh_CN"
        >
          <view class="uni-input"
            >{{ billSettlementPickerText }}
            <view class="iconfont icon-close"></view
          ></view>
        </picker>
      </view>
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
    <view v-if="chargedList.length > 0">
      <view
        class="listCharged"
        @click="toPage('/pages/charge/chargeDetail', {})"
        v-for="order in chargedList"
        :key="order.billOrderId"
      >
        <view class="listTitle">
          <view class="datetime"
            ><view class="iconfont icon-time-circle"></view>
            {{ order.consultTimeDate }}</view
          >
          <view class="pending" v-if="order.arrearageAmount > 0">欠费</view>
        </view>
        <view class="lineHr"></view>
        <view class="listContent">
          <view class="listLine">
            <view class="ml-32">{{ order.billSerialNo }}</view>
          </view>
          <view class="listLine">
            <view class="ml-32">{{ order.billTypeText }}</view>
            <view class="totalFee"
              >总计金额：{{ $utils.formatPrice(order.totalAmount) }}</view
            >
          </view>
          <view class="listLine">
            <view class="ml-32">{{ order.medicalInstitutionName }}</view>
            <view class="chargeFee"
              >应收金额：
              <view class="feeRed">{{
                $utils.formatPrice(order.receivableAmount)
              }}</view>
            </view>
          </view>
          <view class="listLine">
            <view class="ml-32">{{ order.doctorName }}</view>
            <view class="arrFee"
              >欠费：
              <view class="feeGreen">{{
                $utils.formatPrice(order.arrearageAmount)
              }}</view>
            </view>
          </view>
          <view class="listLine">
            <view class="ml-32 remark">备注：{{ order.memo || '-' }}</view>
          </view>
          <view class="listLine">
            <view class="ml-32 date">创建时间：{{ order.createTimeDate }}</view>
            <view class="user">{{ order.createStaffName }}</view>
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
import qs from 'qs'
import loadMore from '@/components/load-more/load-more.vue'

export default {
  props: ['patientId', 'customerId'],
  data() {
    return {
      billSettlementArray: this.initEnumArray(
        this.$utils.getEnums('BillSettlement'),
      ),
      billSettlementIndex: 0,
      billSupperTypeArray: this.initEnumArray(
        this.$utils.getEnums('BillSupperType'),
      ),
      billSupperTypeTypeIndex: 0,
      doctorList: uni.getStorageSync('allDoctorList'),
      doctorIndex: 0,
      dateIndex: 0,
      dateList: ['全部', '今天', '近一周', '近一月'],
      chargedList: [],
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
    billSettlementPickerText() {
      return this.billSettlementArray[this.billSettlementIndex].zh_CN
    },
    billTypePickerText() {
      return this.billSupperTypeArray[this.billSupperTypeTypeIndex].zh_CN
    },
    doctoPickerText() {
      return this.doctorList[this.doctorIndex].staffName
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    billSettlementChange: function (e) {
      this.billSettlementIndex = e.detail.value
      if (Number(this.billSettlementIndex) === 0) {
        delete this.params.billSettlementStatus
      } else {
        this.params.billSettlementStatus = this.billSettlementArray[
          this.billSettlementIndex
        ].value
      }
      this.getChargedOrder(this.params)
    },
    billingTypeChange: function (e) {
      this.billSupperTypeTypeIndex = e.detail.value
      if (Number(this.billSupperTypeTypeIndex) === 0) {
        delete this.params.billType
      } else {
        this.params.billType = this.billSupperTypeArray[
          this.billSupperTypeTypeIndex
        ].value
      }
      this.getChargedOrder(this.params)
    },
    doctorChange: function (e) {
      this.doctorIndex = e.detail.value
      if (Number(this.doctorIndex) === 0) {
        delete this.params.doctorId
      } else {
        this.params.doctorId = this.doctorList[this.doctorIndex].staffId
      }
      this.getChargedOrder(this.params)
    },
    datePickerChange: function (e) {
      this.dateIndex = e.detail.value
      if (Number(this.dateIndex) === 0) {
        delete this.params.updateTimeStart
        delete this.params.updateTimeEnd
      }
      if (Number(this.dateIndex) === 1) {
        this.params.updateTimeStart = moment().startOf('day').format('x')
        this.params.updateTimeEnd = moment().endOf('day').format('x')
      }
      if (Number(this.dateIndex) === 2) {
        this.params.updateTimeStart = moment().startOf('week').format('x')
        this.params.updateTimeEnd = moment().endOf('week').format('x')
      }
      if (Number(this.dateIndex) === 3) {
        this.params.updateTimeStart = moment().startOf('month').format('x')
        this.params.updateTimeEnd = moment().endOf('month').format('x')
      }
      this.getChargedOrder(this.params)
    },
    initEnumArray: function (obj) {
      if (!obj?.properties) return [{ value: -1, zh_CN: '全部' }]
      let array = Object.values(obj.properties)
      array.unshift({ value: -1, zh_CN: '全部' })
      return array
    },
    toPage(url, params) {
      this.$utils.push({
        url: `${url}?${qs.stringify(params, {
          arrayFormat: 'comma', // a: [1, 2] => a=1,2
        })}`,
      })
    },
    init() {
      this.current = 1
      this.getChargedOrder()
    },
    async getChargedOrder(params = {}) {
      uni.showLoading({
        title: '数据加载中',
        mask: true,
      })

      const {
        data: { total, current, records },
      } = await billAPI.chargedOrderList({
        patientId: this.patientId,
        customerId: this.customerId,
        current: this.current,
        size: this.size,
        ...params,
      })

      uni.hideLoading()

      records &&
        records.forEach((element) => {
          element.createTimeDate = moment(element.createTime).format(
            'YYYY-MM-DD HH:mm:ss',
          )
          element.consultTimeDate = moment(element.consultTime).format(
            'YYYY-MM-DD HH:mm:ss',
          )
          const findObj = this.billSupperTypeArray.find((v) => {
            return v.value === element.billType
          })
          element.billTypeText = findObj?.zh_CN
        })

      if (current === 1) {
        this.chargedList = records
      } else {
        this.chargedList = this.chargedList.concat(records)
      }
      this.total = total

      if (total === this.chargedList.length) {
        this.dataSourceStatus.status = 'noMore'
      } else {
        this.dataSourceStatus.status = 'more'
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.filterlistCharged {
  display: flex;
  background-color: #fff;
  margin-bottom: 16rpx;
  margin-top: 2rpx;
  height: 80rpx;
  font-size: 28rpx;
  color: #595959;
  .uni-list-cell {
    width: 186rpx;
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
.listCharged {
  background-color: #fff;
  margin-bottom: 20rpx;
  margin-top: 18rpx;
  height: 490rpx;
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
    text-align: center;
    color: #52c41a;
    line-height: 40rpx;
    font-size: 28rpx;
    margin-left: 232rpx;
  }
  .listContent {
    height: 204rpx;
  }
  .listLine {
    margin-top: 18rpx;
    display: flex;
    font-size: 28rpx;
    justify-content: space-between;
  }
  .totalFee {
    float: right;
    width: 400rpx;
    text-align: right;
    font-size: 28rpx;
    margin-right: 32rpx;
  }
  .chargeFee {
    width: 400rpx;
    font-size: 28rpx;
    display: flex;
    justify-content: flex-end;
    margin-right: 32rpx;
  }
  .arrFee {
    width: 400rpx;
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
    height: 72rpx;
    width: 690rpx;
    overflow: hidden;
    color: #595959;
  }
  .user {
    color: #595959;
    text-align: right;
    width: 200rpx;
    margin-right: 32rpx;
  }
  .date {
    color: #7f7f7f;
    width: 440rpx;
  }
}
</style>
