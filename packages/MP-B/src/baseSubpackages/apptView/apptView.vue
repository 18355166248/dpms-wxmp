<template>
  <view class="apptView">
    <dpmsDrawer maskClose ref="dpmsDrawer" @change="onDrawerChange">
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
          placeholder="搜索"
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
      <scroll-view v-if="apptSearchList" class="h100" scroll-y>
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
import apptCard from './apptCard.vue'

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
      retract: true, // 日历展开: false 收缩: true
      showSearch: false, // 搜索患者
      list: [],
      date: moment().format('YYYY-MM-DD'),
      apptSuccess: false,
      apptSearchList: undefined, // 模糊搜索列表
    }
  },
  onLoad() {
    this.init()

    uni.$on(
      globalEventKeys.apptFormWithSaveSuccess,
      ({ isSuccess, params }) => {
        console.log('isSuccess', isSuccess, params)
        this.$refs.apptTable.clearCreateMeet()
        this.getApptList()
      },
    )
  },
  onUnload() {
    uni.$off(globalEventKeys.apptFormWithSaveSuccess)
  },
  watch: {
    date(newVal) {
      this.getApptList()
    },
  },
  methods: {
    init() {
      this.getDoctor()
        .then((res) => {
          console.log(res)
          this.getApptList()
        })
        .catch()
    },
    // 获取医生详情
    getDoctor() {
      return new Promise((resolve) => {
        if (isDoctorWithLogin) {
          this.doctor = staff
          resolve()
        } else {
          // 获取在职医生列表
          institutionAPI
            .getStaffListByPosition({
              position: doctorValue,
              workStatus: STAFF_STATUS_ENUM.STAFF_STATUS_AT_WORK_NAME.value,
              includeUnspecified: true,
            })
            .then((res) => {
              this.doctor = res.data[1]
              this.doctorList = res.data

              resolve()
            })
            .catch()
        }
      })
    },
    // 获取预约列表
    getApptList() {
      const dayMoment = moment(this.date)
      const startTimeStamp = dayMoment.startOf('day').valueOf()
      const endTimeStamp = dayMoment.endOf('day').valueOf()

      appointmentAPI
        .getAppointmentViewListFromStaff({
          appointmentBeginTime: startTimeStamp,
          appointmentEndTime: endTimeStamp,
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
    },
    collapseChange(val) {
      this.retract = val
    },
    cancel() {
      this.showSearch = false
    },
    search({ value }) {
      console.log('search', value)
    },
    openDrawer() {
      this.$refs.dpmsDrawer.open()
    },
    changeCalendar({ fulldate }) {
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
    onDrawerChange(value) {
      if (value && this.doctorList.length === 0) {
        institutionAPI
          .getStaffListByPosition({
            position: doctorValue,
            workStatus: STAFF_STATUS_ENUM.STAFF_STATUS_AT_WORK_NAME.value,
            includeUnspecified: true,
          })
          .then((res) => {
            this.doctorList = res.data
          })
          .catch()
      }
    },
    onSelected(doctor) {
      this.doctor = doctor
      this.$refs.dpmsDrawer.close()
      this.getApptList()
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
