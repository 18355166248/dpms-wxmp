<template>
  <view class="chargeContentPending">
    <view class="list">
      <view class="listTitle">
        <view class="datetime"
          ><view class="iconfont icon-time-circle"></view> 2020-10-12
          12:30</view
        >
        <view class="pending">待收费</view>
      </view>
      <view class="lineHr"></view>
      <view class="listContent">
        <view class="listLine">
          <view class="ml-32">普通收费</view>
          <view class="totalFee">总计金额：$950.00 </view>
        </view>
        <view class="listLine">
          <view class="ml-32">北极熊南京分店</view>
          <view class="chargeFee"
            >应收金额：
            <view class="feeRed">$950.00</view>
          </view>
        </view>
        <view class="listLine">
          <view class="ml-32 remark"
            >备注：备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注</view
          >
        </view>
        <view class="listLine">
          <view class="ml-32 date">创建时间：2021-09-08 10:20:30</view>
          <view class="user">季冰宇</view>
        </view>
      </view>
    </view>
    <!-- <view class="list">
      <view class="listTitle">
        <view class="datetime"
          ><view class="iconfont icon-time-circle"></view> 2020-10-12
          12:30</view
        >
        <view class="refund">待退费</view>
      </view>
      <view class="lineHr"></view>
      <view class="listContent">
        <view class="listLine">
          <view class="ml-32">普通收费</view>
          <view class="totalFee">总计金额：$950.00 </view>
        </view>
        <view class="listLine">
          <view class="ml-32">北极熊南京分店</view>
          <view class="chargeFee"
            >应退金额：
            <view class="feeGreen">$950.00</view>
          </view>
        </view>
        <view class="listLine">
          <view class="ml-32 remark"
            >备注：备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注</view
          >
        </view>
        <view class="listLine">
          <view class="ml-32 date">创建时间：2021-09-08 10:20:30</view>
          <view class="user">季冰宇</view>
        </view>
      </view>
    </view> -->
    <load-more :status="dataSourceStatus.status" />
  </view>
</template>

<script>
import moment from 'moment'
import billAPI from '@/APIS/bill/bill.api'
import loadMore from '@/components/load-more/load-more.vue'

export default {
  props: ['patientId'],
  data() {
    return {
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
  mounted() {
    this.init()
  },
  onReachBottom() {
    if (this.pendingList.length < this.total) {
      this.current += 1
      this.getPendingOrder()
    }
  },
  methods: {
    init() {
      this.current = 1
      this.getPendingOrder()
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
        current: this.current,
        size: this.size,
      })

      this.isSearchedValue = this.searchValue
      uni.hideLoading()

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
  },
}
</script>

<style lang="scss" scoped>
.lineHr {
  width: 686rpx;
  height: 2rpx;
  margin-left: 32rpx;
  background: rgba(0, 0, 0, 0.15);
}
.line {
  width: 80%;
  height: 2rpx;
  background: rgba(0, 0, 0, 0.15);
  margin-left: 10%;
}
.ml-32 {
  margin-left: 32rpx;
}
.list {
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
  .refund {
    width: 116rpx;
    height: 40rpx;
    background: #f6ffed;
    border: 2rpx solid #52c41a;
    border-radius: 6rpx;
    text-align: center;
    color: #52c41a;
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
