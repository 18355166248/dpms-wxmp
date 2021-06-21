<template>
  <view class="bodyDetails mh-24">
    <view
      class="singleContainer mv-32"
      v-for="(item, index) in approvalList.records"
    >
      <view class="firstLevel pt-32 ph-24 pb-16">
        <view style="font-weight: 500;">{{ item.approveTypeName }}</view>
        <view class="ApplicationOnPending">
          <view></view>
          <span>审核中</span>
        </view>
      </view>
      <view class="secondLevel ph-24">
        <view class="mb-8 lh">发起机构：{{ item.medicalInstitutionName }}</view>
        <view class="lh"
          >审核人：{{ item.operateApproveAuditor.staffName }}</view
        >
        <span class="mv-32 lh">{{ item.triggerCondition }}</span>
        <view class="note mb-40 lh">备注：{{ item.comment }}</view>
      </view>
      <view class="buttonControl pr-24">
        <u-button type="success" @click="clickHandler">查看</u-button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'requestApplied',
  props: {
    approvalList: {
      type: {},
      require: true,
    },
  },
  data() {
    return {
      value: '全部',
      type: 'select',
      show: false,
      activeTab: 0,
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
          text: '退费',
        },
        {
          value: '4',
          text: '领用',
        },
        {
          value: '5',
          text: '借调',
        },
        {
          value: '6',
          text: '病例',
        },
      ],
    }
  },
  methods: {
    // 点击actionSheet回调
    actionSheetCallback(index) {
      console.log((this.value = this.actionSheetList[index].value))
      this.value = this.actionSheetList[index].text
    },
    clickHandler(e) {
      console.log(e)
    },
    changeTab(index) {
      console.log('当前选中的项：' + index)
    },
    initData() {
      this.current = 1
      this.approvalList = []
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
  onload() {
    this.initData()
  },
  onReachBottom() {},
  onPullDownRefresh() {
    this.initData()
  },
}
</script>

<style lang="scss" scoped>
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
      }
      .ApplicationOnPending {
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
        width: 100%;
      }
      .note {
        white-space: nowrap;
        word-break: break-all;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
    .buttonControl {
      display: flex;
      flex-direction: row-reverse;
    }
  }
}
</style>
<style lang="scss">
.bodyDetails .singleContainer .buttonControl {
  button {
    width: 120rpx;
    height: 56rpx;
    line-height: 56rpx;
    background: #5cbb89;
    border-radius: 28rpx;
    padding: 0;
    font-size: 28rpx;
  }
}
</style>
