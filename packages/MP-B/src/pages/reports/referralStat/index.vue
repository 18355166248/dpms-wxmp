<template>
  <view class="rpt_referral">
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
          }}<view class="iconfont icon-filter"></view>
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
    />
    <view class="content" v-if="contents.length === 0">
      <empty :disabled="true" img="../../static/empty.png" text="暂无数据" />
    </view>
  </view>
</template>

<script>
import moment from 'moment'
import billAPI from 'APIS/bill/bill.api'
import institutionAPI from 'APIS/institution/institution.api'
import wybTable from 'components/wyb-table/wyb-table.vue'

export default {
  components: {
    wybTable,
  },
  data() {
    return {
      headers: [
        {
          label: '患者姓名',
          key: 'patientName',
          width: 220,
        },
        {
          label: '挂号时间',
          key: 'registerTime',
          width: 240,
        },
        {
          label: '转诊时间',
          key: 'referralTime',
          width: 240,
        },
        {
          label: '就诊类型',
          key: 'visTypeName',
        },
        {
          label: '病历号',
          key: 'medicalRecordNo',
          width: 260,
        },
        {
          label: '联系电话',
          key: 'mobile',
          width: 220,
        },
        {
          label: '性别',
          key: 'gender',
        },
        {
          label: '出生日期',
          key: 'birthday',
          width: 220,
        },
        {
          label: '转出医生',
          key: 'oldDoctorStaffName',
        },
        {
          label: '转出科室',
          key: 'oldInstitutionDepartmentName',
        },
        {
          label: '转入医生',
          key: 'doctorStaffName',
        },
        {
          label: '转入科室',
          key: 'institutionDepartmentName',
        },
        {
          label: '备注',
          key: 'memo',
          width: 520,
        },
        {
          label: '患者消费金额',
          key: 'payAmount',
        },
      ],
      contents: [],
      total: 0,
      current: 0,
      size: 10,
      registerTimeStartStamp: moment().startOf('day').format('x'),
      registerTimeEndStamp: moment().endOf('day').format('x'),
      dateFilterText: '今天',
      isFilter: false,
      dataSourceStatus: 'loading',
      // 转入医生id
      doctorStaffId: '',
      // 转入科室id
      institutionDepartmentId: '',
      // 转出医生id
      oldDoctorStaffId: '',
      // 转出科室id
      oldInstitutionDepartmentId: '',
      searchKey: '',
    }
  },
  onLoad() {
    this.init()
    uni.$on('chooseCalendarOption', (name) => {
      switch (name) {
        case 'today':
          this.registerTimeStartStamp = moment().startOf('day').format('x')
          this.registerTimeEndStamp = moment().endOf('day').format('x')
          this.dateFilterText = '今天'
          break
        case 'yesterday':
          this.registerTimeStartStamp = moment()
            .subtract(1, 'day')
            .startOf('day')
            .format('x')
          this.registerTimeEndStamp = moment()
            .subtract(1, 'day')
            .endOf('day')
            .format('x')
          this.dateFilterText = '昨天'
          break
        case 'thisMonth':
          this.registerTimeStartStamp = moment().startOf('month').format('x')
          this.registerTimeEndStamp = moment().endOf('month').format('x')
          this.dateFilterText = '本月'
          break
        case 'lastMonth':
          this.registerTimeStartStamp = moment()
            .subtract(1, 'month')
            .startOf('month')
            .format('x')
          this.registerTimeEndStamp = moment()
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
        this.getTableData()
      }
    })
    uni.$on(
      'rptReferralFilter',
      ({
        searchKey,
        doctorStaffId,
        institutionDepartmentId,
        oldDoctorStaffId,
        oldInstitutionDepartmentId,
      }) => {
        this.searchKey = searchKey
        this.doctorStaffId = doctorStaffId
        this.institutionDepartmentId = institutionDepartmentId
        this.oldDoctorStaffId = oldDoctorStaffId
        this.oldInstitutionDepartmentId = oldInstitutionDepartmentId

        this.init()

        if (
          searchKey ||
          doctorStaffId ||
          institutionDepartmentId ||
          oldDoctorStaffId ||
          oldInstitutionDepartmentId
        )
          this.isFilter = true
        else this.isFilter = false
      },
    )
  },
  onUnload() {
    uni.$off('chooseCalendarOption')
    uni.$off('emitPage')
    uni.$off('rptReferralFilter')
  },
  methods: {
    init() {
      this.current = 1
      this.getTableData()

      this.initFilterData()
    },
    initFilterData() {
      this.getDoctors()
      this.getDepartments()
    },
    async getDoctors() {
      const { data } = await institutionAPI.getWorkList({
        workStatus:
          this.$utils.getEnums('StaffStatus')?.STAFF_STATUS_AT_WORK_NAME
            ?.value || 1,
        position: this.$utils.getEnums('StaffPosition')?.DOCTOR?.value || 2,
      })
      uni.setStorageSync('referralDoctorList', data)
    },
    async getDepartments() {
      const { data } = await institutionAPI.getDepartmentList({
        status: 1,
        appointmentStatus: 1,
      })

      uni.setStorageSync(
        'referralDepartmentList',
        data?.map((i) => {
          i.name = i.institutionDepartmentName.zh_CN
          return i
        }) || [],
      )
    },
    async getTableData() {
      uni.showLoading({
        title: '数据加载中',
        mask: true,
      })
      this.dataSourceStatus = 'loading'
      const params = {}

      if (this.searchKey) params.searchKey = this.searchKey
      if (this.doctorStaffId) params.doctorStaffId = this.doctorStaffId
      if (this.institutionDepartmentId)
        params.institutionDepartmentId = this.institutionDepartmentId
      if (this.oldDoctorStaffId) params.oldDoctorStaffId = this.oldDoctorStaffId
      if (this.oldInstitutionDepartmentId)
        params.oldInstitutionDepartmentId = this.oldInstitutionDepartmentId

      const {
        data: { total, current, records },
      } = await billAPI.getReferralList({
        current: this.current,
        size: this.size,
        registerTimeStartStamp: this.registerTimeStartStamp,
        registerTimeEndStamp: this.registerTimeEndStamp,
        ...params,
      })
      records.forEach((el) => {
        el.referralTime = moment(el.referralTime).format('YYYY-MM-DD HH:mm:ss')
        el.registerTime = moment(el.registerTime).format('YYYY-MM-DD HH:mm:ss')

        el.gender = ['', '男', '女'][el.gender] || '未知'

        el.payAmount = this.$utils.formatPrice(el.payAmount)
      })
      if (this.current === 1) {
        this.contents = records
      } else {
        this.contents = this.contents.concat(records)
      }
      this.total = total
      this.current = current
      if (total <= this.contents.length) {
        this.dataSourceStatus = 'noMore'
      } else {
        this.dataSourceStatus = 'more'
      }
      uni.hideLoading()
    },
    onFilterClick() {
      // // 转入医生id
      // doctorStaffId: '',
      // // 转入科室id
      // institutionDepartmentId: '',
      // // 转出医生id
      // oldDoctorStaffId: '',
      // // 转出科室id
      // oldInstitutionDepartmentId: '',
      // searchKey: '',
      this.$utils.push({
        url: `/pages/reports/referralStat/filter?searchKey=${this.searchKey}&doctorStaffId=${this.doctorStaffId}&institutionDepartmentId=${this.institutionDepartmentId}&oldDoctorStaffId=${this.oldDoctorStaffId}&oldInstitutionDepartmentId=${this.oldInstitutionDepartmentId}`,
      })
    },
    openCalendar() {
      this.$refs.calendar.open()
    },
    confirmCalendar({ range, fulldate }) {
      const { before, after, data } = range
      if (data.length === 0) {
        this.registerTimeStartStamp = moment(fulldate)
          .startOf('day')
          .format('x')
        this.registerTimeEndStamp = moment(fulldate).endOf('day').format('x')
      } else {
        this.registerTimeStartStamp = moment(before).format('x')
        this.registerTimeEndStamp = moment(after).endOf('day').format('x')
      }
      this.dateFilterText = '自定义'
      this.init()
    },
    emitPage() {
      if (this.contents.length < this.total) {
        this.current += 1
        this.getTableData()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.rpt_referral {
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
