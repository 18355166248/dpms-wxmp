<template>
  <div class="editRemark">
    <view class="uni-form-item">
      <textarea
        class="textarea"
        v-model="remark"
        placeholder-style="color: rgba(0,0,0,0.3);"
        placeholder="请输入备注"
        maxlength="500"
      />
      <div class="count">{{ remark.length }}/500</div>
    </view>
    <button class="ensurebutton" @click="onSave" :disabled="disabled">
      保&nbsp;&nbsp;存
    </button>
  </div>
</template>

<script>
import diagnosisAPI from '@/APIS/diagnosis/diagnosis.api.js'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      remark: '',
      disabled: false,
      diagnosisTeethImageId: 0,
      swiperIndex: 0,
      diagnosisTeethImageIdStr: '',
    }
  },
  onLoad({ diagnosisTeethImageId, swiperIndex, diagnosisTeethImageIdStr }) {
    if (!diagnosisTeethImageIdStr) {
      this.diagnosisTeethImageId = Number(diagnosisTeethImageId)
      this.remark = this.teethPreviewImgs[swiperIndex].remark
      this.swiperIndex = swiperIndex
    } else {
      this.diagnosisTeethImageIdStr = diagnosisTeethImageIdStr
      this.remark = ''
    }
  },
  computed: {
    ...mapState('workbenchStore', ['teethPreviewImgs']),
  },
  methods: {
    onSave() {
      this.disabled = true
      if (!this.diagnosisTeethImageIdStr) {
        diagnosisAPI
          .updateImageItem({
            diagnosisTeethImageId: this.diagnosisTeethImageId,
            remark: this.remark,
          })
          .then(() => {
            //vuex
            this.teethPreviewImgs.forEach((element) => {
              if (
                element.diagnosisTeethImageId === this.diagnosisTeethImageId
              ) {
                element.remark = this.remark
              }
            })
            this.$store.commit(
              'workbenchStore/setTeethPreviewImgs',
              this.teethPreviewImgs,
            )
            this.$dpmsUtils.back()
            this.disabled = false
          })
          .catch(() => {
            this.disabled = false
          })
      } else {
        diagnosisAPI
          .batchUpdateImageItem({
            diagnosisTeethImageIdStr: this.diagnosisTeethImageIdStr,
            remark: this.remark,
          })
          .then(() => {
            this.$dpmsUtils.back()
            this.disabled = false
          })
          .catch(() => {
            this.disabled = false
          })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.editRemark {
  width: 100vw;
  .uni-form-item {
    width: 686rpx;
    background: #ffffff;
    padding: 32rpx;
  }
  .textarea {
    padding: 18rpx 0 0;
  }
  .count {
    text-align: right;
    color: rgba(0, 0, 0, 0.3);
    font-size: 28rpx;
    width: 100%;
  }
  .ensurebutton {
    height: 80rpx;
    background: #5cbb89;
    border-radius: 40rpx;
    margin-top: 320rpx;
    width: 686rpx;
    color: #fff;
    line-height: 80rpx;
  }
}
</style>
