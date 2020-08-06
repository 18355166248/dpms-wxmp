<template>
  <view
    :style="{
      paddingTop: navHeight + 'px',
      height: viewHeight,
    }"
    class="home-view"
  >
    <view class="home-bg">
      <image
        class="home-bg-img"
        src="https://medcloud.oss-cn-shanghai.aliyuncs.com/dental/saas/mini-app/home-header-bg.png"
      ></image>
    </view>

    <nav-bar
      :navHeight="navHeight"
      :navTop="navTop"
      :capsuleHeight="capsuleHeight"
    />

    <mescroll-body
      ref="mescrollRef"
      @init="mescrollInit"
      @down="downCallback"
      @up="upCallback"
      :down="downOption"
      :up="upOption"
      :top="scrollTop"
      :height="scrollHeight"
    >
      <view class="header-wrapper mh-32 pt-47">
        <view class="header">
          <view class="header-search-wrapper mr-24">
            <input
              class="header-search-wrapper-input"
              confirm-type="search"
              placeholder="搜索"
              @click="toUrl('/pages/patient/searchPatient/searchPatient')"
            />
            <text class="iconfont icon-search"></text>
          </view>
          <view
            class="icon-warpper"
            @click="toUrl('/pages/patient/createPatient/createPatient')"
          >
            <text class="iconfont icon-plus"></text>
          </view>
        </view>
        <view class="c-white mt-36 fz-34">你好，{{ staffName }}</view>
      </view>
      <view class="ph-32">
        <view class="statistics pv-32">
          <view class="statistics-header" @click="toggle">
            今日统计

            <text v-if="visible" class="iconfont icon-no-eye ml-18"></text>
            <text v-else class="iconfont icon-eye ml-18"></text>
          </view>
          <view class="statistics-body">
            <view class="statistics-item">
              <view class="statistics-item-header">
                <toggle
                  :text="pageData.patientCount"
                  :isVisible="visible"
                ></toggle>
              </view>
              <text class="statistics-item-body">新增患者</text>
            </view>
            <view class="statistics-item">
              <view class="statistics-item-header">
                <toggle
                  :text="pageData.appointmentCount"
                  :isVisible="visible"
                ></toggle>
              </view>

              <text class="statistics-item-body">新增预约</text>
            </view>
            <view class="statistics-item">
              <view class="statistics-item-header">
                <toggle
                  :text="pageData.registerFirstDiagnosisCount"
                  :isVisible="visible"
                ></toggle>
                /
                <toggle
                  :text="pageData.registerCount"
                  :isVisible="visible"
                ></toggle>
              </view>
              <text class="statistics-item-body">今日就诊</text>
            </view>
            <view class="statistics-item">
              <view class="statistics-item-header">
                <toggle :text="price" :isVisible="visible"></toggle>
              </view>
              <text class="statistics-item-body">实收金额</text>
            </view>
          </view>
        </view>
        <view class="menu-area mt-68">
          <view class="menu-area-header">
            常用功能
          </view>
          <view class="menu-area-body mt-32">
            <view
              class="menu-area-item"
              @click="toUrl('/baseSubpackages/todayWork/todayWork')"
            >
              <view class="menu-area-item-icon menu-area-item-icon-color1">
                <text class="iconfont icon-medicine-chest"></text>
              </view>
              <view class="menu-area-item-txt mt-24">
                今日就诊
              </view>
            </view>
            <view
              class="menu-area-item"
              @click="toUrl('/baseSubpackages/apptView/apptView')"
            >
              <view class="menu-area-item-icon menu-area-item-icon-color2">
                <text class="iconfont icon-clock"></text>
              </view>
              <view class="menu-area-item-txt mt-24">
                预约
              </view>
            </view>
            <view
              class="menu-area-item"
              @click="toUrl('/pages/patient/searchPatient/searchPatient')"
            >
              <view class="menu-area-item-icon menu-area-item-icon-color3">
                <text class="iconfont icon-patient"></text>
              </view>
              <view class="menu-area-item-txt mt-24">
                患者
              </view>
            </view>
          </view>
        </view>
      </view>
    </mescroll-body>
  </view>
</template>

<script>
import moment from 'moment'
import navBar from '@/components/nav-bar/nav-bar'

// 引入mescroll-mixins.js

import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js'
// 引入mescroll-body组件 (如已在main.js注册全局组件,则省略此步骤)
import MescrollBody from '@/components/mescroll-uni/mescroll-body.vue' // 注意.vue后缀不能省
import diagnosisAPI from '@/APIS/diagnosis/diagnosis.api'

import { getStorage, STORAGE_KEY } from '@/utils/storage'
import toggle from '@/components/toggle/toggle'

export default {
  mixins: [MescrollMixin], // 使用mixin
  components: {
    navBar,
    MescrollBody,
    toggle,
  },
  data() {
    return {
      title: '首页',
      visible: true,

      // 下拉刷新的配置(可选, 绝大部分情况无需配置)
      downOption: {
        textColor: '#fff',
        textLoading: '正在加载',
      },
      scrollTop: '0px',

      // 上拉加载的配置(可选, 绝大部分情况无需配置)
      upOption: {
        isLock: true,
        use: false,
      },
      // 列表数据
      pageData: {
        patientCount: 0,
        appointmentCount: 0,
        registerFirstDiagnosisCount: 0,
        registerCount: 0,
        actualIncome: 0,
      },
    }
  },

  computed: {
    capsuleHeight: function () {
      return `${this.menuButtonObject.height}px`
    },
    windowHeight: function () {
      return this.systemInfoObject.windowHeight
    },
    navHeight: function () {
      return (
        this.systemInfoObject.statusBarHeight +
        this.menuButtonObject.height +
        (this.menuButtonObject.top - this.systemInfoObject.statusBarHeight)
      )
    },
    menuButtonObject: function () {
      return uni.getMenuButtonBoundingClientRect()
    },
    systemInfoObject: function () {
      console.log('SystemInfoSync:', this.$systemInfo)
      return this.$systemInfo
    },
    staffName: function () {
      return getStorage(STORAGE_KEY.STAFF)
        ? getStorage(STORAGE_KEY.STAFF).staffName
        : '--'
    },
    price: function () {
      return this.$utils.formatPrice(this.pageData.actualIncome)
    },
    scrollHeight: function () {
      return this.windowHeight - this.navHeight + 'px'
    },
    // 计算属性的 getter
    navTop: function () {
      return `${this.menuButtonObject.top}px`
    },
    viewHeight() {
      return this.windowHeight - this.navHeight + 'px'
    },
  },

  methods: {
    toUrl(url) {
      this.$utils.push({
        url,
      })
    },
    toggle() {
      this.visible = !this.visible
    },
    /*下拉刷新的回调, 有三种处理方式:*/
    downCallback() {
      diagnosisAPI
        .getTodayWorkStatistics({
          beginTimestamp: moment().startOf('day').valueOf(),
          endTimestamp: moment().endOf('day').valueOf(),
        })
        .then((res) => {
          this.pageData = res.data
          // 请求成功,隐藏加载状态
          this.mescroll.endSuccess()
        })
        .catch((err) => {
          // 请求失败,隐藏加载状态
          this.mescroll.endErr()
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.home-view {
  .home-bg {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 0;
    &-img {
      width: 100%;
    }
  }
  .header-wrapper {
    .header {
      $height: 76rpx;
      $frontColor: #feffff;

      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-around;
      &-search-wrapper {
        flex: 1;
        position: relative;
        height: $height;
        background: $frontColor;
        border-radius: 8rpx;
        padding-left: 80rpx;
        color: rgba(0, 0, 0, 0.25);
        &-input {
          width: 100%;
          height: $height;
          line-height: $height;
        }
        .iconfont {
          position: absolute;
          left: 28rpx;
          top: 50%;
          transform: translateY(-50%);
          font-size: 32rpx;
        }
      }
      .icon-warpper {
        width: $height - 4rpx;
        height: $height - 4rpx;
        line-height: $height - 4rpx;
        border: 2rpx solid $frontColor;
        border-radius: 8rpx;
        text-align: center;
        color: $frontColor;
        .iconfont {
          font-size: 42rpx;
        }
      }
    }
  }
  .status_bar {
    height: var(--status-bar-height);
    width: 100%;
  }
  .statistics {
    margin-top: 64rpx;
    padding: 32rpx 0;
    background: #feffff
      url(data:image/png;base64,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)
      no-repeat right 18rpx;
    background-size: 126rpx 136rpx;
    border-radius: 8rpx;
    box-shadow: 0 20rpx 20rpx 0 rgba(0, 0, 0, 0.09);

    &-header {
      color: rgba(0, 0, 0, 0.9);
      padding: 0 32rpx;
      font-size: 34rpx;
      margin-bottom: 48rpx;
      .iconfont {
        font-size: 36rpx;
      }
    }
    &-body {
      display: flex;
      flex-direction: row;
      .statistics-item {
        display: flex;
        flex-direction: column;
        flex: 1;
        padding: 0;
        border-right: 1rpx dashed rgba(0, 0, 0, 0.15);
        justify-content: center;
        align-items: center;

        &-header {
          margin-bottom: 16rpx;
          font-size: 34rpx;
        }

        &-body {
          color: rgba(0, 0, 0, 0.45);
          font-size: 24rpx;
        }

        &:last-child {
          border: none;
        }
      }
    }
  }
  .menu-area {
    $width: 112rpx;

    @mixin colors($linearStartColor, $linearEndColor) {
      box-shadow: 0px 20px 20px -20px $linearEndColor;
      background: linear-gradient(
        323deg,
        $linearStartColor 10%,
        $linearEndColor 89%
      );
    }

    &-body {
      display: flex;
      flex-direction: row;
      .menu-area-item {
        width: $width;
        margin-right: 80rpx;
        text-align: center;
        &-icon {
          width: $width;
          height: $width;
          line-height: $width;
          border-radius: 40rpx;
          text-align: center;
          color: #fff;
          .iconfont {
            font-size: 60rpx;
          }
        }
        &-icon-color1 {
          $values: rgba(91, 218, 153, 1), rgba(52, 197, 122, 1);
          @include colors($values...);
        }
        &-icon-color2 {
          $values: rgba(254, 178, 119, 1), rgba(251, 141, 81, 1);
          @include colors($values...);
        }
        &-icon-color3 {
          $values: rgba(110, 167, 252, 1), rgba(74, 147, 254, 1);
          @include colors($values...);
        }

        &-txt {
          font-size: 28rpx;
        }
      }
    }
  }
}
</style>
