<template>
  <view class="couponsCardBox">
    <div class="couponsUpperPart">
      <div class="upperContent">
        <!-- 左侧头像 -->
        <div class="contentLeft">
          <image class="couponsImg" :src="couponsImgSrc" />
        </div>
        <!-- 右侧主体 -->
        <div class="contentRight">
          <!-- 标题区域 -->
          <div class="titleBox">
            <span class="title">{{ title }}</span>
            <span v-if="shareMember === true" style="color: rgba(0, 0, 0, 0.65);margin-top: 4px"
                class="icon iconfont icon-team"
            ></span>
            <slot name="draw" v-bind:coupon="item"></slot>
          </div>
          <!-- 内容区域 -->
          <div class="content">{{ content }}</div>
          <!-- 脚部标签区域 -->
          <div class="footer">
            <span class="label">{{ couponsTypeName }}</span>
            <span v-show="tabCouponsType === 1 && remainingDays" class="days"
              >剩余{{ remainingDays }}天</span
            >
          </div>
        </div>
      </div>
    </div>
    <div class="circular"></div>
    <div class="couponsUnderPart">
      <div class="underContent">
        <div class="titleBox" @click="fold">
          <div>
            详细信息
            <span v-if="isFold" class="iconfont icon-arrow-up icon"></span>
            <span v-else class="iconfont icon-arrow-down icon"></span>
          </div>
          <div>{{ effectiveEndTimeStr }}</div>
        </div>
        <div class="explain" v-if="isFold">
          <div v-if="shareMember === true" class="sharePeople" style=" display:inline-block;">
            <span class="icon iconfont icon-team" style="color:rgba(0,0,0,0.65)"></span>
            <span style="margin-left: 2px">来自{{shareMemberName }}的共享</span>
          </div>
          <div>
            <span>使用须知：</span>
            <span>{{ notice }}</span>
          </div>
          <div>
            <span>注意事项：</span>
            <span>{{ noticeMatter }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 状态标签 -->
    <div v-show="verifiStatusName" v-if="tabCouponsType !== 1">
      <span class="couponStatusLabel">{{ verifiStatusName }}</span>
      <image class="couponStatusImg" src="../../static/coupon-failure.png" />
    </div>
  </view>
</template>

<script>
export default {
  name: 'couponsCard',
  props: {
    item: {
      type: Object,
    },
    couponsImgSrc: {
      type: String,
      default: null,
    },
    title: {
      type: String,
    },
    content: {
      type: String,
    },
    //使用状态：（未使用：1，已使用：2，已失效：3）
    tabCouponsType: {
      type: Number,
    },
    useCouponsType: {
      type: Number,
    },
    couponsType: {
      type: Number,
    },
    couponsTypeName: {
      type: String,
    },
    // 剩余天数
    remainingDays: {
      type: Number,
      default: null,
    },
    // 失效状态名称
    verifiStatusName: {
      type: String,
      default: null,
    },
    // 有效日期
    effectiveEndTimeStr: {
      type: String,
    },
    // 使用须知
    notice: {
      type: String,
    },
    // 注意事项
    noticeMatter: {
      type: String,
    },
    shareMember: {
      type: Boolean,
    },
    shareMemberName: {
      type: String,
    }
  },
  data() {
    return {
      isFold: false,
      sharedName: '张三'
    }
  },
  methods: {
    fold: function () {
      this.isFold = !this.isFold
    },
  },
}
</script>

<style lang="scss" scoped>
.couponsCardBox {
  position: relative;
  width: 100%;
  margin-bottom: 32rpx;
  filter: drop-shadow(0px 0px 51rpx rgba(0, 0, 0, 0.09));

  .circular {
    width: 100%;
    height: 28rpx;
    position: relative;
    background: radial-gradient(circle at left, transparent 14rpx, #ffffff 0)
        top left / 50% 100% no-repeat,
      radial-gradient(circle at right, transparent 14rpx, #ffffff 0) top right /
        50% 100% no-repeat;
  }

  .circular::before {
    content: '';
    height: 2rpx;
    width: 90%;
    border-bottom: 2rpx dashed rgba(0, 0, 0, 0.15);
    position: absolute;
    left: 38rpx;
    top: 0;
    bottom: 0;
    margin: auto;
  }

  .couponsUpperPart {
    width: 100%;
    background-color: white;
    border-top-right-radius: 8rpx;
    border-top-left-radius: 8rpx;
    .upperContent {
      padding: 32rpx 24rpx 12rpx;
      display: flex;
      flex-direction: row;
      .contentLeft {
        .couponsImg {
          width: 184rpx;
          height: 184rpx;
          border-radius: 4rpx;
          margin-right: 24rpx;
          border: 1px solid rgba(0, 0, 0, 0.09);
        }
      }
      .contentRight {
        .titleBox {
          display: flex;
          /*justify-content: space-between;*/
          justify-content: flex-start;
          margin-bottom: 16rpx;
          .title {
            color: rgba(0, 0, 0, 0.9);
            font-size: 34rpx;
            max-width: 302rpx;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        .content {
          font-size: 28rpx;
          color: rgba(0, 0, 0, 0.65);
          width: 446rpx;
          line-height: 44rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          margin-bottom: 8rpx;
        }

        .footer {
          display: flex;
          flex-direction: row;
          justify-content: space-between;

          .label {
            background-color: #fff7e6;
            color: #fa8c16;
            font-size: 26rpx;
            line-height: 40rpx;
            padding: 0 16rpx;
            border-radius: 2rpx;
          }
          .days {
            font-size: 22rpx;
            line-height: 32rpx;
            color: #f5232d;
          }
        }
      }
    }
  }
  .couponsUnderPart {
    width: 100%;
    background-color: white;
    border-bottom-right-radius: 8rpx;
    border-bottom-left-radius: 8rpx;
    .underContent {
      padding: 6rpx 20rpx 16rpx;
      .titleBox {
        display: flex;
        justify-content: space-between;
        font-size: 26rpx;
        color: rgba(0, 0, 0, 0.65);
        line-height: 36rpx;
        .icon {
          margin-left: 8rpx;
          font-size: 24rpx;
          color: rgba(0, 0, 0, 0.25);
        }
      }
      .explain {
        margin-top: 8rpx;
        word-break: break-all;
        .sharePeople {
          padding: 0 8rpx;
          height: 42rpx;
          line-height: 32rpx;
          background: rgba(0,0,0,0.02);
        }
        div {
          display: flex;
          flex-direction: row;
          justify-content: start;
          &:first-child {
            margin-bottom: 8rpx;
          }

          span {
            font-size: 22rpx;
            line-height: 34rpx;
            color: rgba(0, 0, 0, 0.5);
          }
          span:last-child {
            flex: 1;
          }
        }
      }
    }
  }
  .couponStatusLabel {
    position: absolute;
    top: 202rpx;
    right: 38rpx;
    color: rgba(250, 81, 81, 0.5);
    font-size: 28rpx;
    font-weight: 500;
    transform: rotate(-30deg);
  }
  .couponStatusImg {
    position: absolute;
    width: 108rpx;
    height: 108rpx;
    top: 168rpx;
    right: 24rpx;
  }
}
</style>
