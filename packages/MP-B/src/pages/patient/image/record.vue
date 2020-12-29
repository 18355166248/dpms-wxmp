<template>
  <div>
    <div v-if="records.length">
      <div class="record" v-for="r in computedRecords" :key="r.registerId">
        <div class="head">
          <div>{{r.registerLabel}}</div>
          <div>{{r.storeName}}</div>
        </div>
        <div class="type">
          <div v-for="it in r.imageTypes" :key="it.value">
            <div class="label">{{it.label}}</div>
            <div class="imgs">
              <image 
                v-for="img in it.imgs" 
                :key="img.imageUrl"
                :src="img.imageUrl"
                @click="preview(it, img.imageUrl)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <empty :disabled="true" text="无影像记录" v-else />
    <div class="bottom">
      <button @click="$utils.push({url: `/pages/patient/image/upload?patientId=${patientId}`})">上传影像</button>
    </div>
  </div>
</template>

<script>
import diagnosisAPI from '@/APIS/diagnosis/diagnosis.api.js'
import moment from 'moment'
export default {
  data() {
    return {
      records: [], patientId: '', imageType: {},
    }
  },
  computed: {
    imageTypeList() {
      return Object.values(this.imageType).map(t => ({
        ...t, label: t.text.zh_CN
      }))
    },
    computedRecords() {
      return this.records.map(r => ({
        ...r, imageTypes: this.imageTypeList.filter(_it => r.teethImageList.some(_img => _img.imageType === _it.value))
        .map(_it => ({
          ..._it,
          imgs: r.teethImageList.filter(_img => _img.imageType === _it.value)
        }))
      }))
    }
  },
  methods: {
    async getImageList(param) {
      this.$utils.showLoading('加载中...')
      const res = await diagnosisAPI.getImageList(param)
      this.$utils.clearLoading()
      this.records = res.data.filter(d => d.teethImageList).map(d => ({
        ...d, registerLabel: moment(d.visTime).format('YYYY/MM/DD HH:mm')
      }))
    },
    async getImageEnums() {
      const res = await diagnosisAPI.getImageEnums()
      this.imageType = res.data.ImageType
    },
    preview({imgs}, current) {
      uni.previewImage({
        current,
        urls: imgs.map(img => img.imageUrl)
      })
    }
  },
  onLoad({patientId}) {
    this.patientId = patientId
    this.getImageEnums()
  },
  onShow() {
    this.getImageList({patientId: this.patientId})
  }
}
</script>

<style lang="scss" scoped>
.record{
  padding: 0 32rpx;
  margin-bottom: 20rpx;
  font-size: 28rpx;
  color: rgba(0,0,0,0.65);
  background: #feffff;
  .head{
    height: 84rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: solid 1rpx rgba(0,0,0,0.15);
  }
  .type{
    padding: 10rpx 0 12rpx;
    .label{
      color: rgba(0,0,0,0.5);
      line-height: 66rpx;
    }
    .imgs{
      display: grid;
      grid-template-columns: repeat(4, 160rpx);
      gap: 16rpx;
      margin-bottom: 20rpx;
      image{
        width: 160rpx;
        height: 160rpx;
        border-radius: 4rpx;
      }
    }
  }
}
.bottom{
  height: 90rpx;
  button{
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    height: 90rpx;
    background: #5cbb89;
    color: #ffffff;
    font-size: 36rpx;
    border-radius: 0;
  }
}
</style>