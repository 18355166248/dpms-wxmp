<template>
  <view class="bodyDetails mh-24">
    <scroll-view
      :scroll-y="true"
      class="content"
      lower-threshold="100"
      @scrolltolower="onScrollToLower"
    >
      <view
        class="singleContainer"
        v-for="(item, index) in approvalList"
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
            >发起机构：<span class="NormalText">
              {{ item.medicalInstitutionName }}
            </span></view
          >
          <view class="mb-8 lh"
            >发起人：<span class="NormalText">{{
              item.createStaffName
            }}</span></view
          >
          <view class="lh"
            >审核人：<span class="NormalText">{{
              item.candidateApproveAuditorNames
            }}</span></view
          >
          <span class="mv-32 lh NormalText">{{ item.triggerCondition }}</span>
          <view class="note mb-40 lh" v-show="item.comment"
            ><span>备注：</span
            ><span class="NormalText">{{ item.comment }}</span></view
          >
        </view>
        <view class="buttonControl pr-24">
          <!--          <u-button type="success" @click="showDetail(item)">查看</u-button>-->
          <u-button
            type="success"
            :custom-style="failedBtn"
            class="mh-16"
            @click="onFailHandler(item)"
            v-if="item.status === 0"
            >不通过</u-button
          >

          <u-button
            type="success"
            :custom-style="passedBtn"
            @click="onPassHandler(item)"
            v-if="item.status === 0"
            >通过</u-button
          >
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import approvalApi from '@/APIS/approval/approval.api'
export default {
  name: 'requestReview',
  props: {
    currentTab: {
      type: Number,
      default: 0,
    },
    approveTypeId: {
      type: String,
      default: '',
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
      medicalRecordId: null,
      approvalList: [],
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
      //是否正在加载数据
      isLoadingData: false,
      //是否没有数据了
      noMoreData: false,
    }
  },
  methods: {
    //下拉刷新重置参数
    reset() {
      this.approvalList = []
      this.current = 1
      this.total = 0
      this.getApprovalDetail()
    },
    onScrollToLower() {
      if (this.isLoadingData || this.approvalList.length >= this.total) {
        return
      }
      uni.showLoading({
        title: '数据加载中',
      })
      this.current += 1
      this.getApprovalDetail()
      setTimeout(() => {
        uni.hideLoading()
      }, 1000)
      console.log(149, this.current)
    },
    getApprovalDetail() {
      this.isLoadingData = true
      approvalApi
        .getApprovalDetail({
          approveTypeId: this.approveTypeId,
          current: this.current,
          size: this.size,
          tabType: this.currentTab + 1,
        })
        .then((res) => {
          if (res.code === 0) {
            if (res?.data?.records?.length > 0) {
              this.total = res.data.total
              this.approvalList = this.approvalList.concat(res.data.records)
            }
          } else {
            wx.showToast({
              title: '数据加载失败',
              icon: 'error',
              duration: 1000,
              mask: true,
            })
          }
        })
        .finally(() => {
          this.isLoadingData = false
        })
    },
    showDetail(item) {
      let url = {
        病例: `/pages/patient/medicalRecord/detail/?medicalRecordId=${item.businessId}&checkMedRecord=false`,
        收费: '/pages/charge/checkstand',
        退费: 'url',
        借调: 'url',
        领用: `/pages/warehouse/receive/detail?merchandiseReceiveOrderId=${item.businessId}`,
        退整单: 'url',
        退步骤: '',
        退金额: '',
        退项目: '',
      }
      wx.navigateTo({
        url: url[item.approveTypeName],
      })
    },
    onFailHandler(item) {
      wx.navigateTo({
        url: `/baseSubpackages/approvalManagement/components/applicationApprovalNote?data=${JSON.stringify(
          item,
        )}&applicationStatus=2`,
      })
    },
    onPassHandler(item) {
      wx.navigateTo({
        url: `/baseSubpackages/approvalManagement/components/applicationApprovalNote?data=${JSON.stringify(
          item,
        )}&applicationStatus=1`,
      })
    },
  },
  watch: {
    // currentTab: {
    //   handler(val) {
    //     console.log('审批的',val)
    //     if (val === 1) {
    //       this.getApprovalDetail()
    //     }
    //   },
    //   immediate: true,
    // },
    approveTypeId: {
      handler(val) {
        this.approvalList = []
        this.current = 1
        this.total = 0
        this.getApprovalDetail({ approveTypeId: val })
      },
      immediate: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.lh {
  line-height: 36rpx;
}
.content {
  margin-top: 32rpx;
  height: calc(100vh - 224rpx);
}
.NormalText {
  font-weight: 400;
  text-align: left;
  color: #191919;
  line-height: 36rpx;
  font-size: 28rpx;
  width: 100%;
  white-space: pre-wrap;
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
    box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(0, 0, 0, 0.1);
    background: #feffff;
    margin-bottom: 32rpx;
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
        display: flex;
        width: 100%;
        white-space: nowrap;
        word-break: break-all;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .ellipsis {
        width: 100%;
        white-space: nowrap;
        word-break: break-all;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
    .buttonControl {
      display: flex;
      flex-direction: row-reverse;
      padding-bottom: 32rpx;
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
