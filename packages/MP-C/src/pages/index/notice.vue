<template>
  <div class="notice" v-if="visible">
    <div class="mask"></div>
    <div class="inner">
      <div
        class="content"
        :style="{ backgroundImage: `url(${notice.backgroundPictureUrl})` }"
      >
        <div class="tit">{{ notice.announcementTitle || '' }}</div>
        {{ notice.announcementContent || '' }}
      </div>
      <div class="iconfont icon-close" @click="visible = false"></div>
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
    if (this.MEDICALINSTITUTION) {
      this.getNotice()
    }
  },
  watch: {
    'MEDICALINSTITUTION.medicalInstitutionId'(newVal) {
      if (!newVal) return
      this.getNotice()
    },
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
    z-index: 1;
    top: 46%;
    left: 50%;
    width: 600rpx;
    transform: translate(-50%, -50%);
    padding: 16rpx;
    background: linear-gradient(315deg, #81dbac, #5cbb89 99%);
    border-radius: 8rpx;
    .content {
      background: white;
      border-radius: 8rpx;
      padding: 44rpx 32rpx;
      font-size: 28rpx;
      color: rgba(0, 0, 0, 0.65);
      line-height: 1.6;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      overflow: auto;
      height: 700rpx;
      word-break: break-word;
      .tit {
        color: rgba(0, 0, 0, 0.9);
        font-size: 34rpx;
        text-align: center;
        margin-bottom: 24rpx;
      }
    }
    .icon-close {
      position: absolute;
      bottom: -44rpx;
      left: 50%;
      transform: translate(-50%, 100%);
      color: #c2c2c2;
      font-size: 70rpx;
    }
  }
}
</style>
