<template>
  <view class="apptView">
    <doctor-drawer ref="doctorDrawer" />
    <calendar
      :value="calendarDate"
      @change="dateChange"
      @collapseChange="collapseChange"
    />
    <view style="height: 10px;" />
    <scheduler
      :isAll="true"
      :height="schedulerHeight"
      :currentDate="calendarDate"
      :columnGroup="schedulerGroup"
      :resources="schedulerResources"
      :hourParts="schedulerHourParts"
      :displayGroupCount="schedulerGroupCount"
      @menu="onMenu"
      @detail="onDetail"
      @newAppointment="onCreateAppointment"
      @changeAppointment="onChangeAppointment"
    />
  </view>
</template>

<script>
import moment from 'moment'
import _ from 'lodash'
import institutionAPI from 'APIS/institution/institution.api'
import appointmentAPI from 'APIS/appointment/appointment.api'
import calendar from '@/businessComponents/calendar/calendar'
import scheduler from '@/businessComponents/scheduler/scheduler'
import { commonUtil } from 'mpcommon'
import {
  data2schedulerGroup,
  appointment2schedulerResource,
  blockEvent2schedulerResource,
  findInstitutionInTree,
  getDoctorListByInstitutionId,
} from './utils'
import { mapState } from 'vuex'
import { globalEventKeys } from 'config/global.eventKeys'
import { frontAuthUtil } from '@/utils/frontAuth.util'
import { apptDataService } from '@/baseSubpackages/apptForm/apptData.service'
import doctorDrawer from './doctorDrawer'

const STAFF_POSITION_ENUM = commonUtil.getEnums('StaffPosition')
const INSTITUTION_CHAIN_TYPE_ENUM = commonUtil.getEnums('InstitutionChainType')
const BLOCK_EVENT_TYPE_ENUM = commonUtil.getEnums('BlockEventType')

const POSITION_DOCTOR = STAFF_POSITION_ENUM.DOCTOR.value
const INSTITUTION_CHAIN = INSTITUTION_CHAIN_TYPE_ENUM.CHAIN.value
const INSTITUTION_REGIONAL = INSTITUTION_CHAIN_TYPE_ENUM.REGIONAL.value
const STAFF_BLOCK = BLOCK_EVENT_TYPE_ENUM.STAFF_BLOCK_EVENT.value

export default {
  name: 'apptView',
  components: {
    calendar,
    scheduler,
    doctorDrawer,
  },
  data() {
    return {
      // 日历组件日期
      calendarDate: moment().format('YYYY-MM-DD'),
      // 日历组件展开搜索状态
      calendarCollapsed: true,
      // 可选的医生列表：对于总部/大区，会根据机构的选择动态变化
      doctorList: [],
      // 当前预约显示的医生，init中初始化为全部医生
      apptViewDoctor: null,
      // 当前的预约列表
      appointmentList: [],
      // 当前的日程列表
      blockEventList: [],
      // 接入的机构：对于总部/大区，该值可以选择；其他，则为所在机构，不变
      accessMedicalInstitution: {},
      // 检测是否为机构或者大区？具体含义未知，沿用之前判断
      isHeaderWithLargeArea: frontAuthUtil.check(
        '预约中心/预约视图/诊所的查询条件',
      ),
    }
  },
  watch: {
    // 每次doctorList更新，则写入storage，共doctorList选择使用
    doctorList(newVal) {
      uni.setStorageSync('doctorList', newVal)
    },
    // 每次视图关联的doctor变更，则写入storage
    apptViewDoctor(newVal) {
      uni.setStorageSync('apptViewDoctor', newVal)
    },
    accessMedicalInstitution(newVal) {
      uni.setStorageSync('accessMedicalInstitution', newVal)
    },
  },
  computed: {
    ...mapState('workbenchStore', {
      medicalInstitution: (state) => state.medicalInstitution,
      apptSetting: (state) => state.apptSetting,
    }),
    // 预约视图数据请求的开始时间
    appointmentBeginTime() {
      return moment(this.calendarDate).startOf('day').valueOf()
    },
    // 预约视图数据请求的结束时间
    appointmentEndTime() {
      return moment(this.calendarDate).endOf('day').valueOf()
    },
    // 预约视图中数据请求需要的医生列表
    staffIds() {
      if (!this.apptViewDoctor) {
        return ''
      }
      const { staffId } = this.apptViewDoctor
      return staffId === 'all'
        ? this.doctorList.map((d) => d.staffId).join(',')
        : staffId
    },
    schedulerHeight() {
      const calendarHeightRpx = this.calendarCollapsed ? 192 : 592
      return this.$systemInfo.windowHeight - uni.upx2px(calendarHeightRpx) - 10
    },
    schedulerResources() {
      return []
        .concat(appointment2schedulerResource(this.appointmentList))
        .concat(blockEvent2schedulerResource(this.blockEventList))
    },
    schedulerGroup() {
      const doctor = this.apptViewDoctor
      if (!doctor) {
        return []
      } else if (doctor.staffId === 'all') {
        return data2schedulerGroup(this.doctorList)
      } else {
        return data2schedulerGroup([doctor])
      }
    },
    schedulerGroupCount() {
      const groupCount = this.schedulerGroup.length
      return Math.min(groupCount, 4)
    },
    schedulerHourParts() {
      // 预约的最小时间刻度和登陆用户的机构关联
      return 60 / this.apptSetting.appointmentDuration
    },
  },
  onLoad() {
    this.initData()
    this.initEvent()
  },
  onUnload() {
    uni.$off(globalEventKeys.apptFormWithSaveSuccess)
    uni.$off(globalEventKeys.onSelectApptViewDoctor)
    uni.removeStorageSync('doctorList')
    uni.removeStorageSync('apptViewDoctor')
    uni.removeStorageSync('accessMedicalInstitution')
  },
  methods: {
    collapseChange(status) {
      this.calendarCollapsed = status
    },
    dateChange({ fulldate }) {
      this.calendarDate = fulldate
      this.refreshApptViewList()
    },
    onMenu() {
      this.$refs.doctorDrawer.open()
    },
    onCreateAppointment({ detail }) {
      const { begin, end, group } = detail
      const url = '/baseSubpackages/apptForm/apptForm?type=createAppt'
        .concat(`&startTimeStamp=${begin.valueOf()}`)
        .concat(`&endTimeStamp=${end.valueOf()}`)
        .concat(`&doctorId=${group.key}`)
      this.$utils.push({ url })
    },
    onChangeAppointment({ detail }) {
      const { origin, change, confirm } = detail

      // 找到对于的预约数据，填入新的时间
      let changedAppointment = this.appointmentList.find(
        (appt) => appt.appointmentId === origin.id,
      )
      changedAppointment = {
        ...changedAppointment,
        appointmentBeginTimeStamp: change.begin.valueOf(),
        appointmentEndTimeStamp: change.end.valueOf(),
      }

      // 这里会根据具体情况进行弹框确认
      apptDataService.getApptVerify(
        changedAppointment,
        // 确认后进行更新，刷新预约视图
        () => {
          appointmentAPI
            .updateAppointment({
              appointmentJsonStr: JSON.stringify(changedAppointment),
            })
            .then(() => {
              confirm(true)
              this.refreshApptViewList()
            })
        },
        () => {
          // 取消，则预约回归到原始位置，不做任何处理
          confirm(false)
        },
      )
    },
    onDetail({ detail }) {
      this.$utils.push({
        url: '/baseSubpackages/apptForm/apptDetail?appointmentId=' + detail.id,
      })
    },
    async initData() {
      this.$utils.showPageLoading()
      // 1. 设置访问机构。对于总部/大区，访问机构需先获取上一次访问的机构；对于非总部/大区，访问机构则为登录人当前机构
      if (this.isHeaderWithLargeArea) {
        const {
          data: institutionTree,
        } = await institutionAPI.getInstitutionList({
          medicalInstitutionId: this.medicalInstitution.medicalInstitutionId,
          institutionChainTypes: `${INSTITUTION_CHAIN},${INSTITUTION_REGIONAL}`,
        })

        const {
          data: lastAccessInstitutionId,
        } = await appointmentAPI.getLastAccessMedicalInstitution()

        if (lastAccessInstitutionId !== -1) {
          let institution = findInstitutionInTree(
            institutionTree,
            lastAccessInstitutionId,
          )
          if (institution) {
            this.accessMedicalInstitution = institution
          } else {
            this.accessMedicalInstitution = this.medicalInstitution
          }
        }
      } else {
        this.accessMedicalInstitution = this.medicalInstitution
      }
      // 2. 初始化为所有医生
      this.apptViewDoctor = {
        staffId: 'all',
        staffName: '全部医生',
        position: 2,
      }
      // 3. 获取医生列表和预约列表
      const { data: doctorList } = await getDoctorListByInstitutionId(
        this.accessMedicalInstitution.medicalInstitutionId,
      )
      this.doctorList = doctorList

      await this.refreshApptViewList()
      this.$utils.hidePageLoading()
    },
    initEvent() {
      uni.$on(globalEventKeys.onSelectApptViewDoctor, (doctor) => {
        this.doctorList = uni.getStorageSync('doctorList')
        this.accessMedicalInstitution = uni.getStorageSync(
          'accessMedicalInstitution',
        )
        this.apptViewDoctor = doctor
        this.refreshApptViewList()
      })
      uni.$on(globalEventKeys.apptFormWithSaveSuccess, () =>
        this.refreshApptViewList(),
      )
    },
    async refreshApptViewList() {
      if (!this.apptViewDoctor || !this.accessMedicalInstitution) {
        return
      }

      // 1. 请求预约数据
      const {
        data: appointmentList,
      } = await appointmentAPI.getAppointmentViewListFromStaff({
        appointmentBeginTime: this.appointmentBeginTime,
        appointmentEndTime: this.appointmentEndTime,
        medicalInstitutionId: this.accessMedicalInstitution
          .medicalInstitutionId,
        position: POSITION_DOCTOR,
        staffId: this.apptViewDoctor.staffId,
        staffIds: this.staffIds,
      })
      this.appointmentList = appointmentList

      // 2. 请求日程数据
      const {
        data: blockEventList,
      } = await appointmentAPI.getApptBlockListByStaff({
        blockBeginTime: this.appointmentBeginTime,
        blockEndTime: this.appointmentEndTime,
        medicalInstitutionId: this.accessMedicalInstitution
          .medicalInstitutionId,
        blockEventType: STAFF_BLOCK,
        businessIds: this.staffIds,
      })
      this.blockEventList = blockEventList
    },
  },
}
</script>

<style lang="scss" scoped>
page {
  width: 100%;
  height: 100%;
}
</style>
