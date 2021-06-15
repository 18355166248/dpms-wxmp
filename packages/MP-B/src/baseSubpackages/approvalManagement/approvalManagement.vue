<template>
  <view class="mainWrapper">
    <view class="topBar mb-18">
      <view>
        <span>我发起的</span>
      </view>
      <view>
        <span>我审核的</span>
      </view>
    </view>
    <view class="bodyDetails mh-24">
      <view class="typeSearch">
        <text style="line-height: 76rpx;">审批类型：</text>
        <view>
          <u-input v-model="value" :type="type" @click="show = true" border />
          <u-action-sheet
            :list="actionSheetList"
            v-model="show"
            @click="actionSheetCallback"
          >
          </u-action-sheet>
        </view>
      </view>
      <view class="singleContainer mt-32">
        <view class="firstLevel pt-32 ph-24 pb-16">
          <view style="font-weight: 500;">收费</view>
          <view>
            <view></view>
            <span>审核中</span>
          </view>
        </view>
        <view class="secondLevel ph-24">
          <view class="mb-8 lh">发起机构：</view>
          <view class="lh">审核人：</view>
          <span class="mv-32 lh">向武汉诊所借调物品</span>
          <view class="mb-40 lh">备注：</view>
        </view>
        <view class="buttonControl pr-24">
          <u-button type="success" @click="clickHandler">查看</u-button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      value: '全部',
      type: 'select',
      show: false,
      actionSheetList: [
        {
          value: '1',
          text: '全部',
        },
        {
          value: '2',
          text: '收费',
        },
        {
          value: '3',
          text: '借调',
        },
      ],
    }
  },
  methods: {
    // 点击actionSheet回调
    actionSheetCallback(index) {
      console.log((this.value = this.actionSheetList[index].text))
      this.value = this.actionSheetList[index].text
    },
    clickHandler(e) {
      console.log(e)
    },
  },

  filters: {
    filterEnums(value, arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].value === value) {
          return arr[i].text
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.mainWrapper {
  background: #f5f5f5;
  .lh {
    line-height: 36rpx;
  }
  .topBar {
    height: 96rpx;
    display: flex;
    flex-direction: row;
    justify-content: center;
    background: #ffffff;
    > view {
      line-height: 96rpx;
      width: 100%;
      text-align: center;
    }
  }
  .bodyDetails {
    .typeSearch {
      display: flex;
      flex-direction: row;
      > text {
        flex-shrink: 0;
      }
      > view {
        width: 100%;
        background: #ffffff;
        /deep/ .u-input__right-icon {
          line-height: 76rpx;
          padding-right: 10rpx;
        }
        /deep/ .u-input__input {
          height: 76rpx;
          padding-left: 10rpx;
        }
      }
    }
    .singleContainer {
      border-radius: 8rpx;
      width: 100%;
      height: 436rpx;
      box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(0, 0, 0, 0.1);
      background: #feffff;
      .firstLevel {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        > view {
          display: flex;
          align-items: center;
          > view {
            width: 16rpx;
            height: 16rpx;
            opacity: 1;
            background: #fa8c16;
            border-radius: 50%;
          }
          > span {
            margin-left: 16rpx;
            color: #fa8c16;
          }
        }
      }
      .secondLevel {
        display: flex;
        flex-direction: column;
        > view {
          color: #595959;
        }
      }
      .buttonControl {
        display: flex;
        flex-direction: row-reverse;
      }
      /deep/ .u-btn {
        width: 120rpx;
        height: 56rpx;
        line-height: 56rpx;
        background: #5cbb89;
        border-radius: 28rpx;
      }
      /deep/ .u-size-default {
        padding: 0;
        font-size: 28rpx;
      }
    }
  }
}
</style>
