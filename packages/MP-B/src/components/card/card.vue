<template>
  <view class="card" :style="[cardMargin]">
    <view
      v-if="cornerMarkerFormat.text"
      class="card-corner-marker"
      :style="{
        width: cornerMarkerFormat.size + 'rpx',
        height: cornerMarkerFormat.size + 'rpx',
      }"
    >
      <view
        class="card-corner-marker-after"
        :style="{
          borderWidth: parseInt(cornerMarkerFormat.size / 2, 10) + 'rpx',
          borderTopColor: cornerMarkerFormat.bgColor,
          borderRightColor: cornerMarkerFormat.bgColor,
        }"
      ></view>
      <text
        class="card-corner-marker-text"
        :style="{ color: cornerMarkerFormat.color }"
        >{{ cornerMarker.text }}</text
      >
    </view>

    <view v-else class="card-corner-marker">
      <text class="card-corner-marker-text">{{ cornerMarker }}</text>
    </view>
    <view class="card-body">
      <view class="card-imgBox">
        <avatar :src="avatarUrl" :gender="gender"></avatar>
      </view>

      <view class="card-content">
        <view
          class="card-baseInfo"
          :style="{ paddingRight: status ? '120rpx' : 0 }"
        >
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
          <view
            class="card-content-item"
            v-for="(infoItem, index) in infos"
            :key="index"
          >
            <template>
              <text class="mr-6">{{ infoItem.label }}：</text>
              <text>{{ formatVal(infoItem.value) }}</text>
            </template>
          </view>
        </template>
      </view>
    </view>

    <view class="card-footer" v-if="isShowFooter">
      <view class="card-footer-left">
        <slot name="footer-left"></slot>
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

/**
 * card 卡片
 *
 * @description 用于大部分卡片效果
 * @property {Boolean} disabled = [true|false] 禁用状态
 * 	@value true 卡片不能点击（不触发点击事件）
 * 	@value false 卡片可点击  (可绑定点击事件函数)
 * @property {String} name 患者姓名
 * @property {String} avatarUrl 患者头像（如果不传，则会根据性别，显示默认头像）
 * @property {Number} gender 患者性别
 * @property {String} age 患者年龄
 * @property {Number} status 卡片状态
 * @property {String|Number|Object} cornerMarker 卡片角标
 * @value { String | Number } 直接显示
 * 	@value { Object } = {size: 角标大小, bgColor: 角标背景, color: 文本颜色, text: 文本内容} 角标对象
 * @property {Object} marginConfig 卡片间隙对象
 * @value size { Number } 间隙大小
 * @value position { Array|String } 间隙方向如: "left", ["left"], ["left", "top"],["left", "right", "top", "bottom"]
 * @property {Array} infos 主要信息内容数组
 * @value [ {label: 标签, value: 标签值} ]
 *
 * @event {Function} click 卡片点击事件函数
 */

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
    cornerMarker: {
      type: [String, Number, Object],
      default: null,
    },
    marginConfig: {
      type: Object,
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
    cardMargin() {
      const size =
        this.marginConfig && this.$utils.isNumber(this.marginConfig.size)
          ? this.marginConfig.size
          : 32

      if (this.marginConfig && this.marginConfig.position) {
        const marginStyle = {}
        const position = this.marginConfig.position

        if (Array.isArray(position)) {
          const isPosition = position.every(
            (item) => ['left', 'right', 'top', 'bottom'].indexOf(item) !== -1,
          )

          if (isPosition) {
            position.forEach((item) => {
              const key = `${item.slice(0, 1).toUpperCase()}${item
                .slice(1)
                .toLowerCase()}`
              marginStyle[`margin${key}`] = `${size}rpx`
            })
          }
        } else if (typeof position === 'string') {
          const isPosition =
            ['left', 'right', 'top', 'bottom'].indexOf(position) !== -1
          if (isPosition) {
            const key = `${position.slice(0, 1).toUpperCase()}${position
              .slice(1)
              .toLowerCase()}`

            marginStyle[`margin${key}`] = `${size}rpx`
          }
        }
        return marginStyle
      }

      return {
        marginLeft: `${size}rpx`,
        marginRight: `${size}rpx`,
        marginTop: `${size}rpx`,
      }
    },
    cornerMarkerFormat() {
      const val = this.cornerMarker
      if (this.$utils.isObject(val)) {
        return {
          size: this.$utils.isNumber(val.size) ? val.size : 60,
          bgColor: this.$utils.isString(val.bgColor) ? val.bgColor : '#f6404a',
          color: this.$utils.isString(val.color) ? val.color : '#fafafa',
          text: val.text,
        }
      }
      return {
        size: 60,
        bgColor: '#f6404a',
        color: '#fafafa',
        text: val,
      }
    },
    isShowFooter() {
      return this.$slots['footer-right'] || this.$slots['footer-left']
    },
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
      if (Array.isArray(val)) {
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
  border-radius: $uni-border-radius-base;
  background: $dpms-bg-color;
  padding: 32rpx 24rpx;
  // border-top-width: 12rpx;
  // border-top-style: solid;
  box-shadow: 0rpx -8rpx 20rpx 0rpx rgba(0, 0, 0, 0.1);

  &-corner-marker {
    position: absolute;
    right: 0;
    top: 0;
    width: 60rpx;
    height: 60rpx;

    border-radius: 0 $uni-border-radius-base 0;
    overflow: hidden;

    &-text {
      font-size: 22rpx;
      color: #fafafa;
      position: absolute;
      right: 4rpx;
      top: 4rpx;
      z-index: 2;
    }

    &-after {
      position: absolute;
      right: 0;
      top: 0;
      width: 0;
      height: 0;
      border-width: 30rpx;
      border-style: solid;
      border-color: #f6404a #f6404a transparent transparent;
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

    .card-baseInfo {
      position: relative;
      margin-bottom: 20rpx;
      &-name {
        color: rgba(0, 0, 0, 0.9);
        font-size: 36rpx;
        font-weight: 500;
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
