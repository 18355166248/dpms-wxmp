<template>
  <div>
    <div
      v-if="myBillData.length !== 0"
      class="list"
      v-for="item in myBillData"
      @click="onHandleClick(item)"
    >
      <div style="padding: 24rpx 0">
        <div class="flexContent" style="padding-bottom:24rpx">
          <div class="leftText">
            <span class="icon iconfont icontime-circle colorFont"></span
            ><span class="colorFont" style="margin-left: 14rpx;">{{
              getUpdateTime(item.lastUpdateTime)
            }}</span>
          </div>
          <div class="rightText">
            <span class="colorFont">{{ item.medicalInstitutionName }}</span>
          </div>
        </div>
        <div class="lineHr"></div>
        <div class="flexContent" style="padding-top: 30rpx">
          <div class="leftText">
            <span class="colorFont9">账单号：{{ item.billSerialNo }}</span>
          </div>
          <div class="rightText">
            <span class="colorFont9">{{ billTypeFormat(item.billType) }}</span>
          </div>
        </div>
        <div class="flexContent" style="padding-top: 24rpx">
          <div class="leftText">{{ item.patientName }}</div>
          <div class="rightText" @click="onHandleClick(item.id)">
            <span>应收金额：</span
            ><span style="font-size: 28rpx;"
              >¥{{ item.receivableAmount || 0 }}</span
            >
          </div>
        </div>
        <div class="flexContent" style="padding-top: 22rpx">
          <div class="leftText">
            <div v-if="item.arrearageAmount && item.arrearageAmount > 0 ">
              <span>欠费：</span
              ><span style="color: #5cbb89; font-size: 34rpx;"
                >¥{{ item.arrearageAmount }}</span
              >
            </div>
          </div>
          <div class="rightText">
            <span>实付金额：</span
            ><span style="color: #fa5151; font-size: 32rpx;"
              >¥{{ item.receiptAmount || 0 }}</span
            >
          </div>
        </div>
      </div>
    </div>
    <load-more
      :status="loadStatus"
      :contentText="contentText"
      :color="color"
    ></load-more>
    <div v-if="myBillData.length === 0" class="emptyContent">
      <image class="imgContent" src="../../static/empty-icon@2x.png" />
      <div class="emptyText">暂无消费账单</div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import customerAPI from '@/APIS/customer/customer.api'
export default {
  name: 'myBill',
  data() {
    return {
      imgPic: require('../../static/empty-icon@2x.png'),
      myBillData: [],
      billShow: false,
      loadStatus: 'loading',
      currentPage: 1,
      total: 0,
      size: 2,
      contentText: {
        contentdown: '加载更多',
        contentrefresh: '正在加载..',
        contentnomore: '',
      },
      color: 'rgb(0, 0, 0, 0.5)',
    }
  },
  mounted() {},
  onLoad(params) {
    uni.startPullDownRefresh()
  },
  onPullDownRefresh() {
    this.getBillData()
  },
  onReachBottom() {
    this.loadMoreList()
  },
  methods: {
    billTypeFormat(billType) {
      let billTypeStr = ''
      if (billType === 1 || billType === 2 || billType === 6) {
        return (billTypeStr = '普通收费')
      } else if (billType === 3) {
        return (billTypeStr = '储值卡交易')
      } else if (billType === 4) {
        return (billTypeStr = '卡券交易')
      } else if (billType === 5) {
        return (billTypeStr = '专享卡交易')
      }
    },
    getBillData() {
      this.myBillData = []
      this.currentPage = 1
      customerAPI.bill({ current: this.currentPage }).then((res) => {
        this.myBillData = res.data.records
        this.total = res.data.total
        if (this.myBillData.length < this.total) {
          this.loadStatus = 'more'
        } else {
          this.loadStatus = 'noMore'
        }
      })
      uni.stopPullDownRefresh()
    },
    loadMoreList() {
      if (this.loadStatus === 'loading') return
      if (this.storeList.length >= this.total) return
      this.loadStatus = 'loading'
      ++this.currentPage
      this.loadData()
    },
    loadData() {
      customerAPI.bill({ current: this.currentPage }).then((res) => {
        this.myBillData = this.myBillData.concat(res.data.records)
        this.total = res.data.total
        if (this.myBillData.length < this.total) {
          this.loadStatus = 'more'
        } else {
          this.loadStatus = 'noMore'
        }
      })
    },
    getUpdateTime(lastUpdateTime) {
      return moment(lastUpdateTime).format('YYYY-MM-DD HH:mm:ss')
    },
    onHandleClick(item) {
      if (item.billSerialNo === '') {
        return false
      } else {
        this.$utils.push({
          url: `/pages/myBillDetail/myBillDetail?billSerialNo=${item.billSerialNo}&medicalInstitutionId=${item.medicalInstitutionId}&medicalInstitutionName=${item.medicalInstitutionName}&lastUpdateTime=${item.lastUpdateTime}&receivableAmount=${item.receivableAmount}&arrearageAmount=${item.arrearageAmount}&receiptAmount=${item.receiptAmount}`,
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.icon-arrow-right {
  position: absolute;
  right: 200rpx;
  top: 28rpx;
}

.colorFont {
  color: rgba(0, 0, 0, 0.65) !important;
}
.colorFont9 {
  color:#191919;
}

.list {
  background-color: #fff;
  margin-bottom: 20rpx;
  .flexContent {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    /*height: 84rpx;*/
    /*line-height: 84rpx;*/
    .leftText {
      width: 65%;
      padding-left: 32rpx;
      font-size: 28rpx;
      font-weight: 400;
      color: #191919;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .rightText {
      width: 35%;
      padding-right: 32rpx;
      text-align: right;
      font-weight: 400;
      color: #191919;
      font-size: 28rpx;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .lineHr {
    margin: 0 32rpx;
    height: 3rpx;
    background: rgba(0, 0, 0, 0.1);
  }
  /*.lineHr2 {*/
  /*  width: 97%;*/
  /*  height: 3rpx;*/
  /*  margin-left: 3%;*/
  /*  background: rgba(0, 0, 0, 0.15);*/
  /*}*/
}
.emptyContent {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 580rpx;
  .imgContent {
    margin-top: 176rpx;
    margin-bottom: 20rpx;
    width: 320rpx;
    height: 320rpx;
  }
  .emptyText {
    width: 100%;
    font-size: 34rpx;
    font-family: PingFangSC, PingFangSC-Regular, sans-serif;
    text-align: center;
    color: rgba(0, 0, 0, 0.65);
  }
}
</style>
