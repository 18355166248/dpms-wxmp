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
        :clearDate="false"
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
        label: '开单机构',
        key: 'billOrderMedicalInstitutionName',
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
        label: '交易时间',
        key: 'cashierDate',
      },
      {
        label: '交易状态',
        key: 'payStatusName',
      },
      {
        label: '交易类型',
        key: 'payTradeTypeName',
      },
      {
        label: '操作诊所',
        key: 'payOrderMedicalInstitutionName',
      },
      {
        label: '收款人',
        key: 'cashierStaffName',
      },
      {
        label: '备注',
        key: 'payMemo',
      },
      {
        label: '原因跟踪',
        key: 'billOrderMemo',
      },
      {
        label: '实收金额',
        key: 'paymentAmount', //前端自定义字段=本次收款+本次退款
      },
    ]
    return {
      headers: [...this._headers],
      computedCol: ['totalAmount', 'discountReceiveAmount', 'paymentAmount'],
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
      'cashierStaff',
      'payOrderStatusArr',
      'payTradeTypeArr',
      'billTypeArr',
    ]),
  },
  methods: {
    ...mapMutations('finaceReport', ['clearState', 'setPayOrderStatusArr']),
    init() {
      this.setPayOrderStatusArr({
        payOrderStatusIds: '1',
        payOrderStatusNames: '正常',
      })
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
        //交易筛选项医生和咨询师隐藏
        // doctorIds: this.doctor.doctorIds,
        // consultantIds: this.consultant.consultantIds,
        beginTimeMillis: this.beginTimeMillis,
        endTimeMillis: this.endTimeMillis,
        cashierStaffIds: this.cashierStaff.cashierStaffIds,
        payOrderStatusArr: this.payOrderStatusArr.payOrderStatusIds,
        payTradeTypeArr: this.payTradeTypeArr.payTradeTypeIds,
        billTypeArr: this.billTypeArr.billTypeIds,
      }
      let {
        data: {
          total,
          current,
          records,
          summary,
          statBillOrderPayStyleHeaderVOList,
        },
      } = await billAPI.getItemStatPage({
        current: this.current,
        size: this.size,
        ...params,
      })
      let computedColAdd = []
      const channelList = statBillOrderPayStyleHeaderVOList?.map(
        (item, index) => {
          computedColAdd.push(`payStyleTotalAmountList${index + 1}`)
          summary[`payStyleTotalAmountList${index + 1}`] = item.payAmount
          return {
            label: item.transactionChannelIdName,
            key: `payStyleTotalAmountList${index + 1}`,
          }
        },
      )
      const lastList = [
        {
          label: '折后应收金额',
          key: 'afterDiscountAmount',
        },
        {
          label: '本次收款',
          key: 'payAmount',
        },
        {
          label: '本次退款',
          key: 'payRefundAmount',
        },
        {
          label: '欠款总金额',
          key: 'oweAmount',
        },
        {
          label: '本次现金收款',
          key: 'cashAmount',
        },
        {
          label: '本次虚拟收款',
          key: 'virtualAmount',
        },
        {
          label: '本次预收款抵扣',
          key: 'deductionOfAdvancePayment',
        },
        {
          label: '本次营业收入',
          key: 'revenueAmount',
        },
        {
          label: '本次普通收费收入',
          key: 'generalAmount',
        },
        {
          label: '本次划扣收入',
          key: 'plannedAmount',
        },
      ]
      const lastComputed = [
        'afterDiscountAmount',
        'payAmount',
        'payRefundAmount',
        'oweAmount',
        'cashAmount',
        'virtualAmount',
        'deductionOfAdvancePayment',
        'revenueAmount',
        'generalAmount',
        'plannedAmount',
      ]

      records = records.map((item) => {
        // item._realAmount = this.$dpmsUtils.formatPrice(item.payAmount + item.payRefundAmount)
        item.paymentAmount = this.$dpmsUtils.formatPrice(item.paymentAmount)
        for (let i = 0; i < channelList.length; i++) {
          item[`payStyleTotalAmountList${i + 1}`] = this.$dpmsUtils.formatPrice(
            item.payStyleTotalAmountList[i],
          )
        }
        lastComputed.forEach((it) => {
          item[it] = this.$dpmsUtils.formatPrice(item[it])
        })

        item.cashierDate = moment(item.cashierDate).format(
          'YYYY-MM-DD HH:mm:ss',
        )
        return item
      })
      if (this.current === 1) {
        this.contents = records
      } else {
        this.contents = this.contents.concat(records)
      }
      this.headers = [...this._headers, ...channelList, ...lastList]
      this.computedCol = [
        ...this.computedCol,
        ...computedColAdd,
        ...lastComputed,
      ]
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
        // 'doctorIds',
        // 'consultantIds',
        'cashierStaffIds',
        'payOrderStatusArr',
        'payTradeTypeArr',
        'billTypeArr',
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
