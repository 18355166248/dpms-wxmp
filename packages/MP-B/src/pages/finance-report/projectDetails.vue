<template>
  <div class="dealDetails-wrapper">
    <view class="filter">
      <view class="uni-list-cell">
        <view @click="openCalendar" class="left">
          {{ dateFilterText }}
          <view class="iconfont icon-closed"></view>
        </view>
      </view>
      <view class="uni-list-cell">
        <view
          :class="['left', isFilter ? 'right' : '']"
          @click.native="onFilterClick"
        >
          {{ isFilter ? '已按条件筛选' : '筛选' }}
          <view class="iconfont icon-filter"></view>
        </view>
      </view>
      <uni-calendar
        ref="calendar"
        :insert="false"
        :range="true"
        @confirm="confirmCalendar"
      />
    </view>
    <wyb-table
      v-if="contents.length !== 0"
      :headers="headers"
      :contents="contents"
      height="93.5vh"
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
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import moment from 'moment'
import billAPI from 'APIS/bill/bill.api'

export default {
  name: 'dealDetails',
  data() {
    this._headers = [
      {
        label: '患者姓名',
        key: 'patientName',
      },
      {
        label: '单据号',
        key: 'billSerialNo',
      },
      {
        label: '账单类型',
        key: 'billTypeName',
      },
      {
        label: '账单状态',
        key: 'payStatusName',
      },
      {
        label: '病历号',
        key: 'medicalRecordNo',
      },
      {
        label: '联系电话',
        key: 'mobile',
      },
      {
        label: '患者所属机构',
        key: 'patientMedicalInstitutionName',
      },
      {
        label: '费用类型',
        key: 'settingsExpensesTypeName',
      },
      {
        label: '收费大类',
        key: 'patientSettingsChargeTypeName',
      },
      {
        label: '收费小类',
        key: 'settingsChargeTypeName',
      },
      {
        label: '收费项目',
        key: 'settingsChargeItemName',
      },
      {
        label: '是否参与整单折扣',
        key: 'allBillDiscountName',
      },
      {
        label: '是否划扣项目',
        key: 'deductSignName',
      },
      {
        label: '治疗步骤',
        key: 'plannedDeductionStep',
      },
      {
        label: '医生科室',
        key: 'doctorDepartmentName',
      },
      {
        label: '医生',
        key: 'doctorStaffName',
      },
      {
        label: '护士',
        key: 'nurseStaffName',
      },
      {
        label: '开单咨询师',
        key: 'counselorName',
      },
      {
        label: '销售人员',
        key: 'salesName',
      },
      {
        label: '备注',
        key: 'memo',
      },
      {
        label: '原因跟踪',
        key: 'reason',
      },
      {
        label: '最近交易时间',
        key: 'lastDealTime',
      },
      {
        label: '最近操作诊所',
        key: 'lastMedicalInstitutionName',
      },
      {
        label: '单价',
        key: 'unitAmount',
      },
      {
        label: '数量',
        key: 'itemNum',
      },
      {
        label: '总价',
        key: 'totalAmount',
      },
      {
        label: '单项折扣',
        key: 'discount',
      },
      {
        label: '整单折扣',
        key: 'allDiscount',
      },
      {
        label: '折后应收',
        key: 'afterDiscountAmount',
      },
      {
        label: '优惠总金额',
        key: 'promotionAmount',
      },
      {
        label: '已收款',
        key: 'paymentAmount',
      },
      {
        label: '退款',
        key: 'refundAmount',
      },
      {
        label: '欠款',
        key: 'oweAmount',
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
        key: 'deductionOfAdvancePayment',
      },
      {
        label: '营业收入',
        key: 'revenueAmount',
      },
      {
        label: '普通收费收入',
        key: 'generalAmount',
      },
      {
        label: '划扣收入',
        key: 'plannedAmount',
      },
      {
        label: '已划扣总比例',
        key: 'afterDiscount',
      },
      {
        label: '最新划扣时间',
        key: 'lastPlannedDeductionTime',
      },
    ]
    return {
      headers: [...this._headers],
      computedCol: [
        'afterDiscountAmount',
        'promotionAmount',
        'paymentAmount',
        'refundAmount',
        'oweAmount',
        'cashAmount',
        'virtualAmount',
        'deductionOfAdvancePayment',
        'revenueAmount',
        'generalAmount',
        'plannedAmount',
      ],
      contents: [],
      total: 0,
      current: 0,
      size: 10,
      // beginTimeMillis:1621440000000,
      beginTimeMillis: moment().startOf('day').format('x'),
      endTimeMillis: moment().endOf('day').format('x'),
      dateFilterText: '今天',
      isFilter: false,
      summary: {},
      dataSourceStatus: 'loading',
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
      this.current = 1
      this.loadData()
    })
    uni.$on('emitPage', () => {
      if (this.contents.length < this.total) {
        this.current += 1
        this.loadData()
      }
    })
    uni.$on('finFilter', (type) => {
      if (type === 'empty') this.isFilter = false
      else if (type === 'filter') this.isFilter = true
      this.loadData()
    })
  },
  beforeDestroy() {
    uni.$off('chooseCalendarOption')
    uni.$off('emitPage')
    uni.$off('finFilter')
  },
  computed: {
    ...mapState('finaceReport', [
      'doctor',
      'consultant',
      'patientInfo',
      'billOrderNo',
    ]),
  },
  methods: {
    init() {
      this.current = 1
      this.loadData()
    },
    async loadData() {
      uni.showLoading({
        title: '数据加载中',
        mask: true,
      })
      this.dataSourceStatus = 'loading'
      const params = {
        patientInfo: this.patientInfo,
        billOrderNo: this.billOrderNo,
        doctorIds: this.doctor.doctorIds,
        consultantIds: this.consultant.consultantIds,
        beginTimeMillis: this.beginTimeMillis,
        endTimeMillis: this.endTimeMillis,
      }
      let {
        data: { total, current, records, summary },
      } = await billAPI.getDetailStatePage({
        current: this.current,
        size: this.size,
        ...params,
      })

      records = records.map((item) => {
        item.lastDealTime = moment(item.lastDealTime).format(
          'YYYY-MM-DD hh:mm:ss',
        )
        item.totalAmount = this.$dpmsUtils.formatPrice(item.totalAmount)
        item.unitAmount = this.$dpmsUtils.formatPrice(item.unitAmount)
        item.discount = item.discount + '%'
        item.allDiscount = item.allDiscount + '%'
        this.computedCol.forEach((it) => {
          item[it] = this.$dpmsUtils.formatPrice(item[it])
        })
        return item
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
    onFilterClick() {
      const filter = JSON.stringify([
        'patientInfo',
        'billOrderNo',
        'doctorIds',
        'consultantIds',
        'parentChargeType',
      ])
      this.$dpmsUtils.push({
        url: `/pages/finance-report/filter?filter=${filter}`,
      })
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
      this.dateFilterText = '自定义'
      this.current = 1
      this.loadData()
    },
  },
}
</script>

<style lang="scss" scoped>
.dealDetails-wrapper {
  background: rgba(0, 0, 0, 0.04);
  overflow-y: auto;
  .filter {
    background: #ffffff;
    height: 80rpx;
    display: flex;
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
        font-size: 28rpx;
        margin-left: 20rpx;
      }
    }
  }
  .content {
    margin-top: 1.5vh;
    background: #ffffff;
    height: calc(98.5vh - 80rpx);
  }
}
</style>
