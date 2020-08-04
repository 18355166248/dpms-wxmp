<template>
  <view class="apptView">
    <dpmsDrawer maskClose ref="dpmsDrawer" width="320" />

    <calendar
      :value="date"
      @collapseChange="collapseChange"
      @change="changeCalendar"
    />

    <view class="apptCardInfo">
      <view class="topGray"></view>
      <view v-if="showSearch">
        <dpmsSearch
          showCancel
          @cancel="cancel"
          @change="change"
          @search="search"
        />
      </view>
      <view v-else class="curCardInfo">
        <view>医生: {{ doctor.staffName }}</view>
        <view class="rightCardInfo">
          <span class="iconfont icon-search" @click="showSearch = true" />
          <span class="iconfont icon-menu" @click="openDrawer" />
        </view>
      </view>
    </view>

    <view v-if="showSearch">
      <view class="tc mt-20">请输入姓名/拼音/联系电话查找患者预约记录</view>
    </view>
    <dayTable
      :class="showSearch ? 'hidden' : ''"
      :style="{
        width: '100%',
        height: retract ? 'calc(100% - 284rpx)' : 'calc(100% - 724rpx)',
      }"
      :apptList="list"
      :chooseDateProp="date"
    />
  </view>
</template>

<script>
import moment from 'moment'
import AsyncValidator from 'async-validator'
import institutionAPI from 'APIS/institution/institution.api'
import appointmentAPI from 'APIS/appointment/appointment.api'
import dayTable from '@/businessComponents/dayTable/dayTable'
import calendar from '@/businessComponents/calendar/calendar'

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
      retract: true, // 日历展开: false 收缩: true
      showSearch: false, // 搜索患者
      list: [],
      date: moment().format('YYYY-MM-DD'),
    }
  },
  onLoad() {
    this.init()
  },
  watch: {
    date(newVal) {
      this.getApptList()
      // this.list = [
      //   {
      //     1: {
      //       list: [
      //         {
      //           meetingName: '1',
      //           // startTime: '2020-07-22 10:00:00',
      //           startTimeStamp: 1595642400000,
      //           endTimeStamp: 1595646000000,
      //         },
      //         {
      //           meetingName: '2',
      //           startTimeStamp: 1595638800000,
      //           endTimeStamp: 1595645100000,
      //         },
      //         {
      //           meetingName: '3',
      //           startTimeStamp: 1595646900000,
      //           endTimeStamp: 1595651400000,
      //         },
      //       ],
      //     },
      //   },
      // ]
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
              console.log('getStaffListByPosition', res)
              this.doctor = res.data[1]

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
          console.log(res.data)
          res.data.forEach((v) => {
            v.startTimeStamp = v.appointmentBeginTimeStamp
            v.endTimeStamp = v.appointmentEndTimeStamp + 1
          })

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
    search(value) {
      console.log('search', value)
    },
    change(value) {
      console.log('change', value)
    },
    openDrawer() {
      this.$refs.dpmsDrawer.open()
    },
    changeCalendar({ fulldate }) {
      this.date = fulldate
    },
  },
  components: {
    calendar,
    dayTable,
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
      height: 16rpx;
      background-color: #f2f3f5;
    }
    .curCardInfo {
      box-sizing: border-box;
      padding: 0 8px;
      font-size: 26rpx;
      width: 100%;
      height: 55rpx;
      line-height: 55rpx;
      box-shadow: 0 5rpx 8rpx #00000033;
      display: flex;
      justify-content: space-between;

      .rightCardInfo {
        span:first-child {
          font-size: 32rpx;
          margin-right: 10rpx;
        }
        span:last-child {
          font-size: 30rpx;
        }
      }
    }
  }
}
</style>
