<template>
  <view
    class="appt-card"
    @click="
      toPage('/baseSubpackages/apptForm/apptDetail', {
        appointmentId: appt.appointmentId,
      })
    "
  >
    <div class="avatar">
      <patientAvatar :patient="appt.patient" />
    </div>
    <view class="right">
      <view class="title mb-8">
        <text class="text-ellipsis patientName">{{
          appt.patient.patientName
        }}</text>
        <text class="titleRight">
          <text
            class="iconCircle mr-12"
            :style="{
              backgroundColor:
                appointmentStatusColorMap[appt.appointmentStatus],
            }"
          />
          <text>
            {{
              APPOINTMENT_STATUS_ENUM.properties[appt.appointmentStatus].zh_CN
            }}
          </text>
        </text>
      </view>
      <view class="subTitle mb-16">
        <text class="subTag mr-8">{{ getGender(appt.patient.gender) }}</text>
        <text class="subTag">{{ appt.patient.age }}</text>
      </view>
      <view class="apptDetail">
        <view v-if="appt.visType && isVisType">
          就诊类型：{{ VIS_TYPE_ENUM.properties[appt.visType].zh_CN }}
        </view>
        <view v-if="appt.patient.mobile"
          >联系电话：{{ appt.patient.mobile }}</view
        >
        <view>预约时间：{{ getApptTime() }}</view>
        <view class="institution">
          <text class="institutionLabel">预约诊所：</text>
          <text class="text-ellipsis institutionName">{{
            appt.medicalInstitutionSimpleCode
          }}</text>
        </view>
        <view>预约医生：{{ doctor.staffName }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import moment from 'moment'
import qs from 'qs'
import patientAvatar from 'businessComponents/patientAvatar/patientAvatar'

export default {
  name: 'apptCard',
  props: {
    appt: {
      type: Object,
      required: true,
    },
    isVisType: {
      type: Boolean,
      default: true,
    },
    doctor: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      cardClass: '',
      GENDER_ENUM: this.$utils.getEnums('Gender'),
      APPOINTMENT_STATUS_ENUM: this.$utils.getEnums('AppointmentStatus'),
      VIS_TYPE_ENUM: this.$utils.getEnums('VisType'),
      appointmentStatusColorMap: {},
    }
  },
  created() {
    this.appointmentStatusColorMap = {
      [this.APPOINTMENT_STATUS_ENUM.APPOINTMENT.value]: '#FED700',
      [this.APPOINTMENT_STATUS_ENUM.REGISTERED.value]: '#f04965',
      [this.APPOINTMENT_STATUS_ENUM.TREATED.value]: '#1890ff',
      [this.APPOINTMENT_STATUS_ENUM.CONSULTATION.value]: '#00e6f1',
      [this.APPOINTMENT_STATUS_ENUM.TREATING.value]: '#facc14',
      [this.APPOINTMENT_STATUS_ENUM.UNDETERMINED.value]: '#727efc',
      [this.APPOINTMENT_STATUS_ENUM.CONFIRM.value]: '#55D24A',
    }
  },
  computed: {},
  components: {
    patientAvatar,
  },
  methods: {
    toPage(url, params) {
      this.$utils.push({
        url: `${url}?${qs.stringify(params, {
          arrayFormat: 'comma', // a: [1, 2] => a=1,2
        })}`,
      })
    },
    getGender(gender) {
      return this.GENDER_ENUM.properties[gender]?.text.zh_CN || '未知'
    },
    getApptTime() {
      return `${moment(this.appt.appointmentBeginTimeStamp).format(
        'YYYY-MM-DD HH:mm',
      )} ~ ${moment(this.appt.appointmentEndTimeStamp + 1).format('HH:mm')}`
    },
  },
}
</script>

<style lang="scss" scoped>
$fontColor: rgba(
  $color: #000000,
  $alpha: 0.65,
);

.appt-card {
  background: #feffff;
  border-radius: 8rpx;
  box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 32rpx 24rpx;
  display: flex;
  align-items: stretch;
  margin-bottom: 32rpx;
  box-sizing: border-box;
  .avatar {
    flex: 0 0 120rpx;
  }
  .right {
    padding-left: 24rpx;
    flex: 1 1 100%;
    overflow: hidden;

    .title {
      font-size: 34rpx;
      font-weight: 700;
      color: rgba($color: #000000, $alpha: 0.9);
      display: flex;
      justify-content: space-between;
      .patientName {
        overflow: hidden;
      }
      .titleRight {
        font-size: 28rpx;
        color: $fontColor;
        flex: 0 0 auto;
        .iconCircle {
          display: inline-block;
          width: 16rpx;
          height: 16rpx;
          border-radius: 8rpx;
        }
      }
    }
    .subTitle {
      .subTag {
        padding: 2rpx 16rpx;
        min-width: 90rpx;
        height: 40rpx;
        line-height: 40rpx;
        font-size: 26rpx;
        color: rgba(250, 84, 28, 1);
        background-color: #fff2e8;
        border-radius: 2rpx;
      }
    }
    .apptDetail {
      color: $fontColor;
      font-size: 28rpx;

      .institution {
        display: flex;
        .institutionLabel {
          flex: 0 0 auto;
        }
        .institutionName {
          flex: 1 1 100%;
          overflow: hidden;
        }
      }

      > view {
        margin-bottom: 8rpx;
        height: 36rpx;
        line-height: 36rpx;
      }
    }
  }
}
</style>
