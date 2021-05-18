<template>
  <div class="bill-report">
    <div class="title-wrapper flex-center">
      <div>财务对账</div>
      <div class="close-icon"></div>
    </div>
    <div class="item-group-wrapper">
      <div @click="handleItemClick(item)" class="item-wrapper flex-center" v-for="(item, index) in btnList" :key="index">
        <div>{{ item.name }}</div>
      </div>
    </div>

  </div>
</template>

<script>
const defaultBtnList = [
  {
    name: '对账日历',
    path: '/pages/finance-report/reconclieCalendar',
    permission: ['report-center', 'finance-reconclie', 'reconclie-calendar'],
  },
  {
    name: '支付方式对账',
    path: '/pages/finance-report/paymentReconclie',
    permission: ['report-center', 'finance-reconclie', 'payment-reconclie'],
  },
  {
    name: '账单明细',
    path: '/pages/finance-report/billDetails',
    permission: ['report-center', 'finance-reconclie', 'bill-details'],
  },
  {
    name: '明细交易',
    path: '/pages/finance-report/dealDetails',
    permission: ['report-center', 'finance-reconclie', 'deal-details'],
  },
  {
    name: '项目明细',
    path: '/pages/finance-report/projectDetails',
    permission: ['report-center', 'finance-reconclie', 'project-details'],
  },
  {
    name: '欠款患者',
    path: '/pages/finance-report/arrearsPatient',
    permission: ['report-center', 'finance-reconclie', 'arrears-patient'],
  },
];
export default {
  name: 'billReport',
  data() {
    return {
      btnList: [],
    };
  },
  mounted() {
    this.btnList = defaultBtnList.filter(item => this.menuPermission(item.permission));
  },
  methods: {
    handleItemClick(record) {
      uni.navigateTo({
        url: record.path,
      })
      this.$emit('closeModal')
    }
  },
};
</script>

<style lang="scss" scoped>
.bill-report {
  .title-wrapper {
    width: 100%;
    height: 93rpx;
    font-size: 34rpx;
    color: #191919;
    border-bottom: 1rpx solid #E5E5E5;
  }

  .item-group-wrapper {
    display: flex;
    flex-wrap: wrap;
    width: 750rpx;

    .item-wrapper {
      width: 375rpx;
      height: 136rpx;
      color: #191919;
      font-size: 30rpx;
      box-sizing: border-box;
      border-bottom: 1rpx solid #E5E5E5;
      &:nth-child(odd) {
        border-right: 1rpx solid #E5E5E5;
      }
      &:nth-last-child(1) {
        border-bottom: 0rpx solid #E5E5E5;
      }
      &:nth-last-child(2) {
        border-bottom: 0rpx solid #E5E5E5;
      }
    }
  }
}
</style>
