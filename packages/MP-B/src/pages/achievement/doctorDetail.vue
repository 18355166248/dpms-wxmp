<template>
  <view class="ach_doctor_detail">
    <wyb-table
      v-if="contents.length !== 0"
      :headers="headers"
      :contents="contents"
      height="100vh"
      :first-line-fixed="true"
      firstColBgColor="#ffffff"
      :dataSourceStatus="dataSourceStatus"
      :bottom-computed-fixed="true"
      :computed-col="computedCol"
      :summary="summary"
    />
    <view class="content" v-if="contents.length === 0">
      <empty :disabled="true" img="../../static/empty.png" text="暂无数据" />
    </view>
  </view>
</template>

<script>
import moment from 'moment'
import billAPI from '@/APIS/bill/bill.api'
import wybTable from '@/components/wyb-table/wyb-table.vue'
import institutionAPI from 'APIS/institution/institution.api'

export default {
  components: {
    wybTable,
  },
  data() {
    return {
      headers: [
        {
          label: '医生',
          key: 'doctorName',
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
      computedCol: [
        'receivableAmount',
        'refundAmount',
        'cashAmount',
        'virtualAmount',
        'deductionOfAdvanceAmount',
        'revenueAmount',
        'paymentAmount',
        'plannedRevenueAmount',
      ],
      contents: [],
      total: 0,
      current: 0,
      size: 10,
      beginTimeMillis: moment().startOf('day').format('x'),
      endTimeMillis: moment().endOf('day').format('x'),
      dateFilterText: '今天',
      isFilter: false,
      dataSourceStatus: 'loading',
      summary: {},
      doctorIds: '',
      parentChargeTypeIds: '',
      chargeTypeName: '',
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
    uni.$on('emitPage', () => {
      if (this.contents.length < this.total) {
        this.current += 1
        this.getDoctors()
      }
    })
    uni.$on('achFilter', ({ staffId, chargeTypeIds, chargeTypeName }) => {
      this.doctorIds = staffId
      this.parentChargeTypeIds = chargeTypeIds
      this.chargeTypeName = chargeTypeName
      this.init()

      if (staffId || chargeTypeIds) this.isFilter = true
      else this.isFilter = false
    })
  },
  onUnload() {
    uni.$off('chooseCalendarOption')
    uni.$off('emitPage')
    uni.$off('achFilter')
  },
  //双重scroll-view触发不灵敏
  // onReachBottom() {
  //   console.log(this.contents.length, this.total, 'onReachBottom')
  //   if (this.contents.length < this.total) {
  //     this.current += 1
  //     this.getDoctors()
  //   }
  // },
  methods: {
    init() {
      this.current = 1
      this.getDotcors()
    },
    async getDotcors() {
      uni.showLoading({
        title: '数据加载中',
        mask: true,
      })
      this.dataSourceStatus = 'loading'
      const params = {}
      if (this.doctorIds) {
        params.doctorIds = this.doctorIds
      }
      if (this.parentChargeTypeIds) {
        params.parentChargeTypeIds = this.parentChargeTypeIds
      }
      const {
        data: { total, current, records, summary },
      } = await billAPI.doctorList({
        current: this.current,
        size: this.size,
        beginTimeMillis: this.beginTimeMillis,
        endTimeMillis: this.endTimeMillis,
        ...params,
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
      if (total === this.contents.length) {
        this.dataSourceStatus = 'noMore'
      } else {
        this.dataSourceStatus = 'more'
      }
      this.summary = summary || {}
      uni.hideLoading()
    },
    emitPage() {
      if (this.contents.length < this.total) {
        this.current += 1
        this.getDoctors()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.ach_doctor_detail {
  background: rgba(0, 0, 0, 0.04);
  .content {
    background: #ffffff;
    height: 92vh;
  }
}
</style>
