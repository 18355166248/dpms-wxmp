<template>
  <view class="content">
    <view class="cropper-wrapper">
      <custom id="image-cropper"></custom>
    </view>
    <view class="cropper-buttons safe-area-padding fix-footer">
      <!-- #ifdef H5 -->
      <view class="upload" @tap="uploadTap">选择图片</view>
      <!-- #endif -->
      <!-- #ifndef H5 -->
      <view class="upload" @tap="cancel">取消</view>
      <!-- #endif -->
      <view class="getCropperImage" @tap="getCropperImage(false)">完成</view>
    </view>
  </view>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      cropper: {},
    }
  },
  onLoad() {
    // 获取剪裁组件
    this.cropper = this.selectComponent('#image-cropper')
  },
  onShow() {
    uni.hideLoading()
  },
  methods: {
    /**
     * 保存剪裁后的图片
     */
    getCropperImage() {
      var app = getApp()
      if (!app.globalData.imgSrc) return this.$u.toast('请先选择图片再裁剪')
      // 输出剪裁之后的图像信息
      this.cropper.getImg((obj) => {
        uni.$emit('imageCropper', { path: obj.url, flag: true })
        uni.navigateBack({
          delta: 1,
        })
      })
    },

    /**
     *取消之后返回上一页头像展示界面
     */
    cancel() {
      uni.navigateBack({
        delta: 1,
      })
    },
  },
}
</script>

<style scoped lang="scss">
@import '../../../uview-ui/libs/css/style.components.scss';

page {
  width: 100%;
  height: 100%;
}

.content {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 1);
}

.fix-footer {
  height: 56px;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  box-sizing: content-box;
}

.cropper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 11;
}

.cropper-buttons {
  background-color: #000000;
  color: #eee;
}

.cropper-wrapper {
  flex: 1;
  position: relative;
  @include vue-flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: #000;
}

.cropper-buttons {
  width: 100vw;
  @include vue-flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-size: 28rpx;
}

.cropper-buttons .upload,
.cropper-buttons .getCropperImage {
  width: 50%;
  text-align: center;
}

.cropper-buttons .upload {
  text-align: left;
  padding-left: 50rpx;
}

.cropper-buttons .getCropperImage {
  text-align: right;
  padding-right: 50rpx;
}
</style>
