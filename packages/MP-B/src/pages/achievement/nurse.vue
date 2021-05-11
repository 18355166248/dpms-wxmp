<template>
  <view class="ach_nurse">
    <view class="filter">
      <view class="uni-list-cell">
        <view @click="openCalendar" class="left"
          >{{ dateFilterText }} <view class="iconfont icon-closed"></view>
        </view>
      </view>
      <view class="uni-list-cell">
        <view
          :class="['left', isFilter ? 'right' : '']"
          @click.native="onFilterClick"
          >{{ isFilter ? '已按条件筛选' : '筛选'
          }}<view class="iconfont icon-filter"></view
        ></view>
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
      nurseIds: '',
      parentChargeTypeIds: '',
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
      this.getNurses()
    })
    uni.$on('emitPage', () => {
      if (this.contents.length < this.total) {
        this.current += 1
        this.getNurses()
      }
    })
    uni.$on('achFilter', ({ staffIds, chargeTypeIds }) => {
      this.nurseIds = staffIds || ''
      this.parentChargeTypeIds = chargeTypeIds || ''
      if (staffIds || chargeTypeIds) this.isFilter = true
      else this.isFilter = false
      this.current = 1
      this.getNurses()
    })
  },
  beforeDestroy() {
    uni.$off('chooseCalendarOption')
    uni.$off('emitPage')
    uni.$off('achFilter')
    uni.removeStorageSync('achFilter')
  },
  //双重scroll-view触发不灵敏
  // onReachBottom() {
  //   console.log(this.contents.length, this.total, 'onReachBottom')
  //   if (this.contents.length < this.total) {
  //     this.current += 1
  //     this.getNurses()
  //   }
  // },
  methods: {
    init() {
      this.current = 1
      this.getNurses()
      this.getStaff()
      this.getProject()
    },
    async getStaff() {
      const {
        data,
      } = await institutionAPI.getStaffListByPositionFromAllInstitution({
        workStatus:
          this.$utils.getEnums('StaffStatus')?.STAFF_STATUS_AT_WORK_NAME
            ?.value || 1,
        position: this.$utils.getEnums('StaffPosition')?.NURSE?.value || 6,
      })
      uni.setStorageSync('allNurseList', data)
    },
    async getProject() {
      const { data } = await billAPI.chargeTypeParentList()
      uni.setStorageSync('allProjectList', data)
    },
    async getNurses() {
      uni.showLoading({
        title: '数据加载中',
        mask: true,
      })
      this.dataSourceStatus = 'loading'
      const params = {}
      if (this.nurseIds) {
        params.nurseIds = this.nurseIds
      }
      if (this.parentChargeTypeIds) {
        params.parentChargeTypeIds = this.parentChargeTypeIds
      }
      const {
        data: { total, current, records, summary },
      } = await billAPI.nurseList({
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
        element.revenueAmount = this.$utils.formatPrice(element.revenueAmount)
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
    onFilterClick() {
      this.$utils.push({
        url: `/pages/achievement/filter?name=nurse`,
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
      this.getNurses()
    },
  },
}
</script>

<style lang="scss" scoped>
.ach_nurse {
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
