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
            v-model="defaultVal"
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
        :approvalList="approvalList"
      ></requestApplied>
      <requestReview
        v-if="currentTab === 1"
        :approvalList="approvalList"
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
      defaultVal: '全部',
      type: 'select',
      currentApprovalId: '',
      //approvalId为后端需要的字段
      actionSheetList: [
        {
          value: 0,
          text: '全部',
          approvalId: '',
        },
        {
          value: 1,
          text: '病历',
          approvalId: 1,
        },
        {
          value: 2,
          text: '收费',
          approvalId: 2,
        },
        {
          value: 3,
          text: '退费',
          approvalId: 3,
        },
        {
          value: 4,
          text: '借调',
          approvalId: 4,
        },
        {
          value: 5,
          text: '领用',
          approvalId: 5,
        },
        {
          value: 7,
          text: '退整单',
          approvalId: 7,
        },
        {
          value: 8,
          text: '退步骤',
          approvalId: 8,
        },
        {
          value: 9,
          text: '退金额',
          approvalId: 9,
        },
        {
          value: 10,
          text: '退项目',
          approvalId: 10,
        },
      ],
      //分页
      current: 1,
      size: 10,
      approvalList: {},
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
      console.log((this.value = this.actionSheetList[index].text))
      this.defaultVal = this.actionSheetList[index].text
      this.currentApprovalId = this.actionSheetList[index].approvalId
      this.resetParams()
      this.getApprovalDetail()
    },
    changeTab(index) {
      this.currentTab = index
      this.resetParams()
      this.getApprovalDetail()
    },
    resetParams() {
      this.current = 1
    },
    //获取我发起的审批列表
    getApprovalDetail() {
      approvalApi
        .getApprovalDetail({
          approveTypeId: this.currentApprovalId,
          current: this.current,
          size: this.size,
          tabType: this.currentTab + 1,
        })
        .then((res) => {
          if (res.code === 0) {
            this.current += 1
            this.approvalList = res.data
          }
        })
    },
    initData() {
      this.current = 1
      this.approvalList = []
    },
  },
  onLoad(options) {
    this.getApprovalDetail()
    if (options.currentTab) {
      this.currentTab = Number(options.currentTab)
    }
  },
  onShow() {
    this.initData()
    this.getApprovalDetail()
  },
  onPullDownRefresh() {
    this.getApprovalDetail()
  },
  onHide() {
    this.initData()
    this.getApprovalDetail()
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
