<template>
  <view class="chargeContentPending" v-if="pendingList.length > 0">
    <view
      class="list"
      v-for="order in pendingList"
      @click="onPendingList(order)"
      :key="order.billOrderId"
    >
      <view class="listTitle">
        <view class="datetime"
          ><view class="iconfont icon-time-circle"></view>
          {{ order.consultTimeDate }}</view
        >
        <view class="btn pending" v-if="order.billStatus === 0">待收费</view>
        <view class="btn refund" v-if="order.billStatus === 1">待退费</view>
        <view class="btn approvaling" v-if="order.billStatus === 6"
          >审核中</view
        >
        <view class="btn approvaled" v-if="order.billStatus === 7">已通过</view>
        <view class="btn refused" v-if="order.billStatus === 8">未通过</view>
        <view class="btn refused" v-if="order.billStatus === 9"
          >退费审核中</view
        >
      </view>
      <view class="lineHr"></view>
      <view>
        <view class="listLine">
          <view class="ml-32">{{ order.billTypeText }}</view>
          <view class="totalFee"
            >总计金额：{{ $dpmsUtils.formatPrice(order.totalAmount) }}
          </view>
        </view>
        <view class="listLine">
          <view class="ml-32">{{ order.medicalInstitutionName }}</view>
          <view class="chargeFee" v-if="order.billStatus === 0"
            >应收金额：
            <view class="feeRed">
              {{ $dpmsUtils.formatPrice(order.receivableAmount) }}</view
            >
          </view>
          <view class="chargeFee" v-if="order.billStatus === 1"
            >应退金额：
            <view class="feeGreen">{{
              $dpmsUtils.formatPrice(order.receivableAmount)
            }}</view>
          </view>
        </view>
        <view class="listLine">
          <view class="ml-32 remark">备注：{{ order.memo || '-' }}</view>
        </view>
        <view class="listLine" style="padding-bottom: 32rpx;">
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
</template>

<script>
import moment from 'moment'
import billAPI from '@/APIS/bill/bill.api'
import loadMore from '@/components/load-more/load-more.vue'
import { mapMutations } from 'vuex'

export default {
  props: ['patientId', 'customerId'],
  data() {
    return {
      billSupperTypeArray: this.initEnumArray(
        this.$dpmsUtils.getEnums('BillSupperType'),
      ),
      pendingList: [],
      current: 1,
      total: 1,
      size: 5,
      dataSourceStatus: {
        // 数据列表的状态
        loading: true,
        status: 'loading',
        request: 'loading',
      },
    }
  },
  destroyed() {
    uni.$off('refreshPending')
  },
  mounted() {
    setTimeout(() => {
      this.init()
      uni.$on('refreshPending', () => {
        if (this.pendingList.length < this.total) {
          this.current += 1
          this.getPendingOrder()
        }
      })
    }, 0)
  },
  methods: {
    ...mapMutations('checkstand', ['setBillType']),
    ...mapMutations('dispose', ['setReceivableAmount']),
    init() {
      this.current = 1
      this.getPendingOrder()
    },
    onPendingList(record) {
      console.log(106, record)
      if (record.billStatus === 0 && this.btnPremisstion('pending_editing')) {
        this.setBillType(record.billType)
        this.setReceivableAmount(record.receivableAmount)
        uni.navigateTo({
          url: `/pages/charge/checkstand?billSerialNo=${record.billSerialNo}`,
        })
      }
    },
    async getPendingOrder() {
      uni.showLoading({
        title: '数据加载中',
        mask: true,
      })
      const {
        data: { total, current, records },
      } = await billAPI.pendingOrderList({
        patientId: this.patientId,
        customerId: this.customerId,
        current: this.current,
        size: this.size,
      })

      uni.hideLoading()

      records &&
        records.forEach((element) => {
          element.createTimeDate = moment(element.createTime).format(
            'YYYY-MM-DD HH:mm:ss',
          )
          element.consultTimeDate = element.consultTime
            ? moment(element.consultTime).format('YYYY-MM-DD HH:mm:ss')
            : '-'
          const findObj = this.billSupperTypeArray.find((v) => {
            return v.value === element.billType
          })
          element.billTypeText = findObj?.zh_CN
        })

      if (current === 1) {
        this.pendingList = records
      } else {
        this.pendingList = this.pendingList.concat(records)
      }
      this.total = total

      if (total === this.pendingList.length) {
        this.dataSourceStatus.status = 'noMore'
      } else {
        this.dataSourceStatus.status = 'more'
      }
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
.chargeContentPending {
  .lineHr {
    width: 686rpx;
    height: 1rpx;
    margin-left: 32rpx;
    background: rgba(0, 0, 0, 0.15);
  }
  .ml-32 {
    margin-left: 32rpx;
  }
  .list {
    background-color: #fff;
    margin-bottom: 20rpx;
    margin-top: 18rpx;
    .listTitle {
      height: 84rpx;
      display: flex;
      align-items: center;
      margin-bottom: 1rpx;
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
    .btn {
      width: 116rpx;
      height: 40rpx;
      border-radius: 6rpx;
      text-align: center;
      line-height: 40rpx;
      font-size: 28rpx;
      margin-left: 202rpx;
    }
    .pending {
      background: #fff7e6;
      border: 2rpx solid #fa8c16;
      color: #fa8c16;
    }
    .refund {
      background: #f6ffed;
      border: 2rpx solid #52c41a;
      color: #52c41a;
    }
    .approvaling {
      //background: #0bd0da;
      border: 2rpx solid #0bd0da;
      color: #0bd0da;
    }
    .approvaled {
      //background: #5cbb89;
      border: 2rpx solid #5cbb89;
      color: #5cbb89;
    }
    .refused {
      //background: #f2647c;
      border: 2rpx solid #f2647c;
      color: #f2647c;
    }

    .listLine {
      margin-top: 18rpx;
      display: flex;
      font-size: 28rpx;
      justify-content: space-between;
    }
    .totalFee {
      float: right;
      text-align: right;
      font-size: 28rpx;
      margin-right: 32rpx;
    }
    .chargeFee {
      margin-right: 32rpx;
      font-size: 28rpx;
      line-height: 48rpx;
      display: flex;
      justify-content: flex-end;
    }
    .feeRed {
      font-size: 34rpx;
      color: #fa5151;
    }
    .feeGreen {
      font-size: 34rpx;
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
      margin-right: 32rpx;
    }
    .date {
      color: #7f7f7f;
      width: 440rpx;
    }
  }
}
</style>
