<template>
  <view class="bodyDetails mh-24">
    <scroll-view scroll-y class="content" @scrolltolower="onScrollToLower">
      <view
        class="singleContainer"
        v-for="(item, index) in approvalList.records"
        :key="index"
      >
        <view class="firstLevel pt-32 ph-24 pb-16">
          <view class="TypeDisplay">{{ item.approveTypeName }}</view>
          <view :class="approvalType[item.status].className">
            <view></view>
            <span>{{ approvalType[item.status].text }}</span>
          </view>
        </view>
        <view class="secondLevel ph-24">
          <view class="mb-8 lh"
            >发起机构：{{ item.medicalInstitutionName }}</view
          >
          <view class="lh"
            >审核人：<span class="NormalText">{{
              item.operateApproveAuditor.staffName
            }}</span></view
          >
          <span class="mv-32 lh NormalText">{{ item.triggerCondition }}</span>
          <view class="note mb-40 lh"
            >备注：<span class="NormalText">{{ item.comment }}</span></view
          >
        </view>
        <view class="buttonControl pr-24">
          <u-button type="success" @click="showDetail(item)">查看</u-button>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import approvalApi from '@/APIS/approval/approval.api'
export default {
  name: 'requestApplied',
  props: {
    approvalList: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      value: '全部',
      type: 'select',
      show: false,
      activeTab: 0,
      medicalRecordId: null,
      approvalType: {
        0: {
          text: '审核中',
          className: 'onPending',
        },
        1: {
          text: '已通过',
          className: 'passed',
        },
        2: {
          text: '未通过',
          className: 'failed',
        },
        3: {
          text: '撤回',
          className: 'reverted',
        },
      },
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
      current: 1, //默认展示第一页数据
      size: 10, //默认展示10条数据
      total: 1, //默认总条目
    }
  },
  methods: {
    // 点击actionSheet回调
    actionSheetCallback(index) {
      console.log((this.value = this.actionSheetList[index].value))
      this.value = this.actionSheetList[index].text
    },
    onScrollToLower() {
      if (this.approvalList.length < this.total) {
        this.getApprovalDetail()
        this.current += 1
      }
    },
    showDetail(item) {
      this.medicalRecordId = item.businessId
      wx.navigateTo({
        url: `/pages/patient/medicalRecord/detail?medicalRecordId=${this.medicalRecordId}`,
      })
    },
    getApprovalDetail() {
      approvalApi.getApprovalDetail({
        current: this.current,
        size: this.size,
      })
    },
    initData() {
      this.current = 1
      this.approvalList = []
    },
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
.content {
  margin-top: 32rpx;
  height: calc(100vh - 224rpx);
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
    margin-bottom: 32rpx;
    width: 100%;
    height: 436rpx;
    box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(0, 0, 0, 0.1);
    background: #feffff;
    .firstLevel {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .TypeDisplay {
        font-weight: 500;
        color: rgba(0, 0, 0, 0.9);
        line-height: 44rpx;
        font-size: 34rpx;
        text-align: left;
      }
      > view {
        display: flex;
        align-items: center;
      }
      .onPending {
        > view {
          width: 16rpx;
          height: 16rpx;
          opacity: 1;
          background: #0bd0da;
          border-radius: 50%;
        }
        > span {
          margin-left: 16rpx;
          color: #0bd0da;
        }
      }
      .reverted {
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
      .passed {
        > view {
          width: 16rpx;
          height: 16rpx;
          opacity: 1;
          background: #5cbb89;
          border-radius: 50%;
        }
        > span {
          margin-left: 16rpx;
          color: #5cbb89;
        }
      }
      .failed {
        > view {
          width: 16rpx;
          height: 16rpx;
          opacity: 1;
          background: #f2647c;
          border-radius: 50%;
        }
        > span {
          margin-left: 16rpx;
          color: #f2647c;
        }
      }
    }
    .secondLevel {
      display: flex;
      flex-direction: column;
      > view {
        color: #595959;
        width: 100%;
        line-height: 36rpx;
        font-size: 28rpx;
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
    .NormalText {
      font-weight: 400;
      text-align: left;
      color: #191919;
      line-height: 36rpx;
      font-size: 28rpx;
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
