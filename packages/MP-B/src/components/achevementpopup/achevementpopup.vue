<template xlang="wxml">
  <view class="achevementpopup">
    <view
      class="achevementpopup-mask"
      :class="{ show: showpopup }"
      @tap="hide"
    ></view>
    <view class="achevementpopup-cnt" :class="{ show: showpopup }">
      <view class="achevementpopup-title">
        <view>绩效报表</view>
        <view
          class="achevementpopup-close iconfont icon-ar-close"
          @click="hide"
        ></view>
      </view>
      <view
        ><uni-grid :column="2" :square="false" borderColor="#e5e5e5">
          <uni-grid-item>
            <text
              class="achevementpopup-text"
              @click="toUrl('/pages/achievement/doctor')"
              v-if="menuPermission(['report-center', 'performance', 'doctors'])"
              >医生业绩</text
            >
          </uni-grid-item>
          <uni-grid-item>
            <text
              class="achevementpopup-text"
              @click="toUrl('/pages/achievement/consultant')"
              v-if="
                menuPermission(['report-center', 'performance', 'consultant'])
              "
              >咨询师业绩</text
            >
          </uni-grid-item>
        </uni-grid>
        <uni-grid :column="2" :square="false" borderColor="#e5e5e5">
          <uni-grid-item>
            <text
              class="achevementpopup-text"
              v-if="
                menuPermission([
                  'report-center',
                  'performance',
                  'assistant-manager',
                ])
              "
              @click="toUrl('/pages/achievement/assistant')"
              >医生助理业绩</text
            >
          </uni-grid-item>
          <uni-grid-item>
            <text
              class="achevementpopup-text"
              v-if="menuPermission(['report-center', 'performance', 'nurse'])"
              @click="toUrl('/pages/achievement/nurse')"
              >护士业绩</text
            >
          </uni-grid-item>
        </uni-grid>
        <uni-grid :column="2" :square="false" borderColor="#e5e5e5">
          <uni-grid-item>
            <text
              class="achevementpopup-text"
              v-if="menuPermission(['report-center', 'performance', 'triage'])"
              @click="toUrl('/pages/reports/triageStat/index')"
              >分诊业绩</text
            >
          </uni-grid-item>
          <uni-grid-item>
            <text
              class="achevementpopup-text"
              v-if="
                menuPermission(['report-center', 'performance', 'referral'])
              "
              @click="toUrl('/pages/reports/referralStat/index')"
              >转诊业绩</text
            >
          </uni-grid-item>
        </uni-grid>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'achevementpopup',
  data() {
    return {
      showpopup: false,
    }
  },
  methods: {
    hide() {
      this.showpopup = false
    },
    open() {
      this.showpopup = true
    },
    toUrl(url) {
      this.$dpmsUtils.push({
        url,
      })
      this.hide()
    },
  },
}
</script>

<style lang="scss" scoped>
.achevementpopup {
  .achevementpopup-mask {
    position: fixed;
    top: 0rpx;
    right: 0rpx;
    bottom: 0rpx;
    left: 0rpx;
    z-index: 9998;
    background-color: rgba(0, 0, 0, 0.6);
    opacity: 0;
    transition: all 0.3s ease;
    visibility: hidden;
  }
  .achevementpopup-mask.show {
    visibility: visible;
    opacity: 1;
  }
  .achevementpopup-cnt {
    background-color: #fff;
    border-radius: 24rpx 24rpx 0rpx 0rpx;
    position: fixed;
    right: 0rpx;
    bottom: 0rpx;
    left: 0rpx;
    z-index: 9999;
    transition: all 0.3s ease;
    transform: translateY(100%);
    height: 502rpx;
  }
  .achevementpopup-cnt.show {
    transform: translateY(0);
  }
  .achevementpopup-title {
    height: 94rpx;
    font-size: 34rpx;
    text-align: center;
    line-height: 98rpx;
    position: relative;
  }
  .achevementpopup-close {
    position: absolute;
    top: 0;
    right: 42rpx;
    font-size: 40rpx;
  }
  .achevementpopup-text {
    height: 136rpx;
    font-size: 30rpx;
    text-align: center;
    line-height: 136rpx;
  }
}
</style>
