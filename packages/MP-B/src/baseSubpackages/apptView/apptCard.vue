<template>
  <view class="card">
    <view class="card-body">
      <view class="card-imgBox">
        <avatar :src="avatarUrl" :gender="gender"></avatar>
      </view>

      <view class="card-content">
        <view class="card-baseInfo">
          <text class="card-baseInfo-name">{{ name }}</text>
        </view>

        <view class="mb-14">
          <tag
            :text="genderText"
            :circle="false"
            type="error"
            size="small"
          ></tag>
          <tag
            :text="medicalRecordNo"
            :circle="false"
            type="error"
            size="small"
          ></tag>
        </view>

        <view class="card-corner-marker" v-if="expired">
          <view class="card-corner-marker-text">
            已过期
          </view>
        </view>

        <template v-if="infos.length > 0">
          <view v-for="(infoItem, index) in infos" :key="index">
            <text class="mr-6">{{ infoItem.label }}：</text>
            <text>{{ infoItem.value }}</text>
          </view>
        </template>
      </view>
    </view>
  </view>
</template>

<script>
import moment from 'moment'
import { commonUtil } from 'mpcommon'
import tag from '@/components/tag/tag.vue'
import badge from '@/components/badge/badge.vue'
import avatar from '@/components/avatar/avatar.vue'

const GENDER_ENUM = commonUtil.getEnums('Gender')

export default {
  name: 'card',
  components: {
    tag,
    badge,
    avatar,
  },
  props: {
    appt: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {
    name() {
      return this.appt.patient.patientName
    },
    avatarUrl() {
      return this.appt.patient.avatarUrl
    },
    gender() {
      return this.appt.patient.gender
    },
    genderText() {
      if (GENDER_ENUM?.properties && this.gender) {
        return GENDER_ENUM.properties[this.gender].text.zh_CN
      }
      return '--'
    },
    medicalRecordNo() {
      return this.appt.patient.medicalRecordNo
    },
    infos() {
      const doctorNames = (this.appt?.appointmentResourceMap?.STAFF || [])
        .filter((staff) => staff.position === 2)
        .map((staff) => staff.staffName)
        .join(', ')
      const undeterminedTime = moment(this.appt.appointmentBeginTime).format(
        'YYYY-MM-DD',
      )

      return [
        { label: '联系电话', value: this.appt.patient.mobile },
        { label: '预约医生', value: doctorNames },
        { label: '待定时间', value: undeterminedTime },
      ]
    },
    expired() {
      return moment(this.appt.appointmentBeginTime).isBefore(moment())
    },
  },
}
</script>
<style lang="scss" scoped>
.card {
  position: relative;
  border-radius: $uni-border-radius-base;
  background: $dpms-bg-color;
  padding: 30rpx 24rpx;
  box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(0, 0, 0, 0.1);
  margin-top: 24rpx;
  margin-left: 24rpx;
  margin-right: 24rpx;

  &-corner-marker {
    position: absolute;
    right: 16rpx;
    top: 16rpx;
    width: 108rpx;
    height: 108rpx;

    overflow: hidden;
    background-image: url('~@/static/expired-bg.png');
    background-repeat: no-repeat;
    background-size: 100%;

    &-text {
      width: 100%;
      height: 100%;
      transform: rotate(-30deg);
      text-align: center;
      line-height: 108rpx;
      color: #bfbfbf;
      font-size: 28rpx;
    }
  }

  &-body {
    display: flex;
  }

  &-content {
    flex: 1;
    margin-left: 24rpx;
    font-size: 28rpx;
    color: rgba(0, 0, 0, 0.65);
    line-height: 1.6;

    .card-baseInfo {
      position: relative;
      display: flex;
      align-items: center;
      &-name {
        color: rgba(0, 0, 0, 0.9);
        font-size: 36rpx;
        font-weight: 500;
      }
    }
  }
}
</style>
