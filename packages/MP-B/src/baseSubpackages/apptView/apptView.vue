<template>
  <view class="apptViewPage">
    <view v-if="accessMedicalInstitution === -1" class="emptyInstitution">
      无下属直营诊所，无法查看预约视图
    </view>
    <view class="apptView" v-else>
      <dpmsDrawer maskClose ref="dpmsDrawer" :width="750">
        <dpmsCell
          v-if="isHeaderWithLargeArea"
          title="诊所"
          isLink
          :value="accessMedicalInstitution.medicalInstitutionSimpleCode"
          @click.native="openSelectMedicalInstitution"
        />
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

      <selectMedicalInstitution
        v-if="isHeaderWithLargeArea"
        ref="selectMedicalInstitution"
        @confirm="selectInstitution"
        :list="institutionList"
        :workList="institutionCanSelectList"
      />

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
              class="doctorName mr-10 text-ellipsis"
              v-if="isHeaderWithLargeArea"
              >诊室：{{
                accessMedicalInstitution &&
                accessMedicalInstitution.medicalInstitutionSimpleCode
              }}</view
            >
            <view
              class="doctorName doctorSelect"
              :style="{ width: isHeaderWithLargeArea ? '50%' : '100%' }"
            >
              <span class="doctorName text-ellipsis">
                医生：{{ doctor.staffName }}674645654645ssdsdsadasdass大电风扇
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

const enums = uni.getStorageSync('enums')
const staff = uni.getStorageSync('staff')
const STAFF_POSITION_ENUM = enums.StaffPosition
const STAFF_STATUS_ENUM = enums.StaffStatus
const INSTITUTION_CHAIN_TYPE_ENUM = enums.InstitutionChainType

const doctorValue = STAFF_POSITION_ENUM && STAFF_POSITION_ENUM.DOCTOR.value

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
      institutionInfo: {}, // 总部/大区诊所选择信息
      isHeaderWithLargeArea: frontAuthUtil.check(
        '预约中心/预约视图/诊所的查询条件',
      ),
      institutionList: [], // 总部/大区 诊所列表
      accessMedicalInstitution: {}, // 获取总部/大区时 预约视图诊所选择 如果后台返回-1表示没有直营诊所 则提示：“无下属直营诊所，无法查看预约视图”
      institutionCanSelectList: [], // 总部/大区 诊所列表 可编辑id(medicalInstitutionId)
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
    medicalInstitution(newVal) {
      this.accessMedicalInstitution = newVal
    },
  },
  methods: {
    async init() {
      // 如果是总部/大区 需要获取诊所列表
      if (this.isHeaderWithLargeArea) {
        const [err, res] = await this.$utils.asyncTasks(
          institutionAPI.getInstitutionList({
            medicalInstitutionId: this.medicalInstitution.medicalInstitutionId,
            institutionChainTypes:
              INSTITUTION_CHAIN_TYPE_ENUM.CHAIN.value +
              ',' +
              INSTITUTION_CHAIN_TYPE_ENUM.REGIONAL.value,
          }),
        )

        if (err) return

        this.institutionList = [res.data]

        // 获取预约视图总部/大区时 诊所选择的值
        appointmentAPI
          .getLastAccessMedicalInstitution()
          .then((res) => {
            this.accessMedicalInstitution = res.data

            if (this.accessMedicalInstitution !== -1) {
              const info = apptViewUtil.findSelectInfo(
                _.cloneDeep(this.institutionList),
                'medicalInstitutionId',
                'childMedicalInstitutionList',
                this.accessMedicalInstitution,
              )
              this.accessMedicalInstitution = info

              this.getDoctor()
                .then((res) => {
                  this.getApptScheduleInfo()
                  this.getApptList()
                })
                .catch((err) => {
                  console.log('staff not found')
                })
            }
          })
          .catch()

        const canSelectList = apptViewUtil.findCanSelectId(
          this.institutionList,
          'medicalInstitutionId',
          'childMedicalInstitutionList',
          frontAuthUtil.canSelect,
        )

        this.institutionCanSelectList = canSelectList
      } else {
        this.getDoctor()
          .then((res) => {
            this.getApptScheduleInfo()
            this.getApptList()
          })
          .catch((err) => {
            console.log('staff not found')
          })
      }
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
            medicalInstitutionId: this.accessMedicalInstitution
              .medicalInstitutionId,
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
      if (!this.doctor) return
      appointmentAPI
        .getAppointmentViewListFromStaff({
          appointmentBeginTime: this.startTimeStamp,
          appointmentEndTime: this.endTimeStamp,
          medicalInstitutionId: this.accessMedicalInstitution
            .medicalInstitutionId,
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
            medicalInstitutionId: this.medicalInstitution.medicalInstitutionId,
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
          '/baseSubpackages/apptForm/apptDetail?appointmentId=' +
          params.appointmentId,
      })
    },
    // 抽屉医生选择
    onSelected(doctor) {
      if (doctor.staffId === this.doctor.staffId)
        return this.$refs.dpmsDrawer.close()
      this.doctor = doctor
      this.$refs.dpmsDrawer.close()
      this.getApptList()
      this.getApptScheduleInfo()
    },
    refreshDoctorWithApptList() {
      this.getAllDoctorWithApptList()
        .then(() => {
          this.search({ value: this.searchValueWithAppt })
        })
        .catch()
    },
    // 打开选择诊所弹窗
    openSelectMedicalInstitution() {
      this.$refs.selectMedicalInstitution.show()
    },
    // 总部/大区 筛选医生 选择医生回调
    selectInstitution(value) {
      if (value.id === this.accessMedicalInstitution.medicalInstitutionId)
        return

      this.accessMedicalInstitution = {
        medicalInstitutionSimpleCode: value.name,
        medicalInstitutionId: value.id,
      }
      appointmentAPI.updateAccessMedicalInstitution({
        medicalInstitutionId: value.id,
      })
      // 获取在职医生列表
      institutionAPI
        .getStaffListByPosition({
          position: doctorValue,
          workStatus: STAFF_STATUS_ENUM.STAFF_STATUS_AT_WORK_NAME.value,
          includeUnspecified: true,
          medicalInstitutionId: this.accessMedicalInstitution
            .medicalInstitutionId,
        })
        .then((res) => {
          !isDoctorWithLogin && (this.doctor = res.data[1])
          this.doctorList = res.data
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
    text-align: center;
    line-height: 100%;
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
            width: 50%;
            display: inline-block;
            overflow: hidden;
          }
          .doctorSelect {
            display: flex;
            align-items: center;
            .doctorName {
              flex: 1;
            }
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
