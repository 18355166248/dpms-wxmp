<template>
  <view v-if="requestStatus.status === 'success'" class="appt-detail">
    <view class="circular-arc-top"></view>
    <view class="appt-detail-wrapper">
      <view class="appt-detail-wrapper-info-card">
        <card
          :cornerMarker="dataSource.acrossInstitutionAppointmentFlag"
          :marginConfig="{ position: ['left', 'right'] }"
          :name="dataSource.patient.patientName"
          :avatarUrl="dataSource.patient.avatarUrl"
          :gender="dataSource.patient.gender"
          :medicalRecordNo="dataSource.patient.medicalRecordNo"
          :status="statusBadge"
          :infos="[{ label: '联系方式', value: dataSource.patient.mobile }]"
          :patient="patient"
        >
        </card>
      </view>
      <view class="appt-detail-wrapper-main-cotent">
        <textarea
          @blur="bindTextAreaBlur"
          auto-height
          v-model="appointmentMemo"
          placeholder="请输入预约备注"
          :maxlength="500"
          class="memo"
        />
      </view>
    </view>
    <fixed-footer :bgColor="primaryColor">
      <view class="button-group">
        <button
          class="button"
          @click="save"
          :disabled="isSaveing"
          :loading="isSaveing"
        >
          保存
        </button>
      </view>
    </fixed-footer>
  </view>
  <view v-else-if="requestStatus.status === 'error'">
    <request-error @click="loadData"></request-error>
  </view>
</template>
<script>
import fixedFooter from '@/components/fixed-footer/fixed-footer.vue'
import appointmentAPI from '@/APIS/appointment/appointment.api'
import card from '@/components/card/card.vue'
import requestError from '@/components/request-error/request-error.vue'
import { globalEventKeys } from '@/config/global.eventKeys.js'

export default {
  data() {
    return {
      requestStatus: {
        loading: true,
        status: 'loading',
      },
      primaryColor: this.$commonCss.commonColor,
      appointmentMemo: '',
      appointmentId: null,
      dataSource: {},
      APPOINTMENT_STATUS_ENUM: this.$utils.getEnums('AppointmentStatus'),
      isSaveing: false,
    }
  },
  components: {
    card,
    requestError,
  },
  onLoad(option) {
    this.appointmentId = Number(option.appointmentId)
    this.loadData()
  },
  methods: {
    bindTextAreaBlur(e) {
      console.log(e.detail.value)
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
      }

      if (listRes) {
        this.dataSource = listRes.data
        this.requestStatus.status = 'success'
      }
      uni.hideNavigationBarLoading()
    },
    async save() {
      this.isSaveing = true

      const [listErr, listRes] = await this.$utils.asyncTasks(
        appointmentAPI.updateAppointmentStatus({
          appointmentId: this.appointmentId,
          appointmentStatus: this.APPOINTMENT_STATUS_ENUM.CANCELED.value,
          appointmentMemo: this.appointmentMemo,
        }),
      )

      if (listRes) {
        uni.$emit(globalEventKeys.cancleApptSuccess, {
          appointmentId: this.appointmentId,
        })
        this.$utils.back()
      }

      this.isSaveing = false
    },
  },
  computed: {
    statusBadge() {
      const appointmentStatusColorMap = {
        [this.APPOINTMENT_STATUS_ENUM.APPOINTMENT.value]: '#5cbb89',
        [this.APPOINTMENT_STATUS_ENUM.REGISTERED.value]: '#f04965',
        [this.APPOINTMENT_STATUS_ENUM.TREATED.value]: '#1890ff',
        [this.APPOINTMENT_STATUS_ENUM.CONSULTATION.value]: '#00e6f1',
        [this.APPOINTMENT_STATUS_ENUM.TREATING.value]: '#facc14',
        [this.APPOINTMENT_STATUS_ENUM.UNDETERMINED.value]: '#727efc',
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
  },
}
</script>
<style lang="scss" scoped>
.appt-detail {
  padding-top: 162rpx;
  height: 100%;
  box-sizing: border-box;
  position: relative;

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
    padding-top: 182rpx;
    position: relative;
    &-info-card {
      width: 100%;
      position: absolute;
      left: 0;
      top: 0;
      transform: translateY(-50%);
    }
    &-main-cotent {
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
      background-color: $dpms-color-primary;
      color: #fff;
      box-sizing: border-box;
      border-radius: 0;
      font-size: 30rpx;

      &:first-child {
        border-right: none;
        border-left: none;
      }
      &::after {
        border: none;
      }
    }
    .button-ghost {
      background-color: #fff;
      color: $dpms-color-primary;
      border: 2rpx solid $dpms-color-primary;
      border-bottom: none;
    }
  }
  .memo {
    width: 100%;
    min-height: 300rpx;
    background: #fff;
    box-sizing: border-box;
    padding: 30rpx;
  }
}
</style>
