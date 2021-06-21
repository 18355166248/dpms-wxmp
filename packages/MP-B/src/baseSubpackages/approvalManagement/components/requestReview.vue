<template>
  <view class="bodyDetails mh-24">
    <scroll-view class="showDetail" @scrolltolower="onScrollToLower">
      <view
        class="singleContainer mv-32"
        v-for="(item, index) in approvalList.records"
        :key="index"
      >
        <view class="firstLevel pt-32 ph-24 pb-16">
          <view style="font-weight: 500;">{{ item.approveTypeName }}</view>
          <view>
            <view></view>
            <span>审核中</span>
          </view>
        </view>
        <view class="secondLevel ph-24">
          <view class="mb-8 lh"
            >发起机构：{{ item.medicalInstitutionName }}</view
          >
          <view class="lh"
            >审核人：{{ item.operateApproveAuditor.staffName }}</view
          >
          <span class="mv-32 lh">{{ item.triggerCondition }}</span>
          <view class="note mb-40 lh">备注：{{ item.comment }}</view>
        </view>
        <view class="buttonControl pr-24">
          <u-button type="success" @click="clickHandler">查看</u-button>
          <u-button
            type="success"
            :custom-style="failedBtn"
            class="mh-16"
            @click="clickHandler"
            >不通过</u-button
          >
          <u-button
            type="success"
            :custom-style="passedBtn"
            @click="onPassHandler"
            >通过</u-button
          >
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: 'requestReview',
  props: {
    approvalList: {
      type: {},
      require: true,
    },
  },
  data() {
    return {
      current: 1, //默认展示第一页数据
      size: 10, //默认展示10条数据
      total: 1, //默认总条目
      show: false,
      activeTab: 0,
      //uView按钮样式调整
      passedBtn: {
        background: '#ffffff',
        color: '#5cbb89',
        border: '2rpx solid #5cbb89',
        borderRadius: '30rpx',
      },
      failedBtn: {
        width: '148rpx',
        background: '#ffffff',
        color: '#5cbb89',
        border: '2rpx solid #5cbb89',
        borderRadius: '30rpx',
      },
    }
  },
  methods: {
    onScrollToLower() {
      if (this.approvalList.length < this.total) {
        this.current += 1
        //todo 调分页接口
      }
    },
    clickHandler() {},

    onPassHandler() {
      wx.navigateTo({
        url: '/baseSubpackages/approvalManagement/components/applicationOnPass',
      })
    },
    changeTab(index) {
      console.log('当前选中的项：' + index)
    },
    //onLoad中重置数据
    initData() {
      this.current = 1
      this.approvalList = []
    },
  },
  filters: {
    //过滤枚举
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
