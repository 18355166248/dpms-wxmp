<template>
  <div
    class="wrapper"
    :style="{
      width: enterWidth + 'rpx',
      background: bgColor,
      marginBottom: mb + 'rpx',
      padding: p + 'rpx',
    }"
  >
    <checkbox-group
      class="exp"
      @change="checkboxChange"
      :class="unfold ? '' : 'open'"
    >
      <label>
        <checkbox id="exp1" :checked="unfold" />
      </label>
    </checkbox-group>

    <div class="text">
      <label class="btn" for="exp1" :style="{ background: bgColor }">
        <span v-if="unfold">详情<span class="iconfont icon-down"></span></span>
        <span v-if="!unfold">收起<span class="iconfont icon-up"></span></span>
      </label>
      <span>{{ title }}</span
      ><span>{{ content }}</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      unfold: true,
    }
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
    enterWidth: {
      type: Number,
      default: 0,
    },
    bgColor: {
      type: String,
      default: '',
    },
    mb: {
      type: Number,
      default: 0,
    },
    p: {
      type: Number,
      default: 0,
    },
  },

  onLoad() {},
  methods: {
    checkboxChange(e) {
      this.unfold = !this.unfold
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  overflow: hidden;
}
.text {
  font-size: 26rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: justify;
  position: relative;
  line-height: 1.5;
  max-height: 4.5em;
  transition: 0.3s max-height;
  word-wrap: break-word;
  word-break: normal;
}
.text::before {
  content: '';
  height: calc(100% - 35rpx);
  float: right;
}
.text::after {
  content: '';
  width: 999vw;
  height: 999vw;
  position: absolute;
  box-shadow: inset calc(100rpx - 999vw) calc(38rpx - 999vw) 0 0
    rgba(255, 255, 255, 1);
  margin-left: -100rpx;
}
.btn {
  position: relative;
  float: right;
  clear: both;
  margin-left: 20rpx;
  font-size: 28rpx;
  padding: 0 8rpx;
  line-height: 28rpx;
  border-radius: 4rpx;
  color: #5cbb89;
  cursor: pointer;
  /* margin-top: -30px; */
}
.exp {
  display: none;
}
.open + .text {
  max-height: none;
}
.open + .text::after {
  visibility: hidden;
}
.open + .text .btn::before {
  visibility: hidden;
}
.btn::before {
  content: '...';
  position: absolute;
  left: -3rpx;
  color: #333;
  transform: translateX(-100%);
}
</style>
