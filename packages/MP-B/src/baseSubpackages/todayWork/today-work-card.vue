<template>
  <view class="today-work-card">
    <view class="today-work-card-body">
      <view class="today-work-card-imgBox">
        <image
          class="today-work-card-imgBox-img"
          :src="avatar"
          mode="aspectFill"
          role="img"
        ></image>
      </view>

      <view class="today-work-card-content">
        <view class="today-work-card-baseInfo">
          <text class="today-work-card-baseInfo-name">{{
            cardData.patientDTO ? cardData.patientDTO.patientName : '--'
          }}</text>

          <tag
            :text="cardData.patientDTO ? cardData.patientDTO.age : '--'"
            :inverted="true"
            :circle="false"
            type="error"
            size="small"
          ></tag>

          <tag
            :text="gender.text"
            :inverted="true"
            :circle="false"
            :type="gender.type"
          ></tag>
        </view>
        <view class="today-work-card-tel">
          联系电话：{{
            cardData.patientDTO ? cardData.patientDTO.mobile : '--'
          }}
        </view>
        <view class="today-work-card-time">
          预约时间：{{
            moment(cardData.appointmentBeginTimestamp).format('HH:mm')
          }}
          ~
          {{ moment(cardData.appointmentEndTimestamp).format('HH:mm') }}
        </view>
      </view>
    </view>

    <view class="today-work-card-footer">
      <badge :type="badge.type" :color="badge.color" :text="badge.text"></badge>

      <view class="today-work-card-footer-right">
        <template v-if="curRoleKey === 'DOCTOR'">
          <text class="button inverted-button" v-if="!cardData.doctorOperated"
            >接诊</text
          >
          <text class="button inverted-button" v-if="cardData.doctorOperated"
            >治疗完成</text
          >
        </template>
        <template v-else-if="curRoleKey === 'CONSULTANT'">
          <text
            class="button inverted-button"
            v-if="!cardData.consultedOperated"
            >接诊</text
          >
          <text class="button inverted-button" v-if="cardData.doctorOperated"
            >治疗完成</text
          >
        </template>
        <template v-else>
          <template v-if="cardData.registerStatus === 1">
            <text
              class="button"
              @click="
                toPage('/baseSubpackages/apptForm/apptForm', {
                  type: 'editRegister',
                })
              "
              >挂号</text
            >
            <text
              class="button"
              @click="
                toPage('/baseSubpackages/apptForm/apptForm', {
                  type: 'editAppt',
                })
              "
              >编辑
            </text>
            <text class="button" @click="cancleAppointment">取消</text>
          </template>
          <template v-else-if="cardData.registerStatus === 2">
            <text class="button" @click="cancleRegister">取消</text>
          </template>
        </template>
      </view>
    </view>
  </view>
</template>

<script>
import moment from 'moment'
import tag from '@/components/tag/tag.vue'
import badge from '@/components/badge/badge.vue'
import diagnosisApi from '@/APIS/diagnosis/diagnosis.api'
import qs from 'qs'

export default {
  name: 'todayWorkCard',
  props: {
    cardData: {
      type: Object,
      default: {},
    },
    selectedRole: {
      type: Object,
      default: {},
    },
    curRoleKey: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      moment,
      cardClass: '',
      GENDER_ENUM: this.$utils.getEnums('Gender'),
      REGISTER_ENUM: this.$utils.getEnums('Register'),
    }
  },

  computed: {
    badge() {
      const text = this.REGISTER_ENUM.properties[this.cardData.registerStatus]
        ?.zh_CN

      const badge = { text }

      switch (this.cardData.registerStatus) {
        case 1:
          badge.type = 'success'
          break
        case 2:
          badge.type = 'error'
          break
        case 3:
          badge.type = 'warning'
          break
        case 4:
          badge.type = 'processing'
          break
        case 5:
          badge.type = 'success'
          break
        default:
          badge.type = 'default'
      }

      return badge
    },
    avatar() {
      const genderAvatar = {
        MALE: require('../../static/avatar-male.png'),
        FEMALE: require('../../static/avatar-female.png'),
      }
      if (this.cardData?.patientDTO?.avatarUrl) {
        return `${this.cardData?.patientDTO?.avatarUrl}?x-oss-process=image/resize,m_lfit,h_120,w_120`
      } else {
        if (this.cardData?.patientDTO?.gender) {
          return genderAvatar[
            this.GENDER_ENUM.properties[this.cardData?.patientDTO?.gender].key
          ]
        } else {
          return genderAvatar.MALE
        }
      }
    },
    gender() {
      const genderCode = {
        MALE: 'primary',
        FEMALE: 'error',
      }

      if (this?.GENDER_ENUM?.properties) {
        return {
          type: this.cardData?.patientDTO?.gender
            ? genderCode[
                this.GENDER_ENUM.properties[this.cardData?.patientDTO?.gender]
                  .key
              ]
            : 'primary',
          text: this.cardData?.patientDTO?.gender
            ? this.GENDER_ENUM.properties[this.cardData?.patientDTO?.gender]
                ?.text?.zh_CN
            : '--',
        }
      }

      return {
        type: 'primary',
        text: '--',
      }
    },
  },

  components: {
    tag,
    badge,
  },

  methods: {
    cancleAppointment() {
      // 取消预约
      console.log('取消预约')
    },
    cancleRegister() {
      // const { registerId } = this.cardData
      // const status = REGISTER_ENUM.REGISTER_CANCELED.value
      // const params = { registerId, status }
      // const [err, res] = await this.$utils.asyncTasks(diagnosisApi.cancleTodayWorkRegister(params))
      // // 取消挂号
      // console.log("取消挂号")
    },
    toPage(url, params) {
      this.$utils.push({
        url: `${url}?${qs.stringify(params, {
          arrayFormat: 'comma', // a: [1, 2] => a=1,2
        })}`,
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.today-work-card {
  position: relative;

  margin: 32rpx 32rpx 0;
  border-radius: $uni-border-radius-base;
  background: $dpms-bg-color;
  padding: 32rpx;
  // border-top-width: 12rpx;
  // border-top-style: solid;

  &-body {
    display: flex;
  }
  &-imgBox {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    overflow: hidden;
    &-img {
      height: 100%;
      width: 100%;
    }
  }
  &-content {
    margin-left: 24rpx;
    margin-bottom: 48rpx;
    font-size: 28rpx;
    color: rgba(0, 0, 0, 0.65);

    .today-work-card-baseInfo {
      margin-bottom: 16rpx;
      &-name {
        color: rgba(0, 0, 0, 0.9);
        font-size: 32rpx;
        font-weight: 500;
        margin-right: 8rpx;
      }
    }
    &-tel {
      margin-bottom: 8rpx;
    }
  }
  &-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-right {
      display: flex;
      .button {
        margin-left: 16rpx;
        padding: 10rpx 32rpx;
        font-size: 28rpx;
        border-radius: 28rpx;
        color: $dpms-color-primary;
        border: 2rpx solid $dpms-color-primary;
      }
      .inverted-button {
        background: $dpms-color-primary;
        color: #fff;
      }
    }
  }
}
.today-work-card-reserved {
  border-top-color: $dpms-color-primary;
}
.today-work-card-registered {
  border-top-color: #f2647c;
}
.today-work-card-inTreatment {
  border-top-color: #fbd438;
}
.today-work-card-consulting {
  border-top-color: #25e9f3;
}
.today-work-card-default {
  border-top-color: #666;
}
</style>
