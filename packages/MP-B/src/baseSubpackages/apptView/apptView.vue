<template>
  <view class="apptView">
    <dpmsDrawer maskClose ref="dpmsDrawer">
      <view class="pv-32 ph-24 selectDrawer">
        <view class="title mb-32 ml-8">医生</view>
        <div class="doctorList">
          <view
            :class="{
              doctorDetail: true,
              selected: doctorItem.staffId === doctor.staffId,
            }"
            v-for="doctorItem in doctorList"
            :key="doctorItem.staffId"
            @click="onSelected(doctorItem)"
          >
            {{ doctorItem.staffName }}
          </view>
        </div>
      </view>
    </dpmsDrawer>

    <calendar
      :value="date"
      @collapseChange="collapseChange"
      @change="changeCalendar"
    />

    <view class="apptCardInfo">
      <view v-if="!showSearch" class="topGray" />
      <view v-if="showSearch">
        <dpmsSearch
          showCancel
          @cancel="cancel"
          @search="search"
          @clear="clear"
          placeholder="搜索"
          v-model="searchValueWithAppt"
        />
      </view>
      <view v-else class="curCardInfo">
        <view class="doctorName">医生：{{ doctor.staffName }}</view>
        <view class="rightCardInfo">
          <span class="iconfont icon-search" @click="showSearch = true" />
          <span class="iconfont icon-sliders" @click="openDrawer" />
        </view>
      </view>
    </view>

    <view
      v-if="showSearch"
      class="apptSearch overHidden pt-12"
      data-layout-grow
    >
      <scroll-view v-if="apptSearchList.length > 0" class="h100" scroll-y>
        <view class="apptSearchContent ph-24 pb-32">
          <apptCard
            v-for="apptInfo in apptSearchList"
            :key="apptInfo.appointmentId"
            :appt="apptInfo"
            :doctor="doctor"
          />
        </view>
      </scroll-view>
      <view class="tc mt-28 emptyPatient" v-else>
        请输入姓名/拼音/联系电话查找患者预约记录
      </view>
    </view>

    <dayTable
      ref="apptTable"
      :class="showSearch ? 'hidden' : ''"
      :style="{
        width: '100%',
        height: retract ? 'calc(100% - 286rpx)' : 'calc(100% - 686rpx)',
      }"
      :apptList="list"
      :chooseDateProp="date"
      :scheduleList="scheduleList"
      :retract="retract"
      @createAppt="createAppt"
      @editAppt="editAppt"
    />
  </view>
</template>

<script>
import moment from 'moment'
import _ from 'lodash'
import AsyncValidator from 'async-validator'
import institutionAPI from 'APIS/institution/institution.api'
import appointmentAPI from 'APIS/appointment/appointment.api'
import dayTable from '@/businessComponents/dayTable/dayTable'
import calendar from '@/businessComponents/calendar/calendar'
import { globalEventKeys } from 'config/global.eventKeys.js'
import apptCard from '@/businessComponents/apptCard/apptCard.vue'

const enums = uni.getStorageSync('enums')
const staff = uni.getStorageSync('staff')
const medicalInstitution = uni.getStorageSync('medicalInstitution')

const STAFF_POSITION_ENUM = enums.StaffPosition
const STAFF_STATUS_ENUM = enums.StaffStatus

const doctorValue = STAFF_POSITION_ENUM.DOCTOR.value

// 1、如果当前登录人为医生，则 默认为当前登录人员的预约视图
// 2、如果当前登录人不是医生，则默认为WEB端，排名第一的医生（不包含未指定医生）
const isDoctorWithLogin = staff.position === doctorValue

export default {
  name: 'apptView',
  data() {
    return {
      doctor: undefined,
      doctorList: [],
      allDoctorWithApptList: [], // 所以在职医生的预约列表
      retract: true, // 日历展开: false 收缩: true
      showSearch: false, // 搜索患者
      list: [],
      date: moment().format('YYYY-MM-DD'),
      startTimeStamp: moment().startOf('day').valueOf(),
      endTimeStamp: moment().endOf('day').valueOf(),
      apptSuccess: false,
      apptSearchList: [], // 模糊搜索列表
      searchValueWithAppt: '', // 模糊搜索的值
      scheduleList: [], // 排班列表
    }
  },
  onShow() {
    this.$refs.apptTable && this.$refs.apptTable.clearCreateMeet()
    this.getApptList()
    this.refreshDoctorWithApptList()
  },
  onLoad() {
    this.init()

    uni.$on(
      globalEventKeys.apptFormWithSaveSuccess,
      ({ isSuccess, params }) => {
        console.log('isSuccess', isSuccess, params)
        this.getApptList()
      },
    )
  },
  onUnload() {
    uni.$off(globalEventKeys.apptFormWithSaveSuccess)
  },
  watch: {
    date(newVal) {
      const dayMoment = moment(newVal)
      this.startTimeStamp = dayMoment.startOf('day').valueOf()
      this.endTimeStamp = dayMoment.endOf('day').valueOf()

      this.searchValueWithAppt = ''

      this.getApptList()
      this.refreshDoctorWithApptList()
    },
    showSearch(newVal) {
      if (newVal) {
        this.getAllDoctorWithApptList()
      }
    },
  },
  methods: {
    init() {
      this.getDoctor()
        .then((res) => {
          this.getApptScheduleInfo()

          this.getApptList()
        })
        .catch((err) => {
          console.log('staff not found')
        })
    },
    // 获取医生详情
    getDoctor() {
      return new Promise((resolve) => {
        if (isDoctorWithLogin) {
          if (!staff) reject()
          this.doctor = staff
          resolve()
        }

        // 获取在职医生列表
        institutionAPI
          .getStaffListByPosition({
            position: doctorValue,
            workStatus: STAFF_STATUS_ENUM.STAFF_STATUS_AT_WORK_NAME.value,
            includeUnspecified: true,
          })
          .then((res) => {
            !isDoctorWithLogin && (this.doctor = res.data[1])
            this.doctorList = res.data

            resolve()
          })
          .catch(() => {
            reject()
          })
      })
    },
    // 获取预约列表
    getApptList: _.debounce(function () {
      appointmentAPI
        .getAppointmentViewListFromStaff({
          appointmentBeginTime: this.startTimeStamp,
          appointmentEndTime: this.endTimeStamp,
          medicalInstitutionId: medicalInstitution.medicalInstitutionId,
          position: doctorValue,
          staffId: this.doctor.staffId,
          staffIds: this.doctor.staffId,
        })
        .then((res) => {
          res.data.forEach((v) => {
            v.startTimeStamp = v.appointmentBeginTimeStamp
            v.endTimeStamp = v.appointmentEndTimeStamp + 1
          })

          res.data.sort(
            (first, second) => second.startTimeStamp - second.endTimeStamp,
          )

          this.list = [
            {
              1: {
                list: res.data,
              },
            },
          ]
        })
        .catch()
    }, 300),
    // 获取排班详情
    getApptScheduleInfo() {
      institutionAPI
        .getApptScheduleList({
          scheduleBeginTime: this.startTimeStamp,
          scheduleEndTime: this.endTimeStamp,
          staffPositions: doctorValue,
          medicalInstitutionId: medicalInstitution.medicalInstitutionId,
          staffId: this.doctor.staffId,
        })
        .then((res) => {
          console.log('scheduleListWithDoctor', res.data)

          this.scheduleList =
            res.data[2].institutionScheduleTableMap[this.startTimeStamp]
        })
        .catch()
    },
    // 获取全部在职医生的预约列表
    getAllDoctorWithApptList() {
      return new Promise((resolve) => {
        appointmentAPI
          .getAppointmentViewListFromStaff({
            appointmentBeginTime: this.startTimeStamp,
            appointmentEndTime: this.endTimeStamp,
            medicalInstitutionId: medicalInstitution.medicalInstitutionId,
            position: doctorValue,
            staffIds: this.doctorList.map((doctor) => doctor.staffId).join(','),
          })
          .then((res) => {
            this.allDoctorWithApptList = res.data
            resolve()
          })
          .catch()
      })
    },
    collapseChange(val) {
      this.retract = val
    },
    cancel() {
      this.showSearch = false
    },
    search({ value }) {
      if (!value) return (this.apptSearchList = [])

      this.searchValueWithAppt = value
      const searchList = this.allDoctorWithApptList.filter((appt) => {
        const mobile = appt.patient.mobile
        const pinyin = appt.patient.pinyin
        const patientName = appt.patient.patientName

        return (
          mobile.indexOf(value) > -1 ||
          pinyin.indexOf(value) > -1 ||
          patientName.indexOf(value) > -1
        )
      })

      this.apptSearchList = searchList
    },
    clear() {
      this.searchValueWithAppt = ''
      this.apptSearchList = []
    },
    openDrawer() {
      this.$refs.dpmsDrawer.open()
    },
    changeCalendar({ fulldate }) {
      this.$refs.apptTable.clearCreateMeet()
      this.date = fulldate
    },
    createAppt(params) {
      this.$utils.push({
        url:
          '/baseSubpackages/apptForm/apptForm?type=createAppt&startTimeStamp=' +
          params.startTimeStamp +
          '&endTimeStamp=' +
          params.endTimeStamp +
          '&doctorId=' +
          this.doctor.staffId,
      })
    },
    editAppt(params) {
      this.$utils.push({
        url:
          '/baseSubpackages/apptForm/apptForm?type=editAppt&appointmentId=' +
          params.appointmentId +
          '&startTimeStamp=' +
          params.startTimeStamp +
          '&endTimeStamp=' +
          params.endTimeStamp,
      })
    },
    onSelected(doctor) {
      this.doctor = doctor
      this.$refs.dpmsDrawer.close()
      this.getApptList()
    },
    refreshDoctorWithApptList() {
      this.getAllDoctorWithApptList()
        .then(() => {
          this.search({ value: this.searchValueWithAppt })
        })
        .catch()
    },
  },
  components: {
    calendar,
    dayTable,
    apptCard,
  },
}
</script>

<style lang="scss" scoped>
page {
  width: 100%;
  height: 100%;
}
.apptView {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .apptCardInfo {
    position: relative;
    z-index: 1;

    .topGray {
      width: 100%;
      height: 20rpx;
    }
    .curCardInfo {
      background-color: #fff;
      box-sizing: border-box;
      padding: 0 24rpx 0 24rpx;
      font-size: 26rpx;
      width: 100%;
      height: 76rpx;
      line-height: 76rpx;
      box-shadow: 0 5rpx 10rpx rgba($color: #000000, $alpha: 0.15);
      display: flex;
      justify-content: space-between;

      .doctorName {
        font-size: 34rpx;
      }

      .rightCardInfo {
        color: $common-color;
        .iconfont {
          font-size: 34rpx;
        }
        span:first-child {
          margin-right: 30rpx;
        }
      }
    }
  }

  .apptSearch {
    flex: 1 1 100%;
    .apptSearchContent {
    }

    .emptyPatient {
      color: rgba(0, 0, 0, 0.65);
      font-size: 28rpx;
    }
  }
}
.selectDrawer {
  .title {
    color: rgba($color: #000000, $alpha: 0.9);
    font-size: 34rpx;
  }
  .doctorList {
    .doctorDetail {
      margin: 0 8rpx 24rpx 8rpx;
      display: inline-block;
      border-radius: 2rpx;
      height: 68rpx;
      line-height: 68rpx;
      background: #f5f5f5;
      font-size: 28rpx;
      text-align: center;
      padding: 0 32rpx;
      &.selected {
        color: rgba(92, 187, 137, 1);
        background-color: rgba(227, 251, 238, 1);
        background: #e3fbee;
      }
    }
  }
}
</style>
