<template>
  <view class="chargeContentPending" v-if="pendingList.length > 0">
    <view
      class="list"
      v-for="order in pendingList"
      @click="toPage(order)"
      :key="order.billOrderId"
    >
      <view class="listTitle">
        <view class="datetime"
          ><view class="iconfont icon-time-circle"></view>
          {{ order.consultTimeDate }}</view
        >
        <view
          class="btn pending"
          :class="billStatusDic[order.billStatus].className"
          >{{ billStatusDic[order.billStatus].text }}</view
        >
      </view>
      <view class="lineHr"></view>
      <view>
        <view class="listLine">
          <view class="ml-32" v-if="order.billType !== 8">{{
            order.billTypeText
          }}</view>
          <view class="ml-32 bill-type-overdue" v-if="order.billType === 8">
            <view class="bill-type-overdue-text">普通收费</view>
            <view class="bill-type-overdue-tag">收欠费</view>
          </view>
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
    <u-toast ref="uToast" />
  </view>
  <view v-else>
    <empty :disabled="true" text="暂无数据"></empty>
  </view>
</template>

<script>
import moment from 'moment'
import billAPI from '@/APIS/bill/bill.api'
import { BigCalculate } from '@/utils/utils'
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
      billStatusDic: {
        0: {
          text: '待收费',
          className: 'pending',
        },
        1: {
          text: '待退费',
          className: 'pending',
        },
        // 2:{
        //   text:'已收费'
        // },
        // 3:{
        //   text:'已退费'
        // },
        4: {
          text: '部分退费',
          className: 'pending',
        },
        6: {
          text: '审核中',
          className: 'approvaling',
        },
        7: {
          text: '已通过',
          className: 'approvaled',
        },
        8: {
          text: '未通过',
          className: 'refused',
        },
        9: {
          text: '退费审核中',
          className: 'approvaling',
        },
        10: {
          text: '退费已通过',
          className: 'approvaled',
        },
        11: {
          text: '退费未通过',
          className: 'refused',
        },
        12: {
          text: '退费待退费',
          className: 'pending',
        },
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
    ...mapMutations('overdue', ['setOverdueList', 'setOverdueAmount']),
    init() {
      this.current = 1
      this.getPendingOrder()
    },
    onPendingList(record) {
      console.log(155, record)
      if (
        ([0, 7, 8].includes(record.billStatus) &&
          this.btnPremisstion('pending_editing')) ||
        [6].includes(record.billStatus)
      ) {
        this.setBillType(record.billType)
        this.setReceivableAmount(record.receivableAmount)
        uni.navigateTo({
          url: `/pages/charge/checkstand?billSerialNo=${record?.billSerialNo}&billStatus=${record?.billStatus}&canRevoke=${record?.canRevoke}`,
        })
      }
    },
    /**
     * 若billType为8则跳转收欠费页面
     */
    toPage(record) {
      if (record.billType === 8) {
        this.toOverdue(record)
      } else {
        this.checkPromotion(record)
      }
    },

    checkPromotion(record) {
      billAPI
        .checkPromotion({
          billSerialNo: record?.billSerialNo,
        })
        .then((res) => {
          console.log(res)
          const { code, data } = res
          if (code !== 0) return
          // 卡券交易
          if (data.isCardVoucherCharge === 1) {
            this.$refs.uToast.show({
              title: '小程序暂不支持卡券收费，请在电脑端进行收费!',
              type: 'warning',
            })
          } else {
            //未付款的代金券和使用了优惠券
            if (data.isPay === 2 || data.usePromotion === 1) {
              this.$refs.uToast.show({
                title:
                  '本单由于使用优惠折扣，暂不支持小程序端收费，请去电脑端进行收费!',
                type: 'warning',
              })
            } else {
              this.onPendingList(record)
            }
          }
        })
    },
    // 跳转收欠费
    toOverdue(record) {
      uni.navigateTo({
        url: `/pages/charge/overdueCheckstand?billOrderId=${record.billOrderId}`,
      })
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
    .btn {
      height: 40rpx;
      border-radius: 6rpx;
      text-align: center;
      line-height: 40rpx;
      font-size: 28rpx;
      padding: 0 10rpx;
      margin-right: 28rpx;
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
      word-break: break-all;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
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
    .bill-type-overdue {
      display: flex;
      justify-content: flex-start;

      .bill-type-overdue-text {
        margin-right: 8rpx;
      }
      .bill-type-overdue-tag {
        background: #fa5151;
        border-radius: 4rpx;
        height: 40rpx;
        font-size: 24rpx;
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        text-align: center;
        color: #ffffff;
        line-height: 40rpx;
        padding: 0 8rpx;
      }
    }
  }
}
</style>
