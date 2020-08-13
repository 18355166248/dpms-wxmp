<template>
  <div class="notice" v-if="visible">
    <cover-view class="mask"></cover-view>
    <div class="inner">
      <div class="content" :style="{backgroundImage: `url(${notice.backgroundPictureUrl})`}">
        <div class="tit">{{notice.announcementTitle}}</div>
        {{notice.announcementContent}}
      </div>
      <div class="close" @click="visible = false">X</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import institutionAPI from '@/APIS/institution/institution.api'
export default {
  data() {
    return {
      notice: {},
      visible: false,
    }
  },
  computed: {
    ...mapState('loginStore', {
      MEDICALINSTITUTION: (state) => state.MEDICALINSTITUTION,
    }),
  },
  methods: {
    async getNotice() {
      const res = await institutionAPI.getNotice({
        medicalInstitutionId: this.MEDICALINSTITUTION.medicalInstitutionId,
      })
      this.notice = res.data
      this.visible = res.data?.enable
    },
  },
  created() {
    this.getNotice()
  },
}
</script>

<style scoped lang="scss">
.notice {
  position: relative;
  z-index: 10000;
  .mask {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.6);
  }
  .inner {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 600rpx;
    transform: translate(-50%, -50%);
    padding: 16rpx;
    background: linear-gradient(315deg, #81dbac, #5cbb89 99%);
    border-radius: 8rpx;
    margin-bottom: 110rpx;
    .content {
      background: white;
      border-radius: 8rpx;
      padding: 44rpx 32rpx;
      font-size: 28rpx;
      color: rgba(0, 0, 0, 0.65);
      line-height: 1.6;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      .tit {
        color: rgba(0, 0, 0, 0.9);
        font-size: 34rpx;
        text-align: center;
        margin-bottom: 24rpx;
      }
    }
    .close {
      position: absolute;
      bottom: -50rpx;
      left: 50%;
      transform: translate(-50%, 100%);
      width: 61rpx;
      height: 61rpx;
      background: #c2c2c2;
      color: #666;
      border-radius: 50%;
      font-size: 32rpx;
      font-weight: bold;
      line-height: 61rpx;
      text-align: center;
    }
  }
}
</style>