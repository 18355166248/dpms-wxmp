<template>
  <div class="wrap">
    <div class="header">
      <div class="header-search">
        <couponSearch
          type="text"
          confirmType="search"
          placeholder="请输入优惠券名称"
          v-model="isSearchedValue"
          @change="changeValue"
          @search="searchPatients"
          @clear="cancelSearch"
        />
      </div>
      <div class="header-select">
        <picker
          mode="selector"
          @change="typePickerChange"
          :range="selectList"
          range-key="label"
        >
          <div class="uni-input">
            <div class="select-text">优惠券类型：{{ selectName }}</div>
            <div class="iconfont icon-closed"></div>
          </div>
        </picker>
      </div>
    </div>
    <div class="list">
      <scroll-view
        :scroll-y="true"
        style="height: 100%;"
        @scrolltolower="onScrollToLower"
      >
        <div v-if="!isEmpty">
          <div class="list-tips">
            <span
              class="iconfont icon-warning-circle"
              style="margin-right: 10rpx;"
            />
            卡券最多选择1张
          </div>
          <div class="list-wrap">
            <div
              class="list-wrap-item"
              v-for="item in list"
              :key="item.couponDefinitionId"
              @click="onClickCoupon(item)"
            >
              <div class="item-header">
                <div class="item-header-name coupon-name">
                  <span class="item-label">优惠券名称：</span>
                  <span class="item-value">{{ item.couponName || '-' }}</span>
                </div>
                <span
                  v-if="item.couponDefinitionId === couponDefinitionId"
                  class="iconfont icon-danxuan-xuanzhong"
                ></span>
                <span v-else class="iconfont icon-check-circle-no"></span>
              </div>

              <div class="item-type">
                <span class="item-label">优惠券类型：</span>
                <span class="item-value">{{
                  item.couponType | filterType
                }}</span>
              </div>
              <div class="item-footer">
                <div class="item-footer-date">
                  <span class="item-label">有效期：</span>
                  <span class="item-value">{{ getValidity(item) }}</span>
                </div>
                <div class="item-footer-num">
                  <span class="item-label">剩余总量：</span>
                  <span class="item-value">{{
                    item.surplusStock | filterStock
                  }}</span>
                </div>
              </div>
            </div>
            <load-more :status="dataSourceStatus.status" />
          </div>
        </div>
        <empty v-else text="暂无卡券" :disabled="true" />
      </scroll-view>
    </div>
    <div class="footer">
      <button class="ensurebutton" @click="onSubmit" :disabled="disabled">
        确定
      </button>
    </div>
  </div>
</template>

<script>
import patientAPI from '@/APIS/patient/patient.api'
import couponSearch from './couponSearch'
import empty from '@/components/empty/empty.vue'
import loadMore from '@/components/load-more/load-more.vue'
import { checkQwInstitution, getValidity } from '@/utils/utils'

export default {
  components: {
    couponSearch,
    loadMore,
    empty,
  },
  data() {
    return {
      isSearchedValue: '', //搜索框内的值
      couponName: '', //执行搜索的值
      selectList: [
        { label: '全部', value: null },
        { label: '折扣券', value: '1' },
        // { label: '套餐券（仅适用于创建机构）', value: '2' },
        { label: '代金券', value: '3' },
        { label: '满减券', value: '4' },
        // { label: '团购券', value: '5' },
      ],
      patientId: '',
      selectName: '全部',
      list: [],
      current: 1,
      size: 10,
      total: 0,
      couponType: null,
      dataSourceStatus: {
        // 数据列表的状态
        loading: true,
        status: 'loading',
        request: 'loading',
      },
      isEmpty: false,
      disabled: false,
      couponDefinitionId: '',
      grantManageId: '',
      env: '',
      isqywx: '',
      // 当前点击优惠券对应的渠道
      channelId: null,
    }
  },
  computed: {
    getValidity() {
      return function (record) {
        return getValidity(record)
      }
    },
  },
  onLoad(params) {
    checkQwInstitution()

    this.patientId = params.patientId
    this.customerId = params.customerId
    this.isqywx = params.isqywx
    const res = wx.getSystemInfoSync()
    this.env = res.environment || ''
    this.getCouponList()
    // if (this.isqywx === '1') {
    //   wx.hideHomeButton()
    // }
  },
  methods: {
    changeValue(e) {
      this.isSearchedValue = e.value
    },
    searchPatients() {
      this.current = 1
      this.list = []
      this.couponName = this.isSearchedValue
      this.couponDefinitionId = ''
      this.getCouponList()
    },
    cancelSearch() {
      this.isSearchedValue = ''
      this.couponName = ''
      this.current = 1
      this.list = []
      this.couponDefinitionId = ''
      this.getCouponList()
    },
    typePickerChange(e) {
      let { value = 0 } = e.detail
      value = parseInt(value)
      this.couponType = this.selectList[value].value
      this.selectName = this.selectList[value].label
      this.current = 1
      this.list = []
      this.couponDefinitionId = ''
      this.getCouponList()
    },
    async getCouponList() {
      this.dataSourceStatus.status = 'loading'
      try {
        const res = await patientAPI.getCouponTemplateListByName({
          current: this.current,
          size: this.size,
          channelId: 1,
          couponName: this.couponName,
          customerId: this.customerId,
          couponType: this.couponType,
        })
        const { total = 0, records = [] } = res.data
        this.list = this.current === 1 ? records : this.list.concat(records)
        this.total = total
        this.isEmpty = total === 0
        if (total === this.list.length) {
          this.dataSourceStatus.status = 'noMore'
        } else {
          this.dataSourceStatus.status = 'more'
        }
      } catch (error) {
        console.log(error)
        this.dataSourceStatus.status = 'noMore'
      }
    },
    onScrollToLower() {
      if (this.list.length < this.total) {
        this.current += 1
        this.getCouponList()
      }
    },
    onClickCoupon(counpon) {
      this.couponDefinitionId = counpon.couponDefinitionId
      this.grantManageId = counpon.grantManageId
      this.channelId = counpon.channelId
    },
    async onSubmit() {
      if (!this.couponDefinitionId) {
        return this.$dpmsUtils.show('请选择优惠劵')
      }
      const index = this.list.findIndex(
        (item) => item.couponDefinitionId === this.couponDefinitionId,
      )
      // uni.showLoading({
      //   title: '优惠劵发送中加载中',
      //   mask: true,
      // })
      const that = this
      try {
        this.disabled = true
        const resData = await patientAPI.createPromotion({
          couponType: this.couponType,
          channelId: this.channelId,
          customerId: this.customerId,
          couponDefinitionId: this.couponDefinitionId,
          receiveWay: 1,
          chargeWay: 1,
          remark: '',
          receiveType: 1,
          grantManageId: this.grantManageId,
        })

        // uni.hideLoading()

        if (resData.code === 0) {
          this.list[index].surplusStock && this.list[index].surplusStock--
          uni.showToast({
            title: '优惠券发送成功',
            icon: 'none',
            duration: 1000,
            mask: true,
            success(data) {
              setTimeout(() => {
                if (that.isqywx === '1') {
                  uni.redirectTo({
                    url: `/pages/patient/patient?patientId=${that.patientId}`,
                  })
                } else {
                  uni.navigateBack()
                }
              }, 1000)
            },
          })
        }
        this.disabled = false
      } catch (error) {
        console.log(error)
        uni.hideLoading()
        this.disabled = false
      }
    },
    async toSubmit() {},
    toWxWork() {
      // wx.qy.checkSession 需要先验证session_key有效，但是一直无效。。。
      wx.qy.sendChatMessage({
        msgtype: 'text', //消息类型，必填
        text: {
          content: '你获得了一张新优惠券', //文本内容
        },
        success: function (e) {
          console.log(e, 'success')
        },
        fail: function (e) {
          console.log(e, 'fail')
        },
        complete: function (e) {
          console.log(e, 'complete')
        },
      })
    },
  },
  filters: {
    filterType(type) {
      return (
        ['-', '折扣券', '套餐券', '代金券', '满减券', '团购券'][type] || '-'
      )
    },
    filterStock(num) {
      return !num && num !== 0 ? '-' : num
    },
  },
}
</script>

<style lang="scss" scoped>
.wrap {
  position: relative;
  box-sizing: border-box;
  font-family: PingFangSC, PingFangSC-Regular;
  height: 100vh;
  display: flex;
  flex-flow: column;
  .header {
    display: flex;
    justify-content: space-between;
    padding: 16rpx 32rpx;
    &-search {
      width: 354rpx;
    }
    &-select {
      width: 316rpx;
      background-color: #fff;
      border-radius: 8rpx;
      // padding: 0 32rpx;
      display: flex;
      align-items: center;
      .uni-input {
        height: 42rpx;
        font-size: 28rpx;
        display: flex;
        align-items: center;
        color: #595959;
        padding-left: 30rpx;
        .iconfont {
          font-size: 24rpx;
          margin-left: 8rpx;
        }
      }
    }
  }
  .list {
    position: relative;
    overflow-y: auto;
    flex: 1;
    &-tips {
      position: relative;
      height: 64rpx;
      // line-height: 64rpx;
      background-color: #fefcec;
      color: #f86e21;
      padding: 0 24rpx;
      font-size: 26rpx;
      display: flex;
      align-items: center;
    }
    &-wrap {
      position: relative;
      &-item {
        padding: 32rpx;
        font-size: 28rpx;
        line-height: 36rpx;
        background-color: #fff;
        margin-bottom: 16rpx;
        .item-header {
          display: flex;
          justify-content: space-between;
          .coupon-name {
            flex: 1;
            margin-right: 32rpx;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }

          .icon-check-circle-no {
            color: #d9d9d9;
          }

          .icon-danxuan-xuanzhong {
            color: #5cbb89;
          }
        }
        .item-type {
          margin-top: 16rpx;
        }
        .item-footer {
          margin-top: 16rpx;
          display: flex;
          justify-content: space-between;
        }
        .item-label {
          color: #4c4c4c;
        }
        .item-value {
          color: #191919;
        }
      }
    }
  }
  .footer {
    background-color: #fff;
    padding: 16rpx 32rpx;
    padding-bottom: 16rpx;
    padding-bottom: calc(8px + constant(safe-area-inset-bottom)); /* no */
    padding-bottom: calc(8px + env(safe-area-inset-bottom)); /* no */
    .ensurebutton {
      height: 80rpx;
      background: #5cbb89;
      border-radius: 40rpx;
      width: 686rpx;
      color: #fff;
      line-height: 80rpx;
    }
  }
}
</style>
