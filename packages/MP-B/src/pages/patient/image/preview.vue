<template>
  <div class="imagePreview">
    <div class="pd-32">
      <div class="title">
        <div>{{ diagnosisSettingsImageItemName }}</div>
        <div>{{ swiperIndex + 1 }}/{{ imgs.length }}</div>
      </div>
      <div class="pd-32">
        <swiper :current="swiperIndex" @change="swiperChange" class="ht-800">
          <swiper-item v-for="i in imgs" :key="i.diagnosisTeethImageId">
            <image :src="i.imageUrl" class="wd-100vw" mode="widthFix" />
          </swiper-item>
        </swiper>
      </div>
    </div>
    <div class="pd-24">
      <div class="previewCell">
        <div class="previewCell__title">牙位：</div>
        <div class="previewCell__value">
          <TeethSelect
            class="handle"
            :value="data.toothPosition"
            disabled
            :style="{ color: '#ffffff' }"
          />
        </div>
      </div>
      <div class="previewCell">
        <div class="previewCell__title">备注：</div>
        <div class="previewCell__value">
          <div>{{ remark || '' }}</div>
        </div>
      </div>
    </div>
    <fixed-footer bgColor="#626262">
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
    }
  },
  computed: {
    ...mapState('workbenchStore', ['teethPreviewParams', 'teethPreviewImgs']),
  },
  methods: {
    submit() {},
    swiperChange(e) {
      this.swiperIndex = Number(e.target.current)
      this.remark = this.imgs[this.swiperIndex]?.remark || ''
    },
    deleteImg() {
      const { diagnosisTeethImageId } = this.imgs[this.swiperIndex]
      const { imgs } = this
      diagnosisAPI
        .deleteImageItem({
          teethImageId: diagnosisTeethImageId,
        })
        .then((res) => {
          if (res.code === 0) {
            this.imgs = []
            //filer不了，很奇怪
            imgs.forEach((element) => {
              if (element.diagnosisTeethImageId !== diagnosisTeethImageId) {
                this.imgs.push(element)
              }
            })
            this.swiperIndex = 0
            //vuex
            this.$store.commit('workbenchStore/setTeethPreviewImgs', this.imgs)
            uni.showToast({
              icon: 'success',
              title: '删除成功',
            })
            if (this.imgs.length === 0) {
              this.$utils.back()
            }
          }
        })
    },
    editRemark() {
      const { diagnosisTeethImageId } = this.imgs[this.swiperIndex]
      this.$utils.push({
        url: `/pages/patient/image/editRemark?diagnosisTeethImageId=${diagnosisTeethImageId}&swiperIndex=${this.swiperIndex}`,
      })
    },
  },
  onLoad() {
    if (!this.teethPreviewParams) return
    this.teethPreviewParams.toothPosition = JSON.parse(
      this.teethPreviewParams.toothPositionStr || 'null',
    )
    this.data = this.teethPreviewParams
  },
  onShow() {
    if (!this.teethPreviewImgs) return
    this.imgs = this.teethPreviewImgs
    this.remark = this.imgs[this.swiperIndex]?.remark || ''
    this.diagnosisSettingsImageItemName =
      this.imgs[this.swiperIndex]?.diagnosisSettingsImageItemName || ''
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
  .ht-800 {
    height: 800rpx;
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
