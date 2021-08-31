<template>
  <view class="rpt_triage">
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
          label: '分诊时间',
          key: 'triageTime',
          width: 240,
        },
        {
          label: '挂号时间',
          key: 'registerTime',
          width: 240,
        },
        {
          label: '就诊类型',
          key: 'visTypeName',
        },
        {
          label: '病历号',
          key: 'medicalRecordNo',
          width: 440,
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
          label: '分诊咨询师',
          key: 'triageConsultedStaffName',
        },
        {
          label: '医生',
          key: 'doctorStaffName',
        },
        {
          label: '科室',
          key: 'institutionDepartmentName',
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
      // 医生id
      doctorStaffId: '',
      // 科室id
      institutionDepartmentId: '',
      // 分诊咨询师id
      triageConsultedStaffId: '',
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
      'rptTriageFilter',
      ({
        searchKey,
        doctorStaffId,
        institutionDepartmentId,
        triageConsultedStaffId,
      }) => {
        this.searchKey = searchKey
        this.doctorStaffId = doctorStaffId
        this.institutionDepartmentId = institutionDepartmentId
        this.triageConsultedStaffId = triageConsultedStaffId

        this.init()

        if (
          searchKey ||
          doctorStaffId ||
          institutionDepartmentId ||
          triageConsultedStaffId
        )
          this.isFilter = true
        else this.isFilter = false
      },
    )
  },
  onUnload() {
    uni.$off('chooseCalendarOption')
    uni.$off('emitPage')
    uni.$off('rptTriageFilter')
  },
  methods: {
    init() {
      this.current = 1
      this.getTableData()

      this.initFilterData()
    },
    initFilterData() {
      this.getDoctors()
      this.getConsultants()
      this.getDepartments()
    },
    async getDoctors() {
      const { data } = await institutionAPI.getWorkList({
        workStatus:
          this.$dpmsUtils.getEnums('StaffStatus')?.STAFF_STATUS_AT_WORK_NAME
            ?.value || 1,
        position: this.$dpmsUtils.getEnums('StaffPosition')?.DOCTOR?.value || 2,
      })
      uni.setStorageSync('triageDoctorList', data)
    },
    async getConsultants() {
      const { data } = await institutionAPI.getWorkList({
        workStatus:
          this.$dpmsUtils.getEnums('StaffStatus')?.STAFF_STATUS_AT_WORK_NAME
            ?.value || 1,
        position:
          this.$dpmsUtils.getEnums('StaffPosition')?.CONSULTANT?.value || 4,
      })
      uni.setStorageSync('triageConsultantList', data)
    },
    async getDepartments() {
      const { data } = await institutionAPI.getDepartmentList({
        status: 1,
        appointmentStatus: 1,
      })

      uni.setStorageSync(
        'triageDepartmentList',
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
      if (this.triageConsultedStaffId)
        params.triageConsultedStaffId = this.triageConsultedStaffId

      const {
        data: { total, current, records },
      } = await billAPI.getTriageList({
        current: this.current,
        size: this.size,
        registerTimeStartStamp: this.registerTimeStartStamp,
        registerTimeEndStamp: this.registerTimeEndStamp,
        ...params,
      })
      records.forEach((el) => {
        el.triageTime = moment(el.triageTime).format('YYYY-MM-DD HH:mm:ss')
        el.registerTime = moment(el.registerTime).format('YYYY-MM-DD HH:mm:ss')

        el.gender = ['', '男', '女'][el.gender] || '未知'

        el.payAmount = this.$dpmsUtils.formatPrice(el.payAmount)
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
      // // 医生id
      // doctorStaffId: '',
      // // 科室id
      // institutionDepartmentId: '',
      // // 分诊咨询师id
      // triageConsultedStaffId: '',
      // searchKey: '',
      this.$dpmsUtils.push({
        url: `/pages/reports/triageStat/filter?searchKey=${this.searchKey}&doctorStaffId=${this.doctorStaffId}&institutionDepartmentId=${this.institutionDepartmentId}&triageConsultedStaffId=${this.triageConsultedStaffId}`,
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
.rpt_triage {
  background: rgba(0, 0, 0, 0.04);

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
