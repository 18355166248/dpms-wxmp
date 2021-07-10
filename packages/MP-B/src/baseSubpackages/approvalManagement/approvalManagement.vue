<template>
  <view class="mainWrapper">
    <view class="bodyDetails">
      <view class="topBar mb-18">
        <tabs
          style="width: 100%;"
          height="96rpx"
          v-model="currentTab"
          :scroll="false"
          :tabs="['我发起的', '我审核的']"
          color="#5cbb89"
          activeColor="#5cbb89"
          lineColor="#5cbb89"
          lineHeight="4rpx"
          lineRadius="2rpx"
          fontSize="30rpx"
          lineScale="0.2"
          @change="changeTab"
        ></tabs>
      </view>
      <view class="typeSearch mh-24">
        <text style="line-height: 76rpx;">审批类型：</text>
        <view>
          <u-input
            v-model="ListValue"
            :type="type"
            @click="show = true"
            border
          />
          <u-action-sheet
            :list="actionSheetList"
            v-model="show"
            @click="actionSheetCallback"
          >
          </u-action-sheet>
        </view>
      </view>
      <requestApplied
        v-if="currentTab === 0"
        :currentTab="currentTab"
        :approveTypeId="approveTypeId"
        ref="requestAppliedRef"
      ></requestApplied>
      <requestReview
        v-if="currentTab === 1"
        :currentTab="currentTab"
        :approveTypeId="approveTypeId"
        ref="requestReviewRef"
      ></requestReview>
    </view>
  </view>
</template>

<script>
import tabs from '@/components/tabs/tabs'
import requestApplied from '@/baseSubpackages/approvalManagement/components/requestApplied'
import requestReview from '@/baseSubpackages/approvalManagement/components/requestReview'
import approvalApi from '@/APIS/approval/approval.api'

export default {
  data() {
    return {
      show: false,
      currentTab: 0,
      type: 'select',
      approveTypeId: '', //approveTypeId为后端需要的字段
      actionSheetList: [],
      ListValue: '全部', //点击下拉框的值回显
    }
  },
  components: {
    tabs,
    requestApplied,
    requestReview,
  },
  methods: {
    // 点击actionSheet回调
    actionSheetCallback(index) {
      this.approveTypeId = this.actionSheetList[index].id
      this.ListValue = this.actionSheetList[index].text
    },
    changeTab(index) {
      this.currentTab = index
    },
  },
  onLoad() {
    approvalApi.getApprovalList().then((res) => {
      if (res.code === 0) {
        this.actionSheetList = res.data.map((item) => {
          return {
            text: item.approveTypeName,
            id: item.approveTypeId,
          }
        })
        this.actionSheetList.unshift({ text: '全部', id: '' })
      } else {
        wx.showToast({
          title: '数据加载失败',
          icon: 'error',
          duration: 1000,
          mask: true,
        })
      }
    })
  },
  onShow() {
    if (this.currentTab === 1) {
      this.$refs?.requestReviewRef?.reset()
    }
  },
  onPullDownRefresh() {
    if (this.currentTab === 0) {
      this.$refs?.requestAppliedRef?.reset()
    } else {
      this.$refs?.requestReviewRef?.reset()
    }
  },
}
</script>

<style lang="scss" scoped>
.mainWrapper {
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
          line-height: 76 rpx;
          padding-right: 10 rpx;
        }

        /deep/ .u-input__input {
          height: 76 rpx;
          padding-left: 10 rpx;
        }
      }
    }
  }
  background: #f5f5f5;
  /deep/ .u-input__right-icon {
    line-height: 76rpx;
    padding-right: 10rpx;
  }
  /deep/ .u-input__input {
    height: 76rpx;
    padding-left: 10rpx;
  }
}
</style>
