<template>
  <view v-if="requestStatus.status === 'success'" class="appt-detail">
    <view class="circular-arc-top"></view>
    <view class="appt-detail-wrapper">
      <view
        class="appt-detail-wrapper-info-card"
        @click="toPatient(dataSource.patient.patientId)"
      >
        <card
          :cornerMarker="dataSource.acrossInstitutionAppointmentFlag"
          :marginConfig="{ position: ['left', 'right'] }"
          :name="dataSource.patient.patientName"
          :avatarUrl="dataSource.patient.avatarUrl"
          :gender="dataSource.patient.gender"
          :medicalRecordNo="dataSource.patient.medicalRecordNo"
          :status="statusBadge"
          :infos="[{ label: '联系方式', value: dataSource.patient.mobile }]"
        >
        </card>
      </view>
      <view class="appt-detail-wrapper-main-cotent">
        <view class="description-item">
          <view class="description-item-label">预约诊所</view>
          <view class="description-item-con">{{
            dataSource.medicalInstitutionSimpleCode ||
            '医疗机构简称（接口文档有，真实返回数据没有）'
          }}</view>
        </view>
        <view class="description-item">
          <view class="description-item-label">预约时间</view>
          <view class="description-item-con">{{ apptTime }}</view>
        </view>
        <view class="description-item">
          <view class="description-item-label">咨询师</view>
          <view class="description-item-con">{{ staff.consultant }}</view>
        </view>
        <view class="description-item">
          <view class="description-item-label">医生</view>
          <view class="description-item-con">{{ staff.doctor }}</view>
        </view>
        <view class="description-item">
          <view class="description-item-label">助理</view>
          <view class="description-item-con">{{ staff.assistant }}</view>
        </view>
        <view class="description-item">
          <view class="description-item-label">预约项目</view>
          <view class="description-item-con">{{ apptItemsStr }}</view>
        </view>
        <view class="description-item">
          <view class="description-item-label">预约备注</view>
          <view class="description-item-con">{{
            dataSource.appointmentMemo || '--'
          }}</view>
        </view>
      </view>
    </view>
    <fixed-footer
      v-if="
        isHeaderWithLargeArea && !dataSource.acrossInstitutionAppointmentFlag
      "
    >
      <view class="button-group">
        <template v-if="statusEnumKey === 'APPOINTMENT'">
          <button class="button button-ghost" @click="confirmAppointment">
            确认
          </button>
          <button
            class="button button-ghost no-right-border"
            @click="
              toPage('/baseSubpackages/apptForm/cancleAppt', {
                appointmentId: appointmentId,
              })
            "
          >
            取消
          </button>
          <button
            class="button button-ghost"
            @click="
              toPage('/baseSubpackages/apptForm/apptForm', {
                type: 'editRegister',
                appointmentId: appointmentId,
              })
            "
          >
            挂号
          </button>
          <button
            class="button"
            @click="
              toPage('/baseSubpackages/apptForm/apptForm', {
                type: 'editAppt',
                appointmentId: appointmentId,
              })
            "
          >
            编辑
          </button>
        </template>
        <template v-if="statusEnumKey === 'CONFIRM'">
          <button
            class="button button-ghost"
            @click="
              toPage('/baseSubpackages/apptForm/cancleAppt', {
                appointmentId: appointmentId,
              })
            "
          >
            取消
          </button>
          <button
            class="button button-ghost"
            @click="
              toPage('/baseSubpackages/apptForm/apptForm', {
                type: 'editRegister',
                appointmentId: appointmentId,
              })
            "
          >
            挂号
          </button>
          <button
            class="button"
            @click="
              toPage('/baseSubpackages/apptForm/apptForm', {
                type: 'editAppt',
                appointmentId: appointmentId,
              })
            "
          >
            编辑
          </button>
        </template>
        <button
          v-else-if="statusEnumKey === 'REGISTERED'"
          class="button"
          @click="cancleRegister"
        >
          取消
        </button>
      </view>
    </fixed-footer>
  </view>
  <view v-else-if="requestStatus.status === 'error'">
    <request-error @click="loadData" :msg="requestStatus.msg"></request-error>
  </view>
</template>
<script>
import moment from 'moment'
import qs from 'qs'
import fixedFooter from '@/components/fixed-footer/fixed-footer.vue'
import appointmentAPI from '@/APIS/appointment/appointment.api'
import diagnosisApi from '@/APIS/diagnosis/diagnosis.api'
import card from '@/components/card/card.vue'
import requestError from '@/components/request-error/request-error.vue'
import { globalEventKeys } from '@/config/global.eventKeys'
import { frontAuthUtil } from '@/utils/frontAuth.util'

export default {
  data() {
    return {
      requestStatus: {
        loading: true,
        status: 'loading',
        msg: '',
      },
      registerId: null,
      appointmentId: null,
      dataSource: {},
      APPOINTMENT_STATUS_ENUM: this.$utils.getEnums('AppointmentStatus'),
      STAFF_POSITION_ENUM: this.$utils.getEnums('StaffPosition'),
      REGISTER_ENUM: this.$utils.getEnums('Register'),
      isHeaderWithLargeArea: frontAuthUtil.check(
        '预约中心/预约视图/新建修改、取消、日志',
      ),
    }
  },
  components: {
    card,
    requestError,
  },
  onLoad(option) {
    this.appointmentId = Number(option.appointmentId)
    this.loadData()

    uni.$on(globalEventKeys.cancleApptSuccess, () => {
      this.loadData()
    })
    uni.$on(globalEventKeys.apptFormWithSaveSuccess, () => {
      this.loadData()
    })
  },
  onUnload() {
    uni.$off(globalEventKeys.cancleApptSuccess)
    uni.$off(globalEventKeys.apptFormWithSaveSuccess)
  },
  methods: {
    cancleRegister() {
      if (this.dataSource.registerId) {
        const status = this.REGISTER_ENUM.REGISTER_CANCELED.value

        diagnosisApi
          .updateRegisterStatus({
            registerId: this.dataSource.registerId,
            status,
          })
          .then((res) => {
            if (res.code === 0) {
              uni.showToast({
                icon: 'success',
                title: '取消成功',
              })
              this.loadData()
            }
          })
          .catch()
      }
    },
    confirmAppointment() {
      appointmentAPI
        .confirmAppointmentStatus({
          appointmentId: this.dataSource.appointmentId,
        })
        .then((res) => {
          if (res.code === 0) {
            uni.showToast({
              icon: 'success',
              title: '已确认预约',
            })
            this.loadData()
          }
        })
        .catch()
    },
    // 页面跳转
    toPage(url, params) {
      this.$utils.push({
        url: `${url}?${qs.stringify(params, {
          arrayFormat: 'comma', // a: [1, 2] => a=1,2
        })}`,
      })
    },
    // 请求数据
    async loadData() {
      uni.showNavigationBarLoading()
      const [listErr, listRes] = await this.$utils.asyncTasks(
        appointmentAPI.getAppointmentDetail({
          appointmentId: this.appointmentId,
        }),
      )

      if (listErr) {
        this.requestStatus.status = 'error'
        this.requestStatus.msg = listErr.message
      }

      if (listRes) {
        this.dataSource = listRes.data
        this.requestStatus.status = 'success'
      }

      uni.hideNavigationBarLoading()
    },
    toPatient(id) {
      this.$utils.push({
        url: '/pages/patient/patient?patientId=' + id,
      })
    },
  },
  computed: {
    statusEnumKey() {
      if (this.dataSource.appointmentStatus) {
        return this.APPOINTMENT_STATUS_ENUM.properties[
          this.dataSource.appointmentStatus
        ].key
      }
    },
    staff() {
      if (Array.isArray(this.dataSource?.appointmentResourceMap?.STAFF)) {
        const staff = this.dataSource.appointmentResourceMap.STAFF
        const doctorValue = this.STAFF_POSITION_ENUM.DOCTOR.value
        const consultantValue = this.STAFF_POSITION_ENUM.CONSULTANT.value
        const assistantManagerValue = this.STAFF_POSITION_ENUM.ASSISTANT_MANAGER
          .value

        let doctor
        let consultant
        let assistant

        staff.forEach((item) => {
          if (item.position === doctorValue) {
            doctor = item.staffName
          }
          if (item.position === consultantValue) {
            consultant = item.staffName
          }
          if (item.position === assistantManagerValue) {
            assistant = item.staffName
          }
        })

        return {
          doctor,
          consultant,
          assistant,
        }
      }
      return {
        doctor: '--',
        consultant: '--',
        assistant: '--',
      }
    },
    statusBadge() {
      const appointmentStatusColorMap = {
        [this.APPOINTMENT_STATUS_ENUM.APPOINTMENT.value]: '#FED700',
        [this.APPOINTMENT_STATUS_ENUM.REGISTERED.value]: '#f04965',
        [this.APPOINTMENT_STATUS_ENUM.TREATED.value]: '#1890ff',
        [this.APPOINTMENT_STATUS_ENUM.CONSULTATION.value]: '#00e6f1',
        [this.APPOINTMENT_STATUS_ENUM.TREATING.value]: '#facc14',
        [this.APPOINTMENT_STATUS_ENUM.UNDETERMINED.value]: '#727efc',
        [this.APPOINTMENT_STATUS_ENUM.CONFIRM.value]: '#55D24A',
      }

      return {
        color: this.dataSource.appointmentStatus
          ? appointmentStatusColorMap[this.dataSource.appointmentStatus]
          : '#666',
        text: this.dataSource.appointmentStatus
          ? this.APPOINTMENT_STATUS_ENUM.properties[
              this.dataSource.appointmentStatus
            ].zh_CN
          : '--',
      }
    },

    apptItemsStr() {
      if (
        this.dataSource.appointmentResourceMap &&
        Array.isArray(
          this.dataSource.appointmentResourceMap.COMMON_DATA_APPOINTMENT_ITEM,
        ) &&
        this.dataSource.appointmentResourceMap.COMMON_DATA_APPOINTMENT_ITEM
          .length > 0
      ) {
        // 生成项目名的字符串数组
        const itemsArr = this.dataSource.appointmentResourceMap.COMMON_DATA_APPOINTMENT_ITEM.map(
          (item) => item.appointmentSettingsAppointmentItemName,
        )
        return itemsArr.join('、')
      }

      return '--'
    },
    apptTime() {
      return `${moment(this.dataSource.appointmentBeginTimeStamp).format(
        'YYYY-MM-DD HH:mm',
      )}`
    },
  },
}
</script>
<style lang="scss" scoped>
.appt-detail {
  height: 100%;
  box-sizing: border-box;
  position: relative;
  background: #fefefe;

  .circular-arc-top {
    width: 100%;
    height: 162rpx;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 0;
    overflow: hidden;
    &::after {
      content: ' ';
      width: 100%;
      height: 162rpx;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 0;
      border-radius: 0 0 80% 80%;
      background: linear-gradient(
        160deg,
        $dpms-color-primary,
        $dpms-color-primary
      );
    }
  }
  &-wrapper {
    height: 100%;
    box-sizing: border-box;
    position: relative;
    z-index: 2;
    &-info-card {
      width: 100%;
      padding-top: 48rpx;
    }
    &-main-cotent {
      margin-top: 48rpx;
      padding: 0 32rpx;
      color: $common-text-color;
      font-size: $dpms-font-size-base;

      .description-item {
        display: flex;
        align-items: flex-start;
        font-size: $dpms-font-size-base;
        color: $common-text-color;
        margin-bottom: $dpms-spacing-col-base;
        &-label {
          position: relative;
          display: -webkit-inline-box;
          display: -ms-inline-flexbox;
          display: inline-flex;
          min-width: 150rpx;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
          white-space: nowrap;

          &::after {
            content: ':';
            position: relative;
            top: -2rpx;
            margin: 0 16rpx 0 4rpx;
          }
        }
      }
    }
  }
  .button-group {
    display: flex;
    align-items: center;
    .button {
      flex: 1;
      height: 90rpx;
      line-height: 90rpx;
      text-align: center;
      font-size: 36rpx;
      background-color: $dpms-color-primary;
      color: #fff;
      box-sizing: border-box;
      border-radius: 0;
      border-bottom: 1px solid $dpms-color-primary;

      &:first-child {
        border-right: none;
      }
      &::after {
        border: none;
      }
    }
    .button-ghost {
      background-color: #fff;
      color: $dpms-color-primary;
      border: 2rpx solid $dpms-color-primary;
    }
    .no-right-border {
      border-right: none;
    }
  }
}
</style>
