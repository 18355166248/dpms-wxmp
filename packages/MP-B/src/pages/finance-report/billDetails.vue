<template>
  <div class="bill-details-wrapper">
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
  name: 'billDetails',
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
        label: '开单时间',
        key: 'createTime',
      },

      {
        label: '账单类型',
        key: 'billType',
      },
      {
        label: '病历号',
        key: 'medicalRecordNo',
      },
      {
        label: '联系电话',
        key: 'patientMobile',
      },
      {
        label: '开单诊所',
        key: 'createMedicalInstitutionName',
      },
      {
        label: '开单人',
        key: 'createStaffName',
      },
      {
        label: '账单状态',
        key: 'billStatus',
      },
      {
        label: '就诊时间',
        key: 'visTime',
      },
      {
        label: '就诊类型',
        key: 'visTypeStr',
      },
      {
        label: '医生',
        key: 'doctorStaffName',
      },
      {
        label: '咨询师',
        key: 'consultantStaffName',
      },
      {
        label: '护士',
        key: 'nurseStaffName',
      },
      {
        label: '销售人员',
        key: 'salesmanStaffName',
      },
      {
        label: '备注',
        key: 'memo',
      },
      {
        label: '原因跟踪',
        key: 'reasonTrack',
      },
      {
        label: '最近交易时间',
        key: 'lastTransactionTime',
      },
      {
        label: '操作诊所',
        key: 'lastUpdateMedicalInstitutionName',
      },
      {
        label: '总计原价',
        key: 'totalAmount',
      },
      {
        label: '整单折扣',
        key: 'mainOrderDiscount',
      },
      {
        label: '折后应收金额',
        key: 'discountReceiveAmount',
      },
    ]
    return {
      headers: [],
      computedCol: ['totalAmount', 'discountReceiveAmount'],
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
    ...mapMutations('finaceReport', ['clearState']),
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
        doctorIds: this.doctor.doctorIds,
        consultantIds: this.consultant.consultantIds,
        beginTime: this.beginTimeMillis,
        endTime: this.endTimeMillis,
      }
      if(this.billOrderNo) {
        params.billSerialNo = this.billOrderNo
      }

      let {
        data: {
          total,
          current,
          records,
          summary,
          statBillOrderPayStyleHeaderVOList,
        },
      } = await billAPI.getOrderPage({
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
          label: '欠款',
          key: 'arrearsAmount',
        },
        {
          label: '退款',
          key: 'refundAmount',
        },
      ]

      const lastComputed = ['arrearsAmount', 'refundAmount']

      records = records.map((item) => {
        for (let i = 0; i < channelList.length; i++) {
          item[`payStyleTotalAmountList${i + 1}`] = this.$utils.formatPrice(
            item.payStyleTotalAmountList[i],
          )
        }
        item.totalAmount = this.$utils.formatPrice(item.totalAmount)
        item.discountReceiveAmount = this.$utils.formatPrice(
          item.discountReceiveAmount,
        )
        item.arrearsAmount = this.$utils.formatPrice(item.arrearsAmount)
        item.refundAmount = this.$utils.formatPrice(item.refundAmount)
        item.billType = this.$utils.getEnumsText('BillType', item.billType)
        item.billStatus = this.$utils.getEnumsText(
          'BillStatus',
          item.billStatus,
        )
        item.createTime = moment(item.createTime).format('YYYY-MM-DD hh:mm:ss')
        item.visTime = moment(item.visTime).format('YYYY-MM-DD hh:mm:ss')
        item.lastTransactionTime = moment(item.lastTransactionTime).format(
          'YYYY-MM-DD hh:mm:ss',
        )
        // console.log(this.$utils.getEnumsText('BillType',4));
        // console.log(item.lastTransactionTime);
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
        'doctorIds',
        'consultantIds',
      ])
      this.$utils.push({
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
.bill-details-wrapper {
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
