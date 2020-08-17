<template>
  <view class="apptViewPage">
    <view v-if="accessMedicalInstitution === -1" class="emptyInstitution">
      <span>无下属直营诊所，无法查看预约视图</span>
    </view>
    <view class="apptView" v-else>
      <!-- <dpmsDrawer maskClose ref="dpmsDrawer" :width="750">

      </dpmsDrawer> -->

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
          <view class="leftCardInfo">
            <view
              class="doctorName pr-48 text-ellipsis"
              v-if="isHeaderWithLargeArea"
              >诊所：{{
                (accessMedicalInstitution &&
                  accessMedicalInstitution.medicalInstitutionSimpleCode) ||
                ''
              }}</view
            >
            <view
              class="doctorName doctorSelect"
              :style="{ maxWidth: isHeaderWithLargeArea ? '50%' : '100%' }"
            >
              <span class="text-ellipsis doctorShowName">
                医生：{{ doctor.staffName || '' }}
              </span>
              <span @click="openDrawer" class="pl-20 changeDoctorIcon">
                <span class="iconfont icon-new-weet" />
              </span>
            </view>
          </view>
          <view class="rightCardInfo">
            <view @click="showSearch = true">
              <span class="iconfont icon-search" />
            </view>
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
        @changeCard="changeCard"
      />
    </view>
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
import { apptFormUtil } from '@/baseSubpackages/apptForm/apptForm.util'
import { frontAuthUtil } from '@/utils/frontAuth.util'
import { apptViewUtil } from './apptView.util'
import { mapState } from 'vuex'

const defaultScheduleList = [
  {
    allowAppointmentStatus: 1,
    beginTimeMilliSecond: 0,
    endTimeMilliSecond: 86340000,
  },
]

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
      institutionInfo: {}, // 总部/大区诊所选择信息
      isHeaderWithLargeArea: frontAuthUtil.check(
        '预约中心/预约视图/诊所的查询条件',
      ),
      institutionList: [], // 总部/大区 诊所列表
      accessMedicalInstitution: {}, // 获取总部/大区时 预约视图诊所选择 如果后台返回-1表示没有直营诊所 则提示：“无下属直营诊所，无法查看预约视图”
      institutionCanSelectList: [], // 总部/大区 诊所列表 可编辑id(medicalInstitutionId)
      STAFF_POSITION_ENUM: this.$utils.getEnums('StaffPosition'),
      STAFF_STATUS_ENUM: this.$utils.getEnums('StaffStatus'),
      INSTITUTION_CHAIN_TYPE_ENUM: this.$utils.getEnums('InstitutionChainType'),
      staff: uni.getStorageSync('staff'),
      doctorValue: null,
      isDoctorWithLogin: true,
    }
  },
  computed: {
    ...mapState('workbenchStore', {
      medicalInstitution: (state) => state.medicalInstitution,
    }),
  },
  onShow() {
    this.$refs.apptTable && this.$refs.apptTable.clearCreateMeet()
    this.getApptList()
    this.refreshDoctorWithApptList()
  },
  onLoad() {
    this.$utils.showPageLoading()

    this.doctorValue =
      this.STAFF_POSITION_ENUM && this.STAFF_POSITION_ENUM.DOCTOR.value

    // 1、如果当前登录人为医生，则 默认为当前登录人员的预约视图
    // 2、如果当前登录人不是医生，则默认为WEB端，排名第一的医生（不包含未指定医生）
    this.isDoctorWithLogin = this.staff.position === this.doctorValue
    this.init()
      .finally(() => {
        console.log('finally')
        setTimeout(() => {
          this.$utils.hidePageLoading()
        }, 50)
      })
      .catch((err) => {
        console.error('初始化错误', err)
      })

    uni.$on(
      globalEventKeys.apptFormWithSaveSuccess,
      ({ isSuccess, params }) => {
        console.log('isSuccess', isSuccess, params)
        this.getApptList()
      },
    )
    // 预约视图选择医生后返回预约视图页面
    uni.$on(globalEventKeys.onSelectedDcotorWithApptView, (doctor) => {
      this.accessMedicalInstitution = uni.getStorageSync(
        'accessMedicalInstitution',
      )
      this.doctorList = uni.getStorageSync('doctorList')
      this.doctor = uni.getStorageSync('apptViewdoctor')
      this.onSelected(doctor)
    })
    uni.$on(
      globalEventKeys.getDoctorListByPosition,
      (accessMedicalInstitution) => {
        this.getDoctorListByPosition(
          accessMedicalInstitution.medicalInstitutionId,
        ).then((res) => {
          uni.$emit(globalEventKeys.updateDoctorListByPosition, res.data)
        })
      },
    )
  },
  watch: {
    date(newVal) {
      const dayMoment = moment(newVal)
      this.startTimeStamp = dayMoment.startOf('day').valueOf()
      this.endTimeStamp = dayMoment.endOf('day').valueOf()

      this.searchValueWithAppt = ''

      this.getApptList()
      this.getApptScheduleInfo()
      this.refreshDoctorWithApptList()
    },
    showSearch(newVal) {
      if (newVal) {
        this.getAllDoctorWithApptList()
      }
    },
    medicalInstitution(newVal) {
      this.accessMedicalInstitution = newVal
    },
    accessMedicalInstitution(newVal) {
      console.log('accessMedicalInstitution', newVal)
      uni.setStorageSync('accessMedicalInstitution', newVal)
    },
    doctorList(newVal) {
      uni.setStorageSync('doctorList', newVal)
    },
    doctor(newVal) {
      uni.setStorageSync('apptViewdoctor', newVal)
    },
    institutionList(newVal) {
      uni.setStorageSync('institutionList', newVal)
    },
    institutionCanSelectList(newVal) {
      uni.setStorageSync('institutionCanSelectList', newVal)
    },
  },
  onUnload() {
    uni.$off(globalEventKeys.apptFormWithSaveSuccess)
    uni.$off(globalEventKeys.onSelectedDcotorWithApptView)
    uni.$off(globalEventKeys.getDoctorListByPosition)
    uni.removeStorageSync('accessMedicalInstitution')
    uni.removeStorageSync('doctorList')
    uni.removeStorageSync('apptViewdoctor')
    uni.removeStorageSync('institutionList')
    uni.removeStorageSync('institutionCanSelectList')
  },
  methods: {
    async init() {
      // 如果是总部/大区 需要获取诊所列表
      if (this.isHeaderWithLargeArea) {
        let [err, res] = await this.$utils.asyncTasks(
          institutionAPI.getInstitutionList({
            medicalInstitutionId: this.medicalInstitution.medicalInstitutionId,
            institutionChainTypes:
              this.INSTITUTION_CHAIN_TYPE_ENUM.CHAIN.value +
              ',' +
              this.INSTITUTION_CHAIN_TYPE_ENUM.REGIONAL.value,
          }),
        )

        if (err) return Promise.reject(err)

        this.institutionList = [res.data]
        // 获取预约视图总部/大区时 诊所选择的值
        ;[err, res] = await this.$utils.asyncTasks(
          appointmentAPI.getLastAccessMedicalInstitution(),
        )

        if (err) return Promise.reject(err)

        this.accessMedicalInstitution = res.data

        const canSelectList = apptViewUtil.findCanSelectId(
          this.institutionList,
          'medicalInstitutionId',
          'childMedicalInstitutionList',
          frontAuthUtil.canSelect,
        )

        this.institutionCanSelectList = canSelectList
        uni.setStorageSync('institutionCanSelectList', canSelectList)

        if (this.accessMedicalInstitution !== -1) {
          const info = apptViewUtil.findSelectInfo(
            _.cloneDeep(this.institutionList),
            'medicalInstitutionId',
            'childMedicalInstitutionList',
            this.accessMedicalInstitution,
          )
          this.accessMedicalInstitution = info
          ;[err, res] = await this.$utils.asyncTasks(this.getDoctor())

          if (err) return Promise.reject('staff not found', err)

          try {
            this.getApptList()
            ;[err, res] = await this.$utils.asyncTasks(
              this.getApptScheduleInfo(),
            )

            if (err) return Promise.reject(err)

            return true
          } catch (err) {
            return Promise.reject(err)
          }
        } else {
          return true
        }
      } else {
        let [err, res] = await this.$utils.asyncTasks(this.getDoctor())

        if (err) return Promise.reject('staff not found', err)

        try {
          this.getApptList()
          ;[err, res] = await this.$utils.asyncTasks(this.getApptScheduleInfo())

          if (err) return Promise.reject(err)

          return true
        } catch (err) {
          return Promise.reject(err)
        }
      }
    },
    // 获取医生详情
    getDoctor() {
      return new Promise((resolve, reject) => {
        if (this.isDoctorWithLogin) {
          if (!this.staff) reject()
          this.doctor = this.staff
          resolve()
        }

        // 获取在职医生列表
        this.getDoctorListByPosition().then(() => resolve())
      })
    },
    // 获取在职医生列表
    getDoctorListByPosition(medicalInstitutionId) {
      return new Promise((resolve, reject) => {
        institutionAPI
          .getStaffListByPosition({
            position: this.doctorValue,
            workStatus: this.STAFF_STATUS_ENUM.STAFF_STATUS_AT_WORK_NAME.value,
            includeUnspecified: true,
            medicalInstitutionId:
              medicalInstitutionId ||
              this.accessMedicalInstitution.medicalInstitutionId,
          })
          .then((res) => {
            if (!this.isDoctorWithLogin) {
              let doctor = []
              if (res.data.length === 0) {
                doctor = { staffId: -1, staffName: '未指定医生', position: 2 }
              }

              if (res.data.length === 1) {
                doctor = res.data[0]
              }

              if (res.data.length > 1) {
                if (res.data[0].staffId === -1) doctor = res.data[1]
                else doctor = res.data[0]
              }
              // 如果是医生页面的话 这个页面的医生选中值是不需要改变的
              !medicalInstitutionId && (this.doctor = doctor)
            }

            // 如果是医生页面的话 这个页面的医生列表是不需要改变的
            !medicalInstitutionId && (this.doctorList = res.data)
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    // 获取预约列表
    getApptList: _.debounce(function () {
      if (!this.doctor) return
      appointmentAPI
        .getAppointmentViewListFromStaff({
          appointmentBeginTime: this.startTimeStamp,
          appointmentEndTime: this.endTimeStamp,
          medicalInstitutionId: this.accessMedicalInstitution
            .medicalInstitutionId,
          position: this.doctorValue,
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
      return new Promise((resolve, reject) => {
        if (this.doctor.staffId === -1) {
          this.scheduleList = defaultScheduleList
          resolve()

          return
        }

        institutionAPI
          .getApptScheduleListByStaff({
            scheduleBeginTime: this.startTimeStamp,
            scheduleEndTime: this.endTimeStamp,
            medicalInstitutionId: this.accessMedicalInstitution
              .medicalInstitutionId,
            staffId: this.doctor.staffId,
          })
          .then((res) => {
            if (
              Array.isArray(res.data) &&
              res.data[0] &&
              _.isPlainObject(res.data[0].institutionScheduleTableMap) &&
              Array.isArray(
                res.data[0].institutionScheduleTableMap[this.startTimeStamp],
              )
            ) {
              this.scheduleList =
                res.data[0].institutionScheduleTableMap[this.startTimeStamp]
            }

            resolve()
          })
          .catch(() => {
            reject()
          })
      })
    },
    // 获取全部在职医生的预约列表
    getAllDoctorWithApptList() {
      return new Promise((resolve) => {
        appointmentAPI
          .getAppointmentViewListFromStaff({
            appointmentBeginTime: this.startTimeStamp,
            appointmentEndTime: this.endTimeStamp,
            medicalInstitutionId: this.medicalInstitution.medicalInstitutionId,
            position: this.doctorValue,
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
        const mobile = appt.patient.mobile || ''
        const pinyin = appt.patient.pinyin || ''
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
      // this.$refs.dpmsDrawer.open()
      this.$utils.push({ url: '/baseSubpackages/apptView/doctorList' })
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
          '/baseSubpackages/apptForm/apptDetail?appointmentId=' +
          params.appointmentId,
      })
    },
    // 抽屉医生选择
    onSelected(doctor) {
      this.accessMedicalInstitution = uni.getStorageSync(
        'accessMedicalInstitution',
      )

      if (this.doctor && doctor.staffId === this.doctor.staffId)
        return this.$utils.back()
      this.doctor = doctor
      this.$utils.back()
      this.$refs.apptTable && this.$refs.apptTable.clearCreateMeet()
      this.getApptList()

      // 选择完医生后记录最后一次选择诊所id
      if (this.isHeaderWithLargeArea)
        appointmentAPI.updateAccessMedicalInstitution({
          medicalInstitutionId: this.accessMedicalInstitution
            .medicalInstitutionId,
        })

      if (doctor.staffId === -1) {
        this.scheduleList = defaultScheduleList
      } else {
        this.getApptScheduleInfo()
      }
    },
    refreshDoctorWithApptList() {
      this.getAllDoctorWithApptList()
        .then(() => {
          this.search({ value: this.searchValueWithAppt })
        })
        .catch()
    },
    changeCard({ meet, type }) {
      console.log('编辑改变', type, meet)
      appointmentAPI
        .updateAppointment({
          appointmentJsonStr: JSON.stringify(meet),
        })
        .then(() => {
          this.getApptList()
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
.apptViewPage {
  width: 100%;
  height: 100%;
  .emptyInstitution {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
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

        .leftCardInfo {
          display: flex;
          flex: 1;
          overflow: hidden;
          padding-right: 20rpx;
          .doctorName {
            font-size: 28rpx;
            max-width: 50%;
            display: inline-block;
            overflow: hidden;
            .doctorShowName {
              overflow: hidden;
              max-width: calc(100% - 60rpx);
            }
          }
          .doctorSelect {
            display: flex;
            align-items: center;

            .changeDoctorIcon {
              display: flex;
            }
          }
        }

        .rightCardInfo {
          display: flex;
        }
        .iconfont {
          font-size: 40rpx;
          color: $common-color;
        }
      }
    }

    .apptSearch {
      flex: 1 1 100%;

      .emptyPatient {
        color: rgba(0, 0, 0, 0.65);
        font-size: 28rpx;
      }
    }
  }
}
</style>
