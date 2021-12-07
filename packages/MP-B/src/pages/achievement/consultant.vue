<template>
  <view class="ach_consultant">
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
          label: '咨询师',
          key: 'consultantName',
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
          label: '当日收款',
          key: 'paymentAmount',
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
          key: 'generalRevenueAmount',
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
        'generalRevenueAmount',
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
      consultantIds: '',
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
      this.getConsultant()
    })
    uni.$on('emitPage', () => {
      if (this.contents.length < this.total) {
        this.current += 1
        this.getConsultant()
      }
    })
    uni.$on('achFilter', ({ staffIds }) => {
      this.consultantIds = staffIds || ''
      this.current = 1
      this.getConsultant()
      if (staffIds) this.isFilter = true
      else this.isFilter = false
    })
    uni.$on('achReset', (achFilterDisabled) => {
      if (!achFilterDisabled) this.consultantIds = ''
      this.current = 1
      this.isFilter = false
      this.getConsultant()
    })
  },
  beforeDestroy() {
    uni.$off('chooseCalendarOption')
    uni.$off('emitPage')
    uni.$off('achFilter')
    uni.$off('achReset')
    uni.removeStorageSync('achFilter')
  },
  //双重scroll-view触发不灵敏
  // onReachBottom() {
  //   console.log(this.contents.length, this.total, 'onReachBottom')
  //   if (this.contents.length < this.total) {
  //     this.current += 1
  //     this.getConsultant()
  //   }
  // },
  methods: {
    init() {
      this.current = 1
      this.getConsultant()
      this.getStaff()
      this.getPermission()
    },
    async getStaff() {
      const {
        data,
      } = await institutionAPI.getStaffListByPositionFromAllInstitution({
        workStatus:
          this.$dpmsUtils.getEnums('StaffStatus')?.STAFF_STATUS_AT_WORK_NAME
            ?.value || 1,
        position:
          this.$dpmsUtils.getEnums('StaffPosition')?.CONSULTANT?.value || 4,
      })
      uni.setStorageSync('allConsultantList', data)
    },
    async getPermission() {
      //逻辑从pc端搬运
      const { data } = await institutionAPI.getPermission({ dataTypeId: 4 })
      const staff = uni.getStorageSync('staff')
      if (data?.roleTypeId === 5 && staff.position === 4) {
        uni.setStorageSync('achFilter', {
          staffIds: String(staff.staffId),
          staffName: staff.name,
        })
        uni.setStorageSync('achFilterDisabled', true)
      } else {
        uni.setStorageSync('achFilterDisabled', false)
        uni.removeStorageSync('achFilter')
      }
    },
    async getConsultant() {
      uni.showLoading({
        title: '数据加载中',
        mask: true,
      })
      this.dataSourceStatus = 'loading'
      const params = {}
      if (this.consultantIds) {
        params.consultantIds = this.consultantIds
      }
      const {
        data: { total, current, records, summary },
      } = await billAPI.consultantList({
        current: this.current,
        size: this.size,
        beginTimeMillis: this.beginTimeMillis,
        endTimeMillis: this.endTimeMillis,
        ...params,
      })
      records.forEach((element) => {
        element.statDate = moment(element.statDate).format('YYYY-MM-DD')
        element.receivableAmount = this.$dpmsUtils.formatPrice(
          element.receivableAmount,
        )
        element.refundAmount = this.$dpmsUtils.formatPrice(element.refundAmount)
        element.cashAmount = this.$dpmsUtils.formatPrice(element.cashAmount)
        element.virtualAmount = this.$dpmsUtils.formatPrice(
          element.virtualAmount,
        )
        element.deductionOfAdvanceAmount = this.$dpmsUtils.formatPrice(
          element.deductionOfAdvanceAmount,
        )
        element.revenueAmount = this.$dpmsUtils.formatPrice(
          element.revenueAmount,
        )
        element.paymentAmount = this.$dpmsUtils.formatPrice(
          element.paymentAmount,
        )
        element.generalRevenueAmount = this.$dpmsUtils.formatPrice(
          element.generalRevenueAmount,
        )
        element.plannedRevenueAmount = this.$dpmsUtils.formatPrice(
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
      this.$dpmsUtils.push({
        url: `/pages/achievement/filter?name=consultant`,
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
      this.getConsultant()
    },
  },
}
</script>

<style lang="scss" scoped>
.ach_consultant {
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
