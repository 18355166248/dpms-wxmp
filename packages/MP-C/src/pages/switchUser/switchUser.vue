<template>
  <view class="switch-user-content">
    <view class="switch-title">
      <view class="title-info">根据您在诊所预留的手机号<span>{{ mobile || '' }}</span></view>
      <view class="title-info">查询出如下人员信息，请选择您需要查看的人员</view>
    </view>
    <view class="switch-content">
      <view class="user-info"
        v-for="(item, index) in customerList"
        :key="item.customerId"
        :class="{firstChiled: index === 0, selectActive: currentImg === item.customerId}"
        @click="selectInfo(item)"
      >
        <view class="user-name">姓名：<span>{{item.customerName}}</span></view>
        <view v-if="item.patientNo" :style="{marginTop: '12rpx'}" class="medical-record">病历号：<span>{{item.patientNo}}</span></view>
        <image v-if="currentImg === item.customerId"  class="icon-checked" :src="checkdUrl">
      </view>
      <empty
        v-if="!customerList.length"
        :disabled="true"
        text="暂无可绑定人员"
      />
    </view>
    <view v-if="customerList.length" class="switch-btn">
      <a @click="selectUser">确认绑定</a> 
    </view>
  </view>
</template>

<script>

import customerAPI from '@/APIS/customer/customer.api'
import { getStorage, setStorage, STORAGE_KEY } from '@/utils/storage'
export default {
  data() {
    return {
      mobile: null,
      checkdUrl: '/static/icon-checkd@2.png',
      currentImg: null,
      customerList: []
    }
  },
  created() {
    this.getCustomerList()
  },
  methods: {
    getCustomerList () {
      uni.showLoading({
        title: '数据加载中',
        mask: true,
      })
      customerAPI
        .getBindCustomerList({ userId: getStorage(STORAGE_KEY.STAFF).id })
        .then((res) => {
          if(res.code === 0) {
            this.customerList = res.data?.customerList
            this.mobile = res.data?.mobile
            this.currentImg = getStorage(STORAGE_KEY.CUSTOMERID)
          }
          uni.hideLoading()
        }).catch((res) => {
          uni.hideLoading()
        })
    },
    selectInfo(info) {
      this.currentImg = info.customerId
    },
    selectUser() {
      customerAPI
        .bindCustomer({ userId: getStorage(STORAGE_KEY.STAFF).id, customerId: this.currentImg })
        .then((res) => {
          setStorage(STORAGE_KEY.CUSTOMERID, this.currentImg)
          if (res.code === 0) {
            this.$utils.reLaunch({ url: '/pages/index/index' })
          }
        })
    }
  },
}
</script>

<style lang="scss" scoped>
  .switch-user-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .switch-title {
      height: 80rpx;
      padding: 32rpx 0 24rpx;
      background: #ffffff;
      flex-grow: 0;
      flex-shrink: 0;
      .title-info {
        font-size: 28rpx;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: center;
        color: #4c4c4c;
        line-height: 40rpx;
        height: 40rpx;
        white-space:nowrap;
        & > span {
          font-weight: 750;
          color: #5cbb89;
        }
      }
    }
    .switch-content {
      flex-grow: 1;
      flex-shrink: 1;
      overflow-y: auto;
      .user-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 144rpx;
        margin: 24rpx 32rpx 0;
        padding: 24rpx 32rpx;
        font-size: 28rpx;
        box-sizing: border-box;
        background: #ffffff;
        border-radius: 8rpx;
        position: relative;
        border: 2rpx solid transparent;
        overflow: hidden;
        & > .user-name, & > .medical-record {
          font-size: 28rpx;
          color: rgba(0,0,0,0.90);
          & > span {
            font-size: 28rpx;
            color: rgba(0,0,0,0.70);
          }
        }
      }
    //   & > .user-info:last-child {
    //     margin-bottom: 12px;
    //   }
      .firstChiled{
        margin-top: 16px;
      }
      .selectActive {
        border-color: #5cbb89;
      }
      .user-name, .medical-record {
        font-size: 14px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: left;
        color: rgba(0,0,0,0.90);
        line-height: 22px;
      }
      .icon-checked {
        width: 32px;
        height: 32px;
        position: absolute;
        right: -2px;
        bottom: -2px;
      }
    }
    .switch-btn {
      width: 100%;
      height: 90rpx;
      line-height: 90rpx;
      margin-top: 24rpx;
      background: #5cbb89;
      text-align: center;
      align-self: flex-end;
      & > a {
        display: inline-block;
        width: 100%;
        padding: 24rpx 0;
        box-sizing: border-box;
        color: #ffffff;
        font-size: 36rpx;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: center;
        line-height: 44rpx;
      }
    }
  }
</style>