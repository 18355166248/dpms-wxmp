<template>
  <div class="wrap">
    <div class="header">
      <div class="header-search">
        <couponSearch
          type="text"
          confirmType="search"
          placeholder="请输入优惠券名称"
          v-model="couponName"
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
            >
              <div class="item-header">
                <div class="item-header-name coupon-name">
                  <span class="item-label">优惠券名称：</span>
                  <span class="item-value">{{ item.couponName || '-' }}</span>
                </div>
                <div
                  :class="[
                    'item-switch',
                    { active: item.couponDefinitionId === couponDefinitionId },
                  ]"
                  @click="onClickCoupon(item.couponDefinitionId)"
                >
                  <span></span>
                </div>
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
                  <span class="item-value">{{
                    item.effectiveEndTime | filterDate
                  }}</span>
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
      couponName: '',
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
    }
  },
  onLoad(params) {
    this.patientId = params.patientId
    this.customerId = params.customerId
    this.getCouponList()
  },
  methods: {
    changeValue(e) {
      this.couponName = e.value
    },
    searchPatients() {
      this.current = 1
      this.list = []
      this.couponDefinitionId = ''
      this.getCouponList()
    },
    cancelSearch() {
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
      uni.showLoading({
        title: '数据加载中',
        mask: true,
      })
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

        uni.hideLoading()
      } catch (error) {
        console.log(error)
        this.dataSourceStatus.status = 'noMore'
        uni.hideLoading()
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
        return this.$utils.show('请选择优惠劵')
      }
      try {
        this.disabled = true
        const resData = await patientAPI.createPromotion({
          couponDefinitionId: this.couponDefinitionId,
          patientId: this.patientId,
          customerId: this.customerId,
          chargeWay: 1,
        })
        this.$utils.show('优惠劵发送成功')
        this.disabled = false
      } catch (error) {
        console.log(error)
        this.disabled = false
      }
    },
  },
  filters: {
    filterDate(date) {
      if (!date) return '-'
      return moment(date).format('YYYY-MM-DD')
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
        padding-left: 32rpx;
        .iconfont {
          font-size: 24rpx;
          margin-left: 10rpx;
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
      line-height: 64rpx;
      background-color: #fefcec;
      color: #f86e21;
      padding: 0 24rpx;
      font-size: 26rpx;
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

          .item-switch {
            position: relative;
            box-sizing: border-box;
            display: block;
            width: 32rpx;
            height: 32rpx;
            text-align: center;
            line-height: 32rpx;
            border-radius: 32rpx;
            border: 2rpx solid #d9d9d9;
          }

          .active {
            position: relative;
            border-color: #5cbb89;
            &::after {
              position: absolute;
              content: '';
              top: 8rpx;
              right: 8rpx;
              width: 16rpx;
              height: 16rpx;
              background-color: #5cbb89;
              border-radius: 16rpx;
            }
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
    padding-bottom: calc(16rpx + 'constant(safe-area-inset-bottom)');
    padding-bottom: calc(16rpx + 'env(safe-area-inset-bottom)');
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
