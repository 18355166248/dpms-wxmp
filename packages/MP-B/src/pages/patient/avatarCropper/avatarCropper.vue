<template>
  <view class="content">
    <view class="cropper-wrapper">
      <canvas
        class="cropper"
        :disable-scroll="true"
        @touchstart="touchStart"
        @touchmove="touchMove"
        @touchend="touchEnd"
        :style="{
          width: cropperOpt.width,
          height: cropperOpt.height,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
        }"
        canvas-id="cropper"
        id="cropper"
      ></canvas>
      <canvas
        class="cropper"
        :disable-scroll="true"
        :style="{
          position: 'fixed',
          top: `-${cropperOpt.width * cropperOpt.pixelRatio}px`,
          left: `-${cropperOpt.height * cropperOpt.pixelRatio}px`,
          width: `${cropperOpt.width * cropperOpt.pixelRatio}px`,
          height: `${cropperOpt.height * cropperOpt.pixelRatio}px`,
        }"
        canvas-id="targetId"
        id="targetId"
      ></canvas>
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
import WeCropper from '../../../uview-ui/components/u-avatar-cropper/weCropper.js'

/**
 * 此页面及功能取自uView组件，大部分代码未做改动。
 * 少数地方做了定制化修改，功能逻辑可参照uView官方文档。
 */
export default {
  props: {
    // 裁剪矩形框的样式，其中可包含的属性为lineWidth-边框宽度(单位rpx)，color: 边框颜色，
    // mask-遮罩颜色，一般设置为一个rgba的透明度，如"rgba(0, 0, 0, 0.35)"
    boundStyle: {
      type: Object,
      default() {
        return {
          lineWidth: 4,
          borderColor: 'rgb(245, 245, 245)',
          mask: 'rgba(0, 0, 0, 0.35)',
        }
      },
    },
  },
  data() {
    return {
      originWidth: 200,
      width: 0,
      height: 0,
      cropperOpt: {
        id: 'cropper',
        targetId: 'targetCropper',
        pixelRatio: 1,
        width: 0,
        height: 0,
        scale: 2.5,
        zoom: 8,
        cut: {
          x: (this.width - this.originWidth) / 2,
          y: (this.height - this.originWidth) / 2,
          width: this.originWidth,
          height: this.originWidth,
        },
        boundStyle: {
          lineWidth: uni.upx2px(this.boundStyle.lineWidth),
          mask: this.boundStyle.mask,
          color: this.boundStyle.borderColor,
        },
      },
      // 裁剪框和输出图片的尺寸，高度默认等于宽度
      // 输出图片宽度，单位px
      destWidth: 200,
      // 裁剪框宽度，单位px
      rectWidth: 200,
      // 输出的图片类型，如果'png'类型发现裁剪的图片太大，改成"jpg"即可
      fileType: 'jpg',
      src: '', // 选择的图片路径，用于在点击确定时，判断是否选择了图片
    }
  },
  onLoad(option) {
    let _this = this
    // 获取用户系统数据
    uni.getSystemInfo({
      success: function (res) {
        _this.init(res, option)
      },
    })
  },
  methods: {
    touchStart(e) {
      this.cropper.touchStart(e)
    },
    touchMove(e) {
      this.cropper.touchMove(e)
    },
    touchEnd(e) {
      this.cropper.touchEnd(e)
    },
    // 裁剪页面初始化
    init(res, option) {
      let rectInfo = res
      // 获取裁剪canvas部分dom节点的宽高信息
      const query = uni.createSelectorQuery().in(this)
      query
        .select('.cropper-wrapper')
        .boundingClientRect((data) => {
          this.width = data.width
          this.height = data.height
          this.cropperOpt.width = data.width
          this.cropperOpt.height = data.height
          this.cropperOpt.pixelRatio = rectInfo.pixelRatio
          if (option.destWidth) this.destWidth = option.destWidth
          if (option.rectWidth) {
            let rectWidth = Number(option.rectWidth)
            this.cropperOpt.cut = {
              x: (this.width - rectWidth) / 2,
              y: (this.height - rectWidth) / 2,
              width: rectWidth,
              height: rectWidth,
            }
          }
          this.rectWidth = option.rectWidth
          if (option.fileType) this.fileType = option.fileType

          // 初始化
          this.cropper = new WeCropper(this.cropperOpt)
            .on('ready', (ctx) => {
              // wecropper is ready for work!
            })
            .on('beforeImageLoad', (ctx) => {
              // before picture loaded, i can do something
            })
            .on('imageLoad', (ctx) => {
              // picture loaded
            })
            .on('beforeDraw', (ctx, instance) => {
              // before canvas draw,i can do something
            })
          this.cropper.pushOrign(option.src)
          this.src = option.src
          // 设置导航栏样式，以免用户在page.json中没有设置为黑色背景
          uni.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#000000',
          })
        })
        .exec()
    },

    getCropperImage(isPre = false) {
      if (!this.src) return this.$u.toast('请先选择图片再裁剪')

      let cropper_opt = {
        destHeight: Number(this.destWidth), // uni.canvasToTempFilePath要求这些参数为数值
        destWidth: Number(this.destWidth),
        fileType: this.fileType,
      }
      // 输出剪裁之后的图像信息
      this.cropper.getCropperImage(cropper_opt, (path, err) => {
        if (err) {
          uni.showModal({
            title: '温馨提示',
            content: err.message,
          })
        } else {
          if (isPre) {
            uni.previewImage({
              current: '', // 当前显示图片的 http 链接
              urls: [path], // 需要预览的图片 http 链接列表
            })
          } else {
            uni.$emit('avatarCropper', path)
            this.$u.route({
              type: 'back',
            })
          }
        }
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
  height: 50px;
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
