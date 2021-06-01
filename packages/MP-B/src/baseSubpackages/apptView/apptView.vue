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
      v-if="hackVisible"
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
import diagnosisAPI from 'APIS/diagnosis/diagnosis.api.js'
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
const BLOCK_EVENT_TYPE_ENUM = commonUtil.getEnums('BlockEventType')

const POSITION_DOCTOR = STAFF_POSITION_ENUM.DOCTOR.value
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
      // 当前选中的医生，用于和drawer进行数据传递，init中初始化为全部医生
      drawerSelectedDoctorList: [],
      // 当前的预约列表
      appointmentList: [],
      // 当前的日程列表
      blockEventList: [],
      // 接入的机构：对于总部/大区，该值可以选择；其他，则为所在机构，不变
      accessMedicalInstitution: {},
      // 上一次的预约视图
      preAccessMedicalInstitution: {},
      // 检测是否为机构或者大区？具体含义未知，沿用之前判断
      isHeaderWithLargeArea: frontAuthUtil.check(
        '预约中心/预约视图/诊所的查询条件',
      ),
      // 所选机构的预约配置相关参数
      apptSetting: {},
      // 获取当前机构的业务规则配置信息
      medicalConfig: {},
      // 重置预约视图的hack变量
      hackVisible: false,
    }
  },
  watch: {
    // 每次doctorList更新，则写入storage，共doctorList选择使用
    doctorList(newVal) {
      uni.setStorageSync('doctorList', newVal)
    },
    // 每次视图关联的doctor变更，则写入storage
    drawerSelectedDoctorList(newVal) {
      uni.setStorageSync('drawerSelectedDoctorList', newVal)
    },
    accessMedicalInstitution(newVal) {
      uni.setStorageSync('accessMedicalInstitution', newVal)
    },
    medicalConfig(newVal) {
      uni.setStorageSync('currentMedicalInstitutionConfig', newVal)
    },
  },
  computed: {
    ...mapState('workbenchStore', {
      medicalInstitution: (state) => state.medicalInstitution,
    }),
    // 预约视图数据请求的开始时间
    appointmentBeginTime() {
      return moment(this.calendarDate).startOf('day').valueOf()
    },
    // 预约视图数据请求的结束时间
    appointmentEndTime() {
      return moment(this.calendarDate).endOf('day').valueOf()
    },
    actualApptViewDoctors() {
      const isAll =
        this.drawerSelectedDoctorList.length === 1 &&
        this.drawerSelectedDoctorList[0].staffId === 'all'

      return isAll ? this.doctorList : this.drawerSelectedDoctorList
    },
    reqStaffIds() {
      return this.actualApptViewDoctors.map((d) => d.staffId).join(',')
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
      return data2schedulerGroup(this.actualApptViewDoctors)
    },
    schedulerGroupCount() {
      const groupCount = this.schedulerGroup.length
      return Math.min(groupCount, 4)
    },
    schedulerHourParts() {
      // 预约的最小时间刻度和登陆用户的机构关联
      return 60 / (this.apptSetting.appointmentDuration || 30)
    },
  },
  onLoad() {
    this.initData()
    this.initEvent()
  },
  onUnload() {
    uni.$off(globalEventKeys.apptFormWithSaveSuccess)
    uni.$off(globalEventKeys.cancleApptSuccess)
    uni.$off(globalEventKeys.onSelectApptViewDoctor)
    uni.removeStorageSync('doctorList')
    uni.removeStorageSync('drawerSelectedDoctorList')
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
        .concat('&type=createAppt')
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
      this.drawerSelectedDoctorList = [
        {
          staffId: 'all',
          staffName: '全部医生',
          position: 2,
        },
      ]
      // 3. 获取医生列表和预约列表
      const { data: doctorList } = await getDoctorListByInstitutionId(
        this.accessMedicalInstitution.medicalInstitutionId,
      )
      this.doctorList = doctorList

      await this.refreshApptViewList()

      const { data: config } = await diagnosisAPI.getWeakFlow()
      this.medicalConfig = config

      this.$utils.hidePageLoading()
    },
    initEvent() {
      uni.$on(globalEventKeys.onSelectApptViewDoctor, (data) => {
        const {
          doctorList,
          selectedDoctorList,
          accessMedicalInstitution,
        } = data
        this.doctorList = doctorList
        this.preAccessMedicalInstitution = this.accessMedicalInstitution
        this.accessMedicalInstitution = accessMedicalInstitution
        this.drawerSelectedDoctorList = selectedDoctorList
        this.refreshApptViewList()
      })
      uni.$on(globalEventKeys.apptFormWithSaveSuccess, () => {
        // form创建成功
        this.refreshApptViewList()
      })
      uni.$on(globalEventKeys.cancleApptSuccess, () => {
        // form取消成功
        this.refreshApptViewList()
      })
    },
    async refreshApptViewList() {
      if (
        this.drawerSelectedDoctorList.length === 0 ||
        !this.accessMedicalInstitution
      ) {
        return
      }
      this.$utils.showPageLoading()
      // 1. 请求预约刻度信息
      const { data: apptSetting } = await appointmentAPI.getSetting({
        medicalInstitutionId: this.accessMedicalInstitution
          .medicalInstitutionId,
      })
      this.apptSetting = apptSetting

      // 若当前机构与上一个机构有变化则重置视图
      if (
        this.preAccessMedicalInstitution.medicalInstitutionId !==
        this.accessMedicalInstitution.medicalInstitutionId
      ) {
        this.resetScheduler()
      }

      // 2. 请求预约数据
      const {
        data: appointmentList,
      } = await appointmentAPI.getAppointmentViewListFromStaff({
        appointmentBeginTime: this.appointmentBeginTime,
        appointmentEndTime: this.appointmentEndTime,
        medicalInstitutionId: this.accessMedicalInstitution
          .medicalInstitutionId,
        position: POSITION_DOCTOR,
        staffIds: this.reqStaffIds,
      })
      this.appointmentList = appointmentList

      // 3. 请求日程数据
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

      this.$utils.hidePageLoading()
    },
    resetScheduler() {
      this.hackVisible = false
      this.$nextTick(() => {
        this.hackVisible = true
      })
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
