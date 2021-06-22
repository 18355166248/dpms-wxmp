<template>
  <view style="height: 100%;">
    <view class="detail-info" @click="goToGoodDetail">
      <view class="detail-info-name mb16">
        <text>{{ baseInfo.commonName }}</text>
        <text v-if="baseInfo.merchandiseName"
          >/{{ baseInfo.merchandiseName }}</text
        >
        <text v-if="baseInfo.aliasName">/{{ baseInfo.aliasName }}</text>
      </view>
      <view class="mb16">
        <text class="label">物品编号：</text>
        <text class="value">{{ baseInfo.merchandiseNo }}</text>
      </view>
      <view class="mb16">
        <text class="label">规格信息：</text>
        <text class="value">{{ baseInfo.specificationsStr }}</text>
      </view>
      <view>
        <text class="label">可用库存：</text>
        <text class="value available">{{
          `${baseInfo.availableNum || 0} ${baseInfo.inventoryUnitStr || ''}`
        }}</text>
      </view>
    </view>
    <tabs
      sticky
      :value="currentTab"
      :scroll="false"
      :tabs="tabs"
      field="name"
      height="96rpx"
      fontSize="30rpx"
      lineHeight="4rpx"
      activeColor="#5CBB89"
      lineColor="#5CBB89"
      lineScale="0.30"
      @change="changeTab"
    >
      <!-- <scroll-view v-if="merchandiseId">
        
      </scroll-view> -->
      <view v-if="merchandiseId">
        <view v-show="currentTab === 0">
          <inputRecord :merchandiseId="merchandiseId" />
        </view>
        <view v-show="currentTab === 1">
          <outputRecord :merchandiseId="merchandiseId" />
        </view>
        <view v-show="currentTab === 2">
          <checkRecord :merchandiseId="merchandiseId" />
        </view>
        <view v-show="currentTab === 3">
          <increaseDecrease :merchandiseId="merchandiseId" />
        </view>
      </view>
    </tabs>
  </view>
</template>
<script>
import tabs from '@/components/tabs/tabs.vue'
import inputRecord from './components/input-record.vue'
import outputRecord from './components/output-record.vue'
import checkRecord from './components/check-record.vue'
import increaseDecrease from './components/increase-decrease.vue'
import goodAPI from '@/APIS/warehouse/good.api.js'
export default {
  components: {
    tabs,
    inputRecord,
    outputRecord,
    checkRecord,
    increaseDecrease,
  },
  data() {
    return {
      currentTab: 0, //当前tab
      baseInfo: {},
      tabs: [
        { name: '入库记录', val: 0 },
        { name: '出库记录', val: 1 },
        { name: '盘点记录', val: 2 },
        { name: '损溢记录', val: 3 },
      ],
      merchandiseId: null,
    }
  },
  onLoad({ merchandiseId }) {
    this.merchandiseId = merchandiseId
    this.getGoodsDetail(this.merchandiseId)
  },
  created() {},
  methods: {
    changeTab(i) {
      this.currentTab = this.tabs[i].val
    },
    async getGoodsDetail(merchandiseId) {
      const res = await goodAPI.getGoodsDetail({
        merchandiseId,
        getAvailableInventory: true,
      })
      console.log(97, res)
      this.baseInfo = res.data
    },
    // 前往物品详情页
    goToGoodDetail() {
      this.$dpmsUtils.push({
        url: `/pages/warehouse/goods/goodDetail?merchandiseId=${this.merchandiseId}`,
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.mb16 {
  margin-bottom: 16rpx;
}
.detail-info {
  width: 100%;
  padding: 32rpx 0 32rpx 32rpx;
  background-color: #ffffff;
  margin-bottom: 16rpx;
  &-name {
    font-size: 28rpx;
    color: #191919;
    font-weight: 500;
  }
  .label {
    font-size: 28rpx;
    color: #4c4c4c;
  }
  .value {
    font-size: 28rpx;
    color: #191919;
  }
  .available {
    color: #fa8c16;
  }
}
.tips {
  height: 96rpx;
  line-height: 96rpx;
  font-size: 28rpx;
  text-align: center;
  color: #7f7f7f;
}
.ellipse {
  width: 100%;
  white-space: nowrap;
  word-break: break-all;
  text-overflow: ellipsis;
  overflow: hidden;
}
.swiper {
  width: 100%;
  height: 100%;
}
</style>
