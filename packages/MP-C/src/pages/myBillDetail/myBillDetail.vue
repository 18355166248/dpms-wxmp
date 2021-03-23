<template>
  <div class="myBillDetail">
    <div class="billNoTop">
      <div class="billNo">账单号：{{ myBillDetailContent.billSerialNo }}</div>
      <div class="billNoTime">
        <div>
          交易时间：{{ getLastUpdateTime(myBillDetailContent.lastUpdateTime) }}
        </div>
        <div>{{ myBillDetailContent.medicalInstitutionName || '' }}</div>
      </div>
    </div>
    <div class="billContent">
      <div class="billProjectDetailContent marginBottom20">
        <div class="billProjectDetail">项目明细</div>
        <div
          class="billList"
          v-for="item in myBillDetailContent.billOrderItemSalesVOList"
          :key="item.id"
        >
          <div class="title">{{ item.billOrderItemBaseVO.itemName }}</div>
          <div class="billFlex">
            <div>
              <span class="colorFont7">{{
                formatPriceDecimal(item.billOrderItemBaseVO.unitAmount)
              }}</span
              ><span class="colorFont7" style="margin-left: 32rpx;"
                >×{{ item.billOrderItemBaseVO.itemNum }}</span
              >
            </div>
            <div class="redColor">
              {{ formatPriceDecimal(item.billOrderItemBaseVO.totalAmount) }}
            </div>
          </div>
        </div>
      </div>
      <div class="billProjectDetailContent">
        <div class="billProjectDetailAmount">
          <div class="billFlexAmount" style="padding-top: 0;">
            <div>应收金额</div>
            <div>
              {{ formatPriceDecimal(myBillDetailContent.receivableAmount) }}
            </div>
          </div>
          <div class="billFlexAmount">
            <div>实付金额</div>
            <div>
              {{ formatPriceDecimal(myBillDetailContent.receiptAmount) }}
            </div>
          </div>
          <div class="billFlexAmount">
            <div>欠费</div>
            <div class="greenColor">
              {{ formatPriceDecimal(myBillDetailContent.arrearageAmount) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { formatPriceDecimal } from '../../utils/decimalPointUtil'
import customerAPI from '@/APIS/customer/customer.api'
export default {
  name: 'myBillDetail',
  data() {
    return {
      formatPriceDecimal: formatPriceDecimal,
      myBillDetailContent: {
        billSerialNo: '',
        lastUpdateTime: '',
        medicalInstitutionName: '',
        billOrderItemSalesVOList: [],
        receivableAmount: 1800,
        arrearsAmount: 50,
        paidAmount: 1750,
      },
    }
  },
  onLoad(params) {
    const {
      billSerialNo,
      medicalInstitutionId,
      medicalInstitutionName,
      lastUpdateTime,
      receivableAmount,
      arrearageAmount,
      receiptAmount,
    } = params
    this.getBillDetailData(
      billSerialNo,
      medicalInstitutionId,
      medicalInstitutionName,
      lastUpdateTime,
      receivableAmount,
      arrearageAmount,
      receiptAmount,
    )
  },
  methods: {
    getBillDetailData(
      billSerialNo,
      medicalInstitutionId,
      medicalInstitutionName,
      lastUpdateTime,
      receivableAmount,
      arrearageAmount,
      receiptAmount,
    ) {
      customerAPI
        .billGoods({
          billSerialNo: billSerialNo,
          medicalInstitutionId: medicalInstitutionId,
        })
        .then((res) => {
          this.myBillDetailContent = {
            ...this.myBillDetailContent,
            billOrderItemSalesVOList: res.data.billOrderItemSalesVOList,
            billSerialNo: billSerialNo,
            medicalInstitutionName: medicalInstitutionName,
            lastUpdateTime: lastUpdateTime,
            receivableAmount: receivableAmount,
            receiptAmount: receiptAmount,
            arrearageAmount: arrearageAmount,
          }
          // uni.hideLoading()
          // uni.stopPullDownRefresh()
        })
    },
    getLastUpdateTime(lastUpdateTime) {
      return moment(Number(lastUpdateTime)).format('YYYY-MM-DD HH:mm:ss')
    },
  },
}
</script>

<style lang="scss" scoped>
.myBillDetail {
  .billNoTop {
    padding: 24rpx 32rpx;
    color: #5cbb89;
    background: rgba(0, 0, 0, 0.04);
    .billNo {
      margin-bottom: 16rpx;
      height: 36rpx;
      font-size: 28rpx;
      font-family: PingFangSC, PingFangSC-Regular, sans-serif;
      font-weight: 400;
      text-align: left;
      color: rgba(0, 0, 0, 0.7);
      line-height: 36rpx;
    }
    .billNoTime {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      height: 32rpx;
      font-size: 24rpx;
      font-family: PingFangSC, PingFangSC-Regular, sans-serif;
      font-weight: 400;
      /*text-align: left;*/
      color: #7f7f7f;
      line-height: 32rpx;
    }
  }
  .billContent {
    .billProjectDetailContent {
      background: #fff;
      .billProjectDetail {
        padding: 32rpx;
        height: 48rpx;
        font-size: 40rpx;
        font-family: PingFangSC, PingFangSC-Medium, sans-serif;
        font-weight: 500;
        text-align: left;
        color: #191919;
        line-height: 48rpx;
      }
      .billList {
        padding: 0 32rpx 32rpx 32rpx;
        .title {
          height: 36rpx;
          font-size: 34rpx;
          font-family: PingFangSC, PingFangSC-Medium, sans-serif;
          font-weight: 500;
          text-align: left;
          color: rgba(0, 0, 0, 0.9);
          line-height: 36rpx;
        }
        .billFlex {
          padding-top: 8rpx;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          font-size: 28rpx;
        }
      }

      .billProjectDetailAmount {
        padding: 24rpx 32rpx;
        .billFlexAmount {
          padding-top: 16rpx;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          div {
            height: 36rpx;
            font-size: 28rpx;
            font-family: PingFangSC, PingFangSC-Regular, sans-serif;
            font-weight: 400;
            color: #191919;
            line-height: 36rpx;
          }
        }
      }
    }
  }
  .marginBottom20 {
    margin-bottom: 20rpx;
  }
  .lineHr {
    width: 100%;
    height: 3rpx;
    background: rgba(0, 0, 0, 0.1);
  }
  .colorFont7 {
    color: #7f7f7f;
  }
  .colorFont9 {
    color: rgba(0, 0, 0, 0.9);
  }
  .redColor {
    font-size: 30rpx;
    color: #fa5151;
  }
  .greenColor {
    color: #5cbb89 !important;
  }
}
</style>
