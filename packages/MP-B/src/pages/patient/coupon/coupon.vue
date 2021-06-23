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
          @change="datePickerChange"
          :value="dateIndex"
          :range="selectList"
          range-key="label"
        >
          <div class="uni-input">
            <div class="select-text">优惠券类型:{{ selectName }}</div>
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
        <div v-if="!isempty">
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
              @click="onClickCoupon(item.couponDefinitionId)"
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
                  <span class="item-value">{{ item | filterDate }}</span>
                </div>
                <div class="item-footer-num">
                  <span class="item-label">剩余总量：</span>
                  <span class="item-value">{{ item.surplusTotal }}</span>
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
import moment from 'moment'

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
        { label: '折扣券', value: 1 },
        { label: '套餐券（仅适用于创建机构）', value: 2 },
        { label: '现金券', value: 3 },
        { label: '满减券', value: 4 },
        { label: '团购券', value: 5 },
      ],
      dateIndex: 0,
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
      isempty: false,
      disabled: false,
      couponDefinitionId: '',
      env: '',
      isqywx: '',
    }
  },
  onLoad(params) {
    this.patientId = params.patientId
    this.customerId = params.customerId
    this.isqywx = params.isqywx
    const res = wx.getSystemInfoSync()
    this.env = res.environment || ''
    this.getCouponList()
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
    datePickerChange(e) {
      let { value = 0 } = e.detail
      value = parseInt(value)
      this.dateIndex = value
      this.couponType = value !== 0 ? value : null
      this.selectName = value === 2 ? '套餐券' : this.selectList[value].label
      this.current = 1
      this.list = []
      this.couponDefinitionId = ''
      this.getCouponList()
    },
    async getCouponList() {
      // uni.showLoading({
      //   title: '数据加载中',
      //   mask: true,
      // })
      try {
        const res = await patientAPI.getCouponTemplateListByName({
          current: this.current,
          size: this.size,
          couponName: this.couponName,
          patientId: this.patientId,
          couponType: this.couponType,
        })
        const { total = 0, records = [] } = res.data
        this.list = this.current === 1 ? records : this.list.concat(records)
        this.total = total
        this.isempty = total === 0
        if (total === this.list.length) {
          this.dataSourceStatus.status = 'noMore'
        } else {
          this.dataSourceStatus.status = 'more'
        }

        // uni.hideLoading()
      } catch (error) {
        console.log(error)
        this.dataSourceStatus.status = 'noMore'

        // uni.hideLoading()
      }
    },
    onScrollToLower() {
      if (this.list.length < this.total) {
        this.current += 1
        this.getCouponList()
      }
    },
    onClickCoupon(counpon) {
      this.couponDefinitionId = counpon
    },
    async onSubmit() {
      if (!this.couponDefinitionId) {
        return this.$dpmsUtils.show('请选择优惠劵')
      }
      uni.showLoading({
        title: '优惠劵发送中加载中',
        mask: true,
      })
      try {
        this.disabled = true
        const resData = await patientAPI.createPromotion({
          couponDefinitionId: this.couponDefinitionId,
          patientId: this.patientId,
          customerId: this.customerId,
          chargeWay: 1,
        })
        this.$dpmsUtils.show('优惠劵发送成功')
        uni.hideLoading()
        this.disabled = false
        uni.navigateBack()
        // if (this.isqywx === '1') {
        //   this.toWxWork()
        // }
      } catch (error) {
        console.log(error)
        uni.hideLoading()
        this.disabled = false
      }
    },
    toWxWork() {
      // wx.qy.chec
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
    filterDate(val) {
      const effectiveTimeType = val.effectiveTimeType
      const effectiveBeginTime =
        moment(val.effectiveBeginTime).format('YYYY-MM-DD') || null
      const effectiveEndTime =
        moment(val.effectiveEndTime).format('YYYY-MM-DD') || null
      const effectiveRange = {
        1: `领当日起，${val.effectiveDays}天内可用`,
        2: `领次日起，${val.effectiveDays}天内可用`,
        3: `${effectiveBeginTime}~${effectiveBeginTime}`,
      }[effectiveTimeType]

      return effectiveRange || '-'
    },
    filterType(type) {
      return (
        ['-', '折扣券', '套餐券', '现金券', '满减券', '团购券'][type] || '-'
      )
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
