<template>
  <view class="card">
    <view class="card-corner-marker">跨</view>
    <view class="card-body">
      <view class="card-imgBox">
        <avatar :src="avatarUrl" :gender="gender"></avatar>
      </view>

      <view class="card-content">
        <view class="card-baseInfo">
          <text class="card-baseInfo-name">{{ name }}</text>
          <view v-if="status" class="card-baseInfo-extend">
            <badge
              :type="badgeObj.type"
              :color="badgeObj.color"
              :text="badgeObj.text"
            ></badge>
          </view>
        </view>

        <view class="mb-40">
          <tag :text="genderTag.text" :circle="false" type="error"></tag>
          <template v-if="age">
            <tag :text="age" :circle="false" type="error"></tag>
          </template>
        </view>

        <template v-if="infos.length > 0">
          <view class="card-content-item" v-for="infoItem in infos">
            <template>
              <text class="mr-6">{{ infoItem.label }}：</text>
              <text>{{ formatVal(infoItem.value) }}</text>
            </template>
          </view>
        </template>
      </view>
    </view>

    <view class="card-footer">
      <view class="card-footer-left">
        <slot name="footer-left"> </slot>
      </view>
      <view class="card-footer-right">
        <slot name="footer-right"></slot>
      </view>
    </view>
  </view>
</template>

<script>
import moment from 'moment'
import tag from '@/components/tag/tag.vue'
import badge from '@/components/badge/badge.vue'
import avatar from '@/components/avatar/avatar.vue'
import diagnosisApi from '@/APIS/diagnosis/diagnosis.api'
import qs from 'qs'

export default {
  name: 'card',
  props: {
    disabled: {
      type: Boolean,
      default: true,
    },
    name: {
      type: String,
      default: '--',
    },
    avatarUrl: {
      type: String,
      default: null,
    },
    gender: {
      type: Number,
      default: 1,
    },
    age: {
      type: String,
      default: null,
    },
    status: {
      type: Number,
      default: null,
    },
    statusPlacement: {
      validator(value) {
        return ['footer', 'body'].indexOf(value) !== -1
      },
    },
    infos: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      GENDER_ENUM: this.$utils.getEnums('Gender'),
      REGISTER_ENUM: this.$utils.getEnums('Register'),
    }
  },
  computed: {
    badgeObj() {
      if (this.status) {
        const text = this.status
          ? this.REGISTER_ENUM.properties[this.status]?.zh_CN
          : '--'
        const status = this.REGISTER_ENUM.properties[this.status]?.key

        const badge = { text }

        switch (status) {
          case 'REGISTER_APPOINTED':
            badge.type = 'success'
            break
          case 'REGISTER_REGISTERED':
            badge.type = 'error'
            break
          case 'REGISTER_CONSULTING':
            badge.type = 'warning'
            break
          case 'REGISTER_TREATING':
            badge.type = 'processing'
            break
          case 'REGISTER_TREATED':
            badge.type = 'success'
            break
          case 'REGISTER_CANCELED':
            badge.type = 'error'
            break
          default:
            badge.type = 'default'
        }

        return badge
      }
    },

    genderTag() {
      const genderCode = {
        MALE: 'primary',
        FEMALE: 'error',
      }

      if (this?.GENDER_ENUM?.properties) {
        return {
          type: this.gender
            ? genderCode[this.GENDER_ENUM.properties[this.gender].key]
            : 'primary',
          text: this.gender
            ? this.GENDER_ENUM.properties[this.gender]?.text?.zh_CN
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
    avatar,
  },

  methods: {
    formatVal(val) {
      if (this.$utils.isArray(val)) {
        return `${moment(val[0]).format('HH:mm')} ~ ${moment(val[1]).format(
          'HH:mm',
        )}`
      }
      return val
    },
    onClick() {
      if (this.disabled === true) {
        return
      }
      this.$emit('click')
    },
  },
}
</script>
<style lang="scss" scoped>
.card {
  position: relative;
  margin: 32rpx 32rpx 0;
  border-radius: $uni-border-radius-base;
  background: $dpms-bg-color;
  padding: 32rpx;
  // border-top-width: 12rpx;
  // border-top-style: solid;
  box-shadow: 0rpx -8rpx 20rpx 0rpx rgba(0, 0, 0, 0.1);

  &-corner-marker {
    position: absolute;
    right: 0;
    top: 0;
    width: 56rpx;
    height: 56rpx;
    font-size: 22rpx;
    background: #f6404a;
    color: #fafafa;
    text-align: right;
    border-radius: 0 $uni-border-radius-base 0;
  }
  &-body {
    display: flex;
  }

  &-content {
    flex: 1;
    margin-left: 24rpx;
    font-size: 28rpx;
    color: rgba(0, 0, 0, 0.65);

    .card-baseInfo {
      position: relative;
      padding-right: 120rpx;
      margin-bottom: 20rpx;
      &-name {
        color: rgba(0, 0, 0, 0.9);
        font-size: 36rpx;
        font-weight: 500;
        margin-right: 24rpx;
      }
      &-extend {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    &-item {
      margin-bottom: 8rpx;
    }
  }
  &-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 40rpx;
    &-left {
      min-width: 10rpx;
    }
    &-right {
      display: flex;
    }
  }
}
.card-reserved {
  border-top-color: $dpms-color-primary;
}
.card-registered {
  border-top-color: #f2647c;
}
.card-inTreatment {
  border-top-color: #fbd438;
}
.card-consulting {
  border-top-color: #25e9f3;
}
.card-default {
  border-top-color: #666;
}
</style>
