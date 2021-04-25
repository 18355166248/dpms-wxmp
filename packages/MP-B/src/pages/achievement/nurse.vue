<template>
  <scroll-view class="ach_doc">
    <view style="height: 6vh; display: flex;">
      <uni-calendar
        ref="calendar"
        :insert="false"
        :range="true"
        @confirm="confirm"
      />
      <button @click="open">打开日历</button>
    </view>
    <dpmsTable
      firstLinefixed
      :contents="contents"
      :headers="headers"
      height="94vh"
    />
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
    }
  },
  onLoad() {
    this.init()
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
      const {
        data: { total, current, records },
      } = await billAPI.nurseList({
        current: this.current,
        size: this.size,
        beginTimeMillis: 1609430400000,
        endTimeMillis: 1640966399999,
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
    },
    open() {
      this.$refs.calendar.open()
    },
    confirm(e) {
      console.log(e)
    },
  },
}
</script>

<style lang="scss" scoped>
.ach_doc {
  width: 100%;
}
</style>
