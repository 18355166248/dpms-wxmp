<template>
  <view class="messageNode">
    <view
      class="image"
      v-if="message.contentType === 2 || message.contentType === 13"
    >
      <view class="image-box">
        <image
          mode="aspectFit"
          style="width: 132rpx; height: 132rpx;"
          :src="message.url"
        />
      </view>
      <div class="text">
        {{ message.contentType === 2 ? '【图片】' : '【小程序】' }}
      </div>
    </view>
    <view class="video" v-else-if="message.contentType === 4">
      <view class="video-box">
        <div class="icon-v iconfont icon-video"></div>
      </view>
      <div class="video-title">
        <div class="up">【视频】</div>
        <div class="down">{{ message.title }}</div>
      </div>
    </view>
    <view class="excel" v-else-if="message.contentType === 8">
      <view class="excel-box">
        <div class="icon-e iconfont icon-excel"></div>
      </view>
      <div class="excel-title">
        <div class="up">【文件】</div>
        <div class="down">{{ message.title }}</div>
      </div>
    </view>
  </view>
</template>
<script>
export default {
  name: '',
  props: {
    message: {
      type: Object,
      default: function () {
        return {}
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {},
  data() {
    return {}
  },
  watch: {
    message: {
      handler(newVal, oldVal) {
        console.log(this.$refs.textBox.getClientRects())
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.messageNode {
  background-color: #fff;
  margin-bottom: 16rpx;
  width: 622rpx;
  padding: 16rpx;
  .textWrap {
    display: flex;
    width: 610rpx;
    overflow: hidden;
  }
  .text-box {
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: justify;
    position: relative;
    line-height: 1.5;
    max-height: 4.5em;
    transition: 0.3s max-height;
    word-wrap: break-word;
    word-break: normal;
    .textBtn {
      position: relative;
      float: right;
      clear: both;
      margin-left: 40rpx;
      height: 44rpx;
      line-height: 44rpx;
      font-size: 28rpx;
      color: #5cbb89;
      cursor: pointer;
    }
    .textBtn::before {
      content: '...';
      position: absolute;
      left: -10rpx;
      color: #333;
      transform: translateX(-100%);
    }
  }
  .text-box::before {
    content: '';
    float: right;
    height: calc(100% - 46rpx);
  }
  .text-box::after {
    content: '';
    width: 999vw;
    height: 999vw;
    position: absolute;
  }
  .image {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .image-box {
      width: 132rpx;
      margin-right: 30rpx;
    }
    .text {
      font-size: 28rpx;
    }
  }
  .video {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .video-box {
      width: 132rpx;
      height: 132rpx;
      margin-right: 30rpx;
      background: #f5f5f5;
      text-align: center;
      line-height: 132rpx;
      .icon-v {
        font-size: 70rpx;
        color: rgba(0, 0, 0, 0.25);
      }
    }
    .video-title {
      width: 77%;
      display: flex;
      flex-direction: column;
      .up {
        font-size: 28rpx;
      }
      .down {
        color: rgba(0, 0, 0, 0.65);
        font-size: 28rpx;
      }
    }
  }
  .excel {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .excel-box {
      width: 132rpx;
      height: 132rpx;
      line-height: 132rpx;
      background: #3e843e;
      text-align: center;
      margin-right: 30rpx;
      .icon-e {
        font-size: 70rpx;
        color: #fff;
      }
    }
    .excel-title {
      width: 77%;
      display: flex;
      flex-direction: column;
      .up {
        font-size: 28rpx;
      }
      .down {
        color: rgba(0, 0, 0, 0.65);
        font-size: 28rpx;
      }
    }
  }
}
</style>
