<template>
  <div class="imagePreview">
    <div class="pd-32">
      <div class="title">
        <div>{{ diagnosisSettingsImageItemName }}</div>
        <div>{{ swiperIndex + 1 }}/{{ imgs.length }}</div>
      </div>
      <scroll-view
        class="pd-32"
        :style="[{ height: swiperheight + 'px', 'min-height': '840rpx' }]"
      >
        <swiper
          :current="swiperIndex"
          @change="swiperChange"
          style="height: 100%;"
          circular
        >
          <swiper-item
            v-for="i in imgs"
            :key="i.diagnosisTeethImageId"
            @longtap="saveImage(i.imageUrl)"
          >
            <image
              :src="i.imageUrl"
              class="wd-100vw swiper-item-content"
              mode="widthFix"
              :id="teethImageId"
            />
          </swiper-item>
        </swiper>
      </scroll-view>
    </div>
    <fixed-footer bgColor="#626262">
      <div class="pd-24">
        <div class="previewCell">
          <div class="previewCell__title">牙位：</div>
          <div class="previewCell__value">
            <TeethSelect
              color="#ffffff"
              class="handle"
              :value="data.toothPosition"
              disabled
            />
          </div>
        </div>
        <div class="previewCell">
          <div class="previewCell__title">备注：</div>
          <div class="previewCell__value">
            <div
              style="height: 200rpx; text-overflow: ellipsis; overflow: hidden;"
            >
              {{
                remark.length < 59 ? remark : remark.substring(0, 59) + '...'
              }}
            </div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="funcs">
          <div @click="deleteImg()">
            <div class="iconfont icon-delete" />
            删除
          </div>
          <div class="line"></div>
          <div @click="editRemark()">
            <div class="iconfont icon-edit" />
            修改备注
          </div>
        </div>
      </div>
    </fixed-footer>
  </div>
</template>

<script>
import TeethSelect from '@/businessComponents/TeethSelect/TeethSelect.vue'
import diagnosisAPI from '@/APIS/diagnosis/diagnosis.api.js'
import { mapState } from 'vuex'

export default {
  components: { TeethSelect },
  data() {
    return {
      data: {},
      remark: '',
      imgs: [],
      swiperIndex: 0,
      diagnosisSettingsImageItemName: '',
      swiperheight: 0,
    }
  },
  computed: {
    ...mapState('workbenchStore', ['teethPreviewParams', 'teethPreviewImgs']),
  },
  watch: {
    swiperIndex(val) {
      this.$nextTick(() => {
        this.initSwiperHeight(val)
      })
    },
  },
  methods: {
    saveImage(url) {
      uni.showModal({
        title: `是否保存这张图片到系统相册?`,
        success: ({ confirm, cancel }) => {
          if (confirm) {
            uni.downloadFile({
              url,
              success: function (res) {
                if (res.statusCode === 200) {
                  uni.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success: function () {
                      uni.showToast({
                        icon: 'success',
                        title: '保存成功',
                      })
                    },
                    complete: (res) => {
                      console.log(res)
                    },
                  })
                }
              },
            })
          }
        },
      })
    },
    swiperChange(e) {
      this.swiperIndex = Number(e.target.current)
      this.remark = this.imgs[this.swiperIndex]?.remark || ''
    },
    initSwiperHeight(index) {
      const query = uni.createSelectorQuery().in(this)
      query
        .selectAll('.swiper-item-content')
        .boundingClientRect((res) => {
          console.log(res, '.swiper-item-content')
          this.swiperheight = res[index]?.height || 0
        })
        .exec()
    },
    deleteImg() {
      const { diagnosisTeethImageId } = this.imgs[this.swiperIndex]
      const { imgs } = this
      uni.showModal({
        title: '确认删除此张影像？',
        success: async ({ confirm }) => {
          if (confirm) {
            diagnosisAPI
              .deleteImageItem({
                teethImageId: diagnosisTeethImageId,
              })
              .then((res) => {
                if (res.code === 0) {
                  this.imgs = []
                  //filer不了，很奇怪
                  imgs.forEach((element) => {
                    if (
                      element.diagnosisTeethImageId !== diagnosisTeethImageId
                    ) {
                      this.imgs.push(element)
                    }
                  })
                  this.swiperIndex = 0
                  //vuex
                  this.$store.commit(
                    'workbenchStore/setTeethPreviewImgs',
                    this.imgs,
                  )
                  uni.showToast({
                    icon: 'success',
                    title: '删除成功',
                  })
                  if (this.imgs.length === 0) {
                    this.$dpmsUtils.back()
                  }
                }
              })
          }
        },
      })
    },
    editRemark() {
      const { diagnosisTeethImageId } = this.imgs[this.swiperIndex]
      this.$dpmsUtils.push({
        url: `/pages/patient/image/editRemark?diagnosisTeethImageId=${diagnosisTeethImageId}&swiperIndex=${this.swiperIndex}`,
      })
    },
  },
  onLoad({ index }) {
    if (!this.teethPreviewParams) return
    this.teethPreviewParams.toothPosition = JSON.parse(
      this.teethPreviewParams.toothPositionStr || 'null',
    )
    this.data = this.teethPreviewParams
    this.swiperIndex = Number(index)
  },
  onShow() {
    if (!this.teethPreviewImgs) return
    this.imgs = this.teethPreviewImgs
    this.remark = this.imgs[this.swiperIndex]?.remark || ''
    this.diagnosisSettingsImageItemName =
      this.imgs[this.swiperIndex]?.diagnosisSettingsImageItemName || ''

    //写next tick不能稳定执行
    uni.showLoading({
      title: '加载中...',
      mask: true,
    })
    setTimeout(() => {
      this.initSwiperHeight(this.swiperIndex)
      uni.hideLoading()
    }, 1000)
  },
}
</script>

<style lang="scss" scoped>
.imagePreview {
  background-color: #626262;
  .previewCell {
    position: relative;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 740rpx;
    padding: 35rpx 32rpx;
    overflow: hidden;
    color: #323233;
    font-size: 34rpx;
    color: #ffffff;
    .previewCell__title {
      position: relative;
      padding-right: 48rpx;
    }
    .previewCell__value {
      flex: 1;
      padding-right: 10rpx;
      overflow: hidden;
    }
  }
  .bottom {
    display: flex;
    flex-direction: column;
    .funcs {
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      color: #ffffff;
      font-size: 32rpx;
      background-color: #626262;
      text-align: center;
      .iconfont {
        font-size: 48rpx;
      }
    }
  }
  .pd-32 {
    padding-top: 32rpx;
  }
  .pd-24 {
    padding-top: 24rpx;
  }
  .wd-100vw {
    width: 100vw;
  }
  .title {
    color: rgba(255, 255, 255, 1);
    font-size: 40rpx;
    text-align: center;
    line-height: 70rpx;
  }
  .line {
    height: 90rpx;
    border: 2rpx solid #ffffff;
    margin-left: 50rpx;
  }
}
</style>
