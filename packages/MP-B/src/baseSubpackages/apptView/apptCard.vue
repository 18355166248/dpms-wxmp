<template>
  <view class="appt-card">
    <div class="avatar">
      <patientAvatar :patient="appt.patient" />
    </div>
    <view class="right">
      <view class="title mb-8">
        <text>{{ appt.patient.patientName }}</text>
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
        <view>
          就诊类型：{{ VIS_TYPE_ENUM.properties[appt.visType].zh_CN }}
        </view>
        <view>联系方式：{{ appt.patient.mobile }}</view>
        <view>预约时间：{{ getApptTime() }}</view>
        <view>预约诊所：{{ appt.medicalInstitutionSimpleCode }}</view>
        <view>预约医生：{{ doctor.staffName }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import moment from 'moment'
import patientAvatar from 'businessComponents/patientAvatar/patientAvatar'

export default {
  name: 'apptCard',
  props: {
    appt: {
      type: Object,
      required: true,
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
      [this.APPOINTMENT_STATUS_ENUM.APPOINTMENT.value]: '#5cbb89',
      [this.APPOINTMENT_STATUS_ENUM.REGISTERED.value]: '#f04965',
      [this.APPOINTMENT_STATUS_ENUM.TREATED.value]: '#1890ff',
      [this.APPOINTMENT_STATUS_ENUM.CONSULTATION.value]: '#00e6f1',
      [this.APPOINTMENT_STATUS_ENUM.TREATING.value]: '#facc14',
      [this.APPOINTMENT_STATUS_ENUM.UNDETERMINED.value]: '#727efc',
    }
    console.log(this.appt)
  },
  computed: {},
  components: {
    patientAvatar,
  },
  methods: {
    getGender(gender) {
      return this.GENDER_ENUM.properties[gender].text.zh_CN
    },
    getApptTime() {
      return `${moment(this.appt.appointmentBeginTimeStamp).format(
        'HH:mm',
      )} - ${moment(this.appt.appointmentEndTimeStamp + 1).format('HH:mm')}`
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
  border-radius: 8rpx;
  overflow: hidden;
  height: 384rpx;
  padding: 32rpx 24rpx;
  background-color: #fff;
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
    .title {
      font-size: 34rpx;
      font-weight: 700;
      color: rgba($color: #000000, $alpha: 0.9);
      display: flex;
      justify-content: space-between;
      .titleRight {
        font-size: 28rpx;
        color: $fontColor;
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

      > view {
        margin-bottom: 8rpx;
        height: 36rpx;
        line-height: 36rpx;
      }
    }
  }
}
</style>
