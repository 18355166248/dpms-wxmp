<template>
  <img :src="path" />
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
}
export default {
  props: {
    gender: {
      type: Number,
      default: 0,
    },
  },
  name: 'avatar',
  watch: {
    gender(newVal) {
      if (!newVal) this.path = genderConfig[0].path
      this.path = genderConfig[newVal].path
    },
  },
  data() {
    return {
      path: genderConfig[this.gender].path,
    }
  },
}
</script>

<style lang="scss" scoped>
img {
  width: 120rpx;
  height: 120rpx;
}
</style>
