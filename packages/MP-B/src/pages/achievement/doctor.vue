<template>
  <view class="ach_doctor">
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
      :url-col="[{ type: 'route', key: 'url' }]"
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
          key: 'url',
          width: 272,
        },
        {
          label: '实收金额',
          key: 'paidInAmount',
          width: 478,
        },
      ],
      computedCol: ['paidInAmount'],
      contents: [],
      total: 0,
      current: 0,
      size: 10,
      beginTimeMillis: moment().startOf('day').format('x'),
      endTimeMillis: moment().endOf('day').format('x'),
      // beginTimeMillis: 1548950400000,
      // endTimeMillis: 1619711999999,
      dateFilterText: '今天',
      isFilter: false,
      dataSourceStatus: 'loading',
      summary: {},
      doctorIds: '',
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
      this.getDoctors()
    })
    uni.$on('emitPage', () => {
      if (this.contents.length < this.total) {
        this.current += 1
        this.getDoctors()
      }
    })
    uni.$on('achFilter', ({ staffIds, chargeTypeIds }) => {
      this.doctorIds = staffIds || ''
      this.parentChargeTypeIds = chargeTypeIds || ''
      this.current = 1
      this.getDoctors()
      if (staffIds || chargeTypeIds) this.isFilter = true
      else this.isFilter = false
    })
  },
  beforeDestroy() {
    console.log('doctor unload')
    uni.$off('chooseCalendarOption')
    uni.$off('emitPage')
    uni.$off('achFilter')
    uni.removeStorageSync('achFilter')
  },
  methods: {
    init() {
      this.current = 1
      this.getDoctors()
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
        position: this.$utils.getEnums('StaffPosition')?.DOCTOR?.value || 2,
      })
      uni.setStorageSync('allDoctorList', data)
    },
    async getProject() {
      const { data } = await billAPI.chargeTypeParentList()
      uni.setStorageSync('allProjectList', data)
    },
    async getDoctors() {
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
      const { beginTimeMillis, endTimeMillis, parentChargeTypeIds } = this
      records.forEach((element) => {
        element.paidInAmount = this.$utils.formatPrice(element.paidInAmount)
        element.url = [
          element.doctorName,
          '/pages/achievement/doctorDetail',
          {
            id: element.doctorId,
            beginTimeMillis,
            endTimeMillis,
            parentChargeTypeIds,
          },
        ]
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
        url: `/pages/achievement/filter?name=doctor`,
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
      this.getDoctors()
    },
  },
}
</script>

<style lang="scss" scoped>
.ach_doctor {
  background: rgba(0, 0, 0, 0.04);
  .filter {
    background: #ffffff;
    height: 6.5vh;
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
        font-size: 24rpx;
        margin-left: 20rpx;
      }
    }
  }
  .content {
    margin-top: 1.5vh;
    background: #ffffff;
    height: 92vh;
  }
}
</style>
