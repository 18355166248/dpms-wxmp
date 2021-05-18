<template>
  <div class="reconclieCalendarDetail-wrapper">
    <div class="section-title flex-v-center">
      <span class="iconfont icon-time-circle" style="margin-right: 14rpx" />
      <span> {{dataSource.statDate | filterDate('YYYY年MM月DD日')}} </span>
    </div>
    <dpmsCell
      v-for="(item, index) in renderList"
      :key="index"
      :title="item.title"
      :value="item.value"
    />
    <div class="section-title flex-v-center">
      <span class="iconfont icon-time-circle" style="margin-right: 14rpx" />
      <span> 当月累计至{{dataSource.statDate | filterDate('YYYY年MM月DD日')}} </span>
    </div>
    <dpmsCell
      v-for="(item, index) in renderTotalList"
      :key="index"
      :title="item.title"
      :value="item.value"
    />
  </div>
</template>

<script>
import moment from 'moment';
import billAPI from 'APIS/bill/bill.api';
import { numberUtils } from '@/utils/utils';

export default {
  name: 'reconclieCalendarDetail.vue',
  data() {
    return {
      dataSource:{}
    }
  },
  computed: {
    renderList() {
      const { dataSource } = this
      return [
        {
          title:'开单金额',
          value: numberUtils.thousandFormatter(dataSource.billAmount)
        },
        {
          title:'现金收款',
          value: numberUtils.thousandFormatter(dataSource.cacheReceiveAmount)
        },
        {
          title:'收欠款',
          value: numberUtils.thousandFormatter(dataSource.collectArrearsAmount)
        },
        {
          title:'新增欠款',
          value: numberUtils.thousandFormatter(dataSource.arrearsAmount)
        },
        {
          title:'营业收入',
          value: numberUtils.thousandFormatter(dataSource.revenueAmount)
        },
        {
          title:'普通收费收入',
          value: numberUtils.thousandFormatter(dataSource.generalChargeAmount)
        },
        {
          title:'划扣执行收入',
          value: numberUtils.thousandFormatter(dataSource.deductionExecutionAmount)
        },
      ]
    },
    renderTotalList() {
      const { dataSource } = this
      return [
        {
          title: '应收欠款总额',
          value: numberUtils.thousandFormatter(dataSource.arrearsTotalAmount)
        },
        {
          title: '营业收入',
          value: numberUtils.thousandFormatter(dataSource.revenueTotalAmount)
        },
        {
          title: '普通收费收入',
          value: numberUtils.thousandFormatter(dataSource.generalChargeTotalAmount)
        },
        {
          title: '划扣执行收入',
          value: numberUtils.thousandFormatter(dataSource.deductionExecutionTotalAmount)
        }
      ]
    }
  },
  onLoad(option) {
    const {statEndDate} = option
    const statBeginDate =
    billAPI.calendarDetail({
      statEndDate:moment(Number((statEndDate))).endOf('day').valueOf(),
      statBeginDate: moment(Number(statEndDate)).startOf('month').valueOf()
    }).then(res => {
      this.dataSource = res.data
    })
  }
};
</script>

<style lang="scss" scoped>
.reconclieCalendarDetail-wrapper {
  margin-bottom: 100rpx;
  .section-title {
    width: 750rpx;
    height: 80rpx;
    padding: 0 34rpx;
    box-sizing: border-box;
    font-size: 28rpx;
    color: rgba(0,0,0,.9)
  }
}
</style>
