<template>
  <view class="mainWrapper">
    <view class="topBar">
      <view>
        <span>我发起的</span>
      </view>
      <view>
        <span>我审核的</span>
      </view>
    </view>
    <view class="bodyDetails mh-24">
      <view class="typeSearch">
        <text style="line-height: 76rpx;">审批类型： </text>
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
          <view>收费</view>
          <view>
            <view></view>
            <span>审核中</span>
          </view>
        </view>
        <view class="secondLevel">
          <view class="secondLevelLeft mh-16 mv-16">
            <view>
              <span class="mr-16">发起机构：</span>
              <span>审核人：</span>
            </view>
            <view>向武汉诊所借调物品</view>
            <view>备注：</view>
          </view>
          <view class="secondLevelRight mh-16 mv-16">
            <view>查看</view>
          </view>
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
  .topBar {
    height: 96rpx;
    display: flex;
    flex-direction: row;
    justify-content: center;
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
          }
        }
      }
      .secondLevel {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .secondLevelLeft {
          display: flex;
          flex-direction: column;
        }
      }
    }
  }
}
</style>
