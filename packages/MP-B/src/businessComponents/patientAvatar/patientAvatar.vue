import requestError from '@/components/request-error/request-error.vue';
<template>
  <image
    :mode="mode"
    :src="path"
    :style="{
      width: width + 'rpx',
      height: width + 'rpx',
      borderRadius: width / 2 + 'rpx',
    }"
  />
</template>

<script>
const genderConfig = {
  0: {
    path: '../../static/avatar-neutral.png',
  },
  1: {
    path: '../../static/avatar-male.png',
  },
  2: {
    path: '../../static/avatar-female.png',
  },
  3: {
    path: '../../static/avatar-neutral.png',
  },
}
export default {
  name: 'patientAvatar',
  props: {
    patient: Object,
    mode: {
      type: String,
      default: 'aspectFill',
    },
    width: {
      type: Number,
      default: 120,
    },
  },
  computed: {
    path() {
      if (!this.patient) return genderConfig[0].path

      if (this.patient.avatarUrl) return this.patient.avatarUrl

      if (this.patient.headImgUrl) return this.patient.headImgUrl

      return genderConfig[this.patient.gender || 0].path
    },
  },
}
</script>
