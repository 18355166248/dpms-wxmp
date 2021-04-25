<template>
  <scroll-view class="ach_nurse">
    <view class="filter">
      <view class="uni-list-cell">
        <view @click="openCalendar" class="left"
          >{{ dateFilterText }} <view class="iconfont icon-closed"></view>
        </view>
      </view>
      <view class="uni-list-cell">
        <view :class="['left', isFilter ? 'right' : '']"
          >{{ isFilter ? '已按条件筛选' : '筛选'
          }}<view class="iconfont icon-closed"></view
        ></view>
      </view>
    </view>
    <view class="content">
      <dpmsTable
        v-if="contents.length !== 0"
        firstLinefixed
        :contents="contents"
        :headers="headers"
        height="92vh"
      />
      <empty
        :disabled="true"
        img="../../static/empty.png"
        text="暂无数据"
        v-if="contents.length === 0"
      />
      <uni-calendar
        ref="calendar"
        :insert="false"
        :range="true"
        @confirm="confirmCalendar"
      />
    </view>
  </scroll-view>
</template>

<script>
import moment from 'moment'
import billAPI from '@/APIS/bill/bill.api'

export default {
  data() {
    return {
      headers: [
        {
          label: '护士',
          key: 'nurseName',
        },
        {
          label: '机构',
          key: 'medicalInstitutionName',
        },
        {
          label: '日期',
          key: 'statDate',
        },
        {
          label: '收费大类',
          key: 'parentItemChargeTypeName',
        },
        {
          label: '收费小类',
          key: 'itemChargeTypeName',
        },
        {
          label: '项目名称',
          key: 'itemName',
        },
        {
          label: '当日收款',
          key: 'receivableAmount',
        },
        {
          label: '当日退款',
          key: 'refundAmount',
        },
        {
          label: '现金收款',
          key: 'cashAmount',
        },
        {
          label: '虚拟收款',
          key: 'virtualAmount',
        },
        {
          label: '预收款抵扣',
          key: 'deductionOfAdvanceAmount',
        },
        {
          label: '营业收入',
          key: 'revenueAmount',
        },
        {
          label: '普通收费收入',
          key: 'paymentAmount',
        },
        {
          label: '划扣收入',
          key: 'plannedRevenueAmount',
        },
      ],
      contents: [],
      total: 0,
      current: 0,
      size: 20,
      beginTimeMillis: moment().startOf('day').format('x'),
      endTimeMillis: moment().endOf('day').format('x'),
      dateFilterText: '今天',
      isFilter: false,
    }
  },
  onLoad() {
    this.init()
    uni.$on('chooseCalendarOption', (name) => {
      switch (name) {
        case 'today':
          this.beginTimeMillis = moment().startOf('day').format('x')
          this.endTimeMillis = moment().endOf('day').format('x')
          this.dateFilterText = '今天'
          break
        case 'yesterday':
          this.beginTimeMillis = moment()
            .subtract(1, 'day')
            .startOf('day')
            .format('x')
          this.endTimeMillis = moment()
            .subtract(1, 'day')
            .endOf('day')
            .format('x')
          this.dateFilterText = '昨天'
          break
        case 'thisMonth':
          this.beginTimeMillis = moment().startOf('month').format('x')
          this.endTimeMillis = moment().endOf('month').format('x')
          this.dateFilterText = '本月'
          break
        case 'lastMonth':
          this.beginTimeMillis = moment()
            .subtract(1, 'month')
            .startOf('month')
            .format('x')
          this.endTimeMillis = moment()
            .subtract(1, 'month')
            .endOf('month')
            .format('x')
          this.dateFilterText = '上月'
          break
        default:
          break
      }
      this.init()
    })
  },
  onUnload() {
    uni.$off('chooseCalendarOption')
  },
  onReachBottom() {
    if (this.contents.length > this.total) return
    this.current += 1
    this.getNurses()
  },
  methods: {
    init() {
      this.current = 1
      this.getNurses()
    },
    async getNurses() {
      uni.showLoading({
        title: '数据加载中',
        mask: true,
      })
      const {
        data: { total, current, records },
      } = await billAPI.nurseList({
        current: this.current,
        size: this.size,
        beginTimeMillis: this.beginTimeMillis,
        endTimeMillis: this.endTimeMillis,
      })
      records.forEach((element) => {
        element.statDate = moment(element.statDate).format('YYYY-MM-DD')
        element.receivableAmount = this.$utils.formatPrice(
          element.receivableAmount,
        )
        element.refundAmount = this.$utils.formatPrice(element.refundAmount)
        element.cashAmount = this.$utils.formatPrice(element.cashAmount)
        element.virtualAmount = this.$utils.formatPrice(element.virtualAmount)
        element.deductionOfAdvanceAmount = this.$utils.formatPrice(
          element.deductionOfAdvanceAmount,
        )
        element.paymentAmount = this.$utils.formatPrice(element.paymentAmount)
        element.plannedRevenueAmount = this.$utils.formatPrice(
          element.plannedRevenueAmount,
        )
      })
      if (this.current === 1) {
        this.contents = records
      } else {
        this.contents = this.contents.concat(records)
      }
      this.total = total
      this.current = current
      uni.hideLoading()
    },
    openCalendar() {
      this.$refs.calendar.open()
    },
    confirmCalendar({ range, fulldate }) {
      const { before, after, data } = range
      if (data.length === 0) {
        this.beginTimeMillis = moment(fulldate).startOf('day').format('x')
        this.endTimeMillis = moment(fulldate).endOf('day').format('x')
      } else {
        this.beginTimeMillis = moment(before).format('x')
        this.endTimeMillis = moment(after).endOf('day').format('x')
      }
      this.init()
    },
  },
}
</script>

<style lang="scss" scoped>
.ach_nurse {
  background: rgba(0, 0, 0, 0.04);
  .filter {
    background: #ffffff;
    height: 6vh;
    display: flex;
    margin-bottom: 2vh;
    .uni-list-cell {
      width: 50vw;
      .left {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
      }
      .right {
        color: #5cbb89;
      }
      .iconfont {
        font-size: 24rpx;
        margin-left: 20rpx;
      }
    }
  }
  .content {
    background: #ffffff;
    height: 92vh;
  }
}
</style>
