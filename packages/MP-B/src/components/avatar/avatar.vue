<template>
  <view class="avatar" :style="{ width: avatarSize, height: avatarSize }">
    <image
      class="avatar__img"
      :src="avatarSrc"
      :style="{ width: avatarSize, height: avatarSize }"
      mode="aspectFill"
    ></image>
  </view>
</template>
<script>
export default {
  name: 'avatar',
  props: {
    size: {
      type: [String, Number], // 头像大小 支持[20, 20rpx]
      default: 120,
    },
    src: {
      type: String, // 图片地址
      default: null,
    },
    gender: {
      type: Number, // 性别
      default: 1,
    },
  },
  data() {
    return {
      GENDER_ENUM: this.$utils.getEnums('Gender'),
    }
  },
  computed: {
    avatarSize() {
      if (typeof this.size === 'number') {
        return `${this.size}rpx`
      }
      return this.size
    },
    avatarSrc() {
      const genderAvatar = {
        MALE: require('../../static/avatar-male.png'),
        FEMALE: require('../../static/avatar-female.png'),
        UNKNOWN: require('../../static/avatar-neutral.png'),
      }

      if (this.src) {
        return `${this.src}?x-oss-process=image/resize,m_lfit,h_120,w_120`
      } else if (this.gender) {
        return genderAvatar[this.GENDER_ENUM.properties[this.gender].key]
      }
      return genderAvatar.MALE
    },
  },
}
</script>
<style lang="scss" scoped>
.avatar {
  border-radius: 50%;
  overflow: hidden;
  .avatar__img {
    height: 100%;
    width: 100%;
  }
}
</style>
