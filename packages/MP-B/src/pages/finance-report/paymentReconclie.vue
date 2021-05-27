<template>
  <div class="paymentReconclie-wrapper">
    <view class="filter">
      <view class="uni-list-cell">
        <view @click="openCalendar" class="left">
          {{ dateFilterText }}
          <view class="iconfont icon-closed"></view>
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
  name: 'paymentReconclie',
  data() {
    this._headers = [
      {
        label: '日期',
        key: 'day',
      },
      {
        label: '小计',
        key: 'totalAmount',
      },
    ]
    return {
      headers: [...this._headers],
      computedCol: ['totalAmount', 'discountReceiveAmount'],
      contents: [],
      total: 0,
      current: 0,
      size: 10,
      beginTimeMillis: moment().startOf('day').format('x'),
      endTimeMillis: moment().endOf('day').format('x'),
      dateFilterText: '今天',
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
  },
  beforeDestroy() {
    uni.$off('chooseCalendarOption')
    uni.$off('emitPage')
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
        startSearchTimeStamp: this.beginTimeMillis,
        endSearchTimeStamp: this.endTimeMillis,
      }
      let {
        data: {
          total,
          current,
          records,
          summary,
          payStyleReconciliationTableHeaderList,
        },
      } = await billAPI.payReconciliation({
        current: this.current,
        size: this.size,
        ...params,
      })
      let computedColAdd = []
      const channelList = payStyleReconciliationTableHeaderList?.map(
        (item, index) => {
          computedColAdd.push(`payStyleTotalAmountList${index + 1}`)
          summary[`payStyleTotalAmountList${index + 1}`] = item.totalAmount
          return {
            settingsPayTransactionChannelId:
              item.settingsPayTransactionChannelId,
            label: item.settingsPayTransactionChannelName,
            key: `payStyleTotalAmountList${index + 1}`,
          }
        },
      )
      const lastList = [
        {
          label: '机构',
          key: 'medicalInstitutionName',
        },
      ]
      const lastComputed = ['totalAmount']
      console.log(records)

      records = records.map((item) => {
        for (let i = 0; i < channelList.length; i++) {
          item[`payStyleTotalAmountList${i + 1}`] = this.$utils.formatPrice(
            item.payStyleReconciliationItemList[i].totalAmount,
          )
        }
        item.totalAmount = this.$utils.formatPrice(item.totalAmount)
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
.paymentReconclie-wrapper {
  background: rgba(0, 0, 0, 0.04);
  overflow-y: auto;
  .filter {
    background: #ffffff;
    height: 80rpx;
    display: flex;
    .uni-list-cell {
      width: 100vw;
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
