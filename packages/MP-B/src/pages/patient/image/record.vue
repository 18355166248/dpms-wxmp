<template>
  <div>
    <div v-if="records.length">
      <div class="record" v-for="r in computedRecords" :key="r.registerId">
        <div class="head">
          <div>{{ r.registerLabel }}</div>
          <div>{{ r.storeName }}</div>
        </div>
        <div class="type">
          <div v-for="it in r.imageTypes" :key="it.value">
            <div class="label">{{ it.label }}</div>
            <div class="imgs">
              <div
                v-for="(img, index) in it.imgs"
                :key="img.imageUrl"
                style="position: relative;"
                @click="checkedImg(Number(img.diagnosisTeethImageId))"
              >
                <div
                  class="iconfont icon-check-circle-no"
                  v-if="
                    isBatch && !checkedList.includes(img.diagnosisTeethImageId)
                  "
                />
                <div
                  class="iconfont icon-checked-circle"
                  v-if="
                    isBatch && checkedList.includes(img.diagnosisTeethImageId)
                  "
                />
                <image :src="img.imageUrl" @click="preview(img, it, index)" />
                <div class="mask" v-if="isBatch"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <empty :disabled="true" text="无影像记录" v-else />
    <fixed-footer bgColor="#F5F5F5">
      <div class="bottom" v-if="!isBatch">
        <button
          class="leftBtn"
          @click="
            $dpmsUtils.push({
              url: `/pages/patient/image/upload?patientId=${patientId}`,
            })
          "
        >
          上传影像
        </button>
        <button
          @click="
            () => {
              this.isBatch = true
            }
          "
          class="rightBtn"
        >
          批量操作
        </button>
      </div>
      <div class="bottom" v-if="isBatch">
        <button @click="batchDelete" class="leftBtn">
          删除
        </button>
        <button @click="editRemark" class="rightBtn">
          修改备注
        </button>
      </div>
    </fixed-footer>
  </div>
</template>

<script>
import moment from 'moment'
import diagnosisAPI from '@/APIS/diagnosis/diagnosis.api.js'
import fixedFooter from '@/components/fixed-footer/fixed-footer.vue'

export default {
  components: { fixedFooter },
  data() {
    return {
      records: [],
      patientId: '',
      imageType: {},
      primaryColor: this.$commonCss.commonColor,
      isBatch: false,
      checkedList: [],
    }
  },
  computed: {
    imageTypeList() {
      return Object.values(this.imageType).map((t) => ({
        ...t,
        label: t.text.zh_CN,
      }))
    },
    computedRecords() {
      return this.records.map((r) => ({
        ...r,
        imageTypes: this.imageTypeList
          .filter((_it) =>
            r.teethImageList.some((_img) => _img.imageType === _it.value),
          )
          .map((_it) => ({
            ..._it,
            imgs: r.teethImageList.filter(
              (_img) => _img.imageType === _it.value,
            ),
          })),
      }))
    },
  },
  methods: {
    async getImageList(param) {
      this.$dpmsUtils.showLoading('加载中...')
      const res = await diagnosisAPI.getImageList(param)
      this.$dpmsUtils.clearLoading()
      this.records = res.data
        .filter((d) => d.teethImageList)
        .map((d) => ({
          ...d,
          registerLabel: moment(d.visTime).format('YYYY/MM/DD HH:mm'),
        }))
    },
    async getImageEnums() {
      const res = await diagnosisAPI.getImageEnums()
      this.imageType = res.data.ImageType
    },
    preview(params, { imgs }, index) {
      if (this.isBatch) return
      this.$store.commit('workbenchStore/setTeethPreviewParams', params)
      this.$store.commit('workbenchStore/setTeethPreviewImgs', imgs)
      this.$dpmsUtils.push({
        url: `/pages/patient/image/preview?index=${index}`,
      })
    },
    checkedImg(id) {
      this.checkedList.includes(id)
        ? (this.checkedList = this.checkedList.filter((v) => {
            return v !== id
          }))
        : this.checkedList.push(id)
    },
    batchDelete() {
      if (this.checkedList.length < 1) return (this.isBatch = false)
      const teethImageIdStr = JSON.stringify(this.checkedList)
      uni.showModal({
        title: '确认删除这些影像？',
        success: async ({ confirm }) => {
          if (confirm) {
            this.$dpmsUtils.showLoading('请稍后...')
            diagnosisAPI.batchDeleteImages({ teethImageIdStr }).then((res) => {
              if (res.code === 0) {
                this.getImageList({ patientId: this.patientId })
                this.checkedList = []
                this.isBatch = false
                this.$dpmsUtils.show('删除成功', { icon: 'success' })
              }
            })
          }
        },
      })
    },
    editRemark() {
      if (this.checkedList.length < 1) return (this.isBatch = false)
      const diagnosisTeethImageIdStr = JSON.stringify(this.checkedList)
      this.$dpmsUtils.push({
        url: `/pages/patient/image/editRemark?diagnosisTeethImageIdStr=${diagnosisTeethImageIdStr}`,
      })
      this.checkedList = []
    },
  },
  onLoad({ patientId }) {
    this.patientId = patientId
    this.getImageEnums()
  },
  onShow() {
    this.isBatch = false
    this.checkedList = []
    this.getImageList({ patientId: this.patientId })
  },
}
</script>

<style lang="scss" scoped>
.record {
  padding: 0 32rpx;
  margin-bottom: 20rpx;
  font-size: 28rpx;
  color: #f5f5f5;
  background: #feffff;
  .opc06 {
    opacity: 0.6;
  }
  .iconfont {
    position: absolute;
    right: 0;
    font-size: 48rpx;
    color: #ffffff;
    z-index: 9;
  }
  .head {
    height: 84rpx;
    color: rgba(0, 0, 0, 0.9);
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: solid 1rpx rgba(0, 0, 0, 0.15);
  }
  .type {
    padding: 10rpx 0 12rpx;
    .label {
      color: rgba(0, 0, 0, 0.7);
      line-height: 66rpx;
    }
    .imgs {
      display: grid;
      grid-template-columns: repeat(4, 160rpx);
      gap: 16rpx;
      margin-bottom: 20rpx;
      image {
        width: 160rpx;
        height: 160rpx;
        border-radius: 4rpx;
      }
      .mask {
        width: 160rpx;
        height: 160rpx;
        position: absolute;
        top: 0;
        background: rgba(0, 0, 0, 0.3);
      }
    }
  }
}
.bottom {
  display: flex;
  .leftBtn {
    width: 328rpx;
    height: 78rpx;
    background: #5cbb89;
    border-radius: 10rpx;
    line-height: 78rpx;
    color: #ffffff;
    font-size: 36rpx;
  }
  .rightBtn {
    width: 328rpx;
    height: 78rpx;
    line-height: 78rpx;
    color: #5cbb89;
    font-size: 36rpx;
    border: 2rpx solid #5cbb89;
    border-radius: 10rpx;
    background-color: #ffffff;
  }
}
</style>
