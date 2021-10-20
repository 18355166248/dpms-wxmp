<template>
  <view class="content">
    <view class="layout">
      <image class="head-image" :src="avatar" />
      <button class="change-image" size="mini" @click="openImg">
        更换头像
      </button>
    </view>
  </view>
</template>
<script>
import systemAPI from '@/APIS/system.api'
import patientAPI from '@/APIS/patient/patient.api'

export default {
  name: 'picture',
  data() {
    return {
      avatar: '',
      patientId: '',
      gender: '',
      imgflag: false, // 判断第一次申请授权是否拒绝
    }
  },
  onLoad(option) {
    this.avatar = option.avatarUrl // 头像地址
    this.patientId = option.patientId // 患者id
    this.gender = option.gender // 患者性别
    if (!this.avatar) {
      switch (option.gender) {
        case '0':
          this.avatar = '../../../static/avatar-neutral.png'
          break
        case '1':
          this.avatar = '../../../static/avatar-male.png'
          break
        case '2':
          this.avatar = '../../../static/avatar-female.png'
          break
        case '3':
          this.avatar = '../../../static/avatar-neutral.png'
          break
      }
    }
  },
  created() {
    // 监听从裁剪页发布的事件，获得裁剪结果
    uni.$on('avatarCropper', async (path) => {
      const ossParam = await this.getOssParam()
      await this.uploadOss(ossParam, path)
      // 通过传参key值去后台获取新头像的地址
      await systemAPI.getOssUrl({ key: ossParam.key }).then((res) => {
        this.avatar = res.data
      })
      await patientAPI
        .updatePatientAvatar({
          avatarUrl: this.avatar,
          patientId: this.patientId,
        })
        .then((res) => {
          uni.showToast({
            icon: 'none',
            title: '更换成功',
          })
        })
    })
  },
  beforeDestroy() {
    uni.$off('avatarCropper')
  },
  methods: {
    /**
     * 1、当小程序已经获得摄像机权限时则直接进入拍摄/相册选择界面
     * 2、当小程序未获得授权且第一次获取授权时弹出授权框
     * 3、当未获得授权且拒绝授权弹框时则需要手动授权
     *
     * @property {Boolean} imgflag 判断是否拒绝授权
     */
    openImg() {
      var self = this

      // 选择图片函数chooseImage()所需要的参数
      var params = {
        count: 1, // 默认9
        sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: (res) => {
          //  获取裁剪图片资源后，将图片传给剪裁组件。
          var src = res.tempFilePaths[0]
          // uniApp的跳转传参必须保证格式与规范一致
          this.$u.route({
            // 剪裁页面的路径
            url: '/pages/patient/avatarCropper/avatarCropper',
            // 内部已设置以下默认参数值，可不传这些参数
            params: {
              // 输出图片宽度，高等于宽，单位px
              destWidth: 250,
              // 裁剪框宽度，高等于宽，单位px
              rectWidth: 250,
              // 输出的图片类型，如果'png'类型发现裁剪的图片太大，改成"jpg"即可
              fileType: 'png',
              // 给传给的剪裁页面的图片添加src属性及其值
              src: src,
            },
          })
        },
        fail: (err) => {
          console.log(err)
        },
      }

      // 获取用户授权信息
      uni.getSetting({
        success: (res) => {
          if (!res.authSetting['scope.camera'] && !self.imgflag) {
            // 当用户未授权给相机切没有拒绝授权时调用授权框
            uni.authorize({
              scope: 'scope.camera',
              success(res) {
                // 选择图片
                uni.chooseImage(params)
              },
              fail(err) {
                uni.showModal({
                  content: '获取摄像机授权失败，请再次点击去手动授权。',
                })
                // 拒绝授权后将flag值变换以便后续进行手动授权
                self.imgflag = true
              },
            })
          } else if (!res.authSetting['scope.camera'] && self.imgflag) {
            // 当用户未授权给相机且拒绝了授权时，需要进行手动授权。
            uni.showModal({
              //弹出提示框
              title: '是否打开设置页？',
              content: '需要在设置中打开摄像机权限。',
              success(res) {
                if (res.confirm) {
                  // 用户点击确定按钮，打开设置页
                  uni.openSetting({
                    // 确认后打开设置页面
                    success(res) {
                      if (res.authSetting['scope.camera']) {
                        console.log('手动授权成功')
                        self.imgflag = false
                      } else {
                        uni.showModal({
                          content: '授权失败！',
                        })
                      }
                    },
                    fail() {
                      uni.showModal({
                        content: '打开设置页面失败！',
                      })
                    },
                  })
                } else if (res.cancel) {
                  // 用户点击取消按钮
                  console.log('用户点击取消')
                }
              },
              fail() {
                uni.showModal({
                  content: '手动授权提示框弹出失败！',
                })
              },
            })
          } else {
            // 当用户已经授权时直接去选取图片
            uni.chooseImage(params)
          }
        },
        fail: (err) => {
          uni.showModal({
            content: '获取当前设置失败！',
          })
        },
      })
    },

    /**
     * 获取oss返回的所有数据
     */
    async getOssParam() {
      var params = {}
      await systemAPI.getOssParam().then((res) => {
        if (res.code !== 0) return Promise.reject()
        params = res
      })
      // key值的构成逻辑取自其他相似功能，非必要不可改动
      return {
        ...params.data,
        key: `${params.data.directory}${String(Math.random())
          .slice(2)
          .padEnd(18, String(Math.random()).slice(2))}.jpg`,
      }
    },

    /**
     * 将剪裁后的图片上传到服务器
     * 上传到都武器所需要的参数来自于oss获取的数据
     */
    async uploadOss({ key, policy, accessKeyId, signature, host }, path) {
      return new Promise((resolve, reject) => {
        uni.uploadFile({
          url: host,
          filePath: path,
          name: 'file',
          formData: {
            key,
            policy,
            OSSAccessKeyId: accessKeyId,
            success_action_status: 200,
            signature,
          },
          success: (res) => {
            resolve(res)
          },
          fail: (err) => {
            reject(err)
          },
        })
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  background-color: #000;

  .layout {
    width: 100%;
    text-align: center;

    .head-image {
      width: 100%;
      height: 100vw;
    }

    .change-image {
      width: 232rpx;
      height: 80rpx;
      background: #2a2a2a;
      border-radius: 40rpx;
      margin-top: 128rpx;
      font-size: 34rpx;
      font-weight: 400;
      color: #ffff;
    }
  }
}
</style>
