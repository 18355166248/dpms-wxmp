<template>
  <view style="height: 100%;">
    <view class="baseInfo">
      <text class="text ellipse">{{ baseInfo.title || '' }}</text>
      <text class="text ellipse">物品编号：{{ baseInfo.No || '' }}</text>
      <text class="text ellipse"
        >规格信息：{{ baseInfo.specification || '' }}</text
      >
      <view class="text"
        >可用库存：<text class="available ellipse"
          >{{ baseInfo.availableNum || '' }} {{ baseInfo.unit || '' }}</text
        ></view
      >
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
      <view v-if="recordList.length">
        <view class="record" v-for="(item, index) in recordList" :key="index">
          <view class="time">{{ item.time || '-' }}</view>
          <!--   入库记录 和 出库记录 有 类型  -->
          <view class="type" v-if="currentTab === 0 || currentTab === 1">{{
            item.type || '_'
          }}</view>
          <view class="amount">{{ item.value || '_' }}</view>
        </view>
        <view class="tips">已无更多数据</view>
      </view>
      <empty v-else :disabled="true" text="暂无数据" />
    </tabs>
  </view>
</template>
<script>
import tabs from '@/components/tabs/tabs.vue'
export default {
  components: { tabs },
  data() {
    return {
      currentTab: 0, //当前tab
      baseInfo: {
        title: '库存名称测试',
        No: 'ISO213123123123123123',
        specification: 'A型*20个/包',
        availableNum: 10,
        unit: '支',
      },
      tabs: [
        { name: '入库记录', val: 0 },
        { name: '出库记录', val: 1 },
        { name: '盘点记录', val: 2 },
        { name: '损益记录', val: 3 },
      ],
      recordList: [],
      mockData: [
        { time: '2020-1-1', type: '销售出库', value: '-1231223' },
        { time: '2020-1-1', type: '销售出库', value: '-1231223' },
        { time: '2020-1-1', type: '销售出库', value: '-1231223' },
        { time: '2020-1-1', type: '销售出库', value: '-1231223' },
        { time: '2020-1-1', type: '销售出库', value: '-1231223' },
        { time: '2020-1-1', type: '销售出库', value: '-1231223' },
        { time: '2020-1-1', type: '销售出库', value: '-1231223' },
        { time: '2020-1-1', type: '销售出库', value: '-1231223' },
        { time: '2020-1-1', type: '销售出库', value: '-1231223' },
        { time: '2020-1-1', type: '销售出库', value: '-1231223' },
        { time: '2020-1-1', type: '销售出库', value: '-1231223' },
        { time: '2020-1-1', type: '销售出库', value: '-1231223' },
        { time: '2020-1-1', type: '销售出库', value: '-1231223' },
        { time: '2020-1-1', type: '销售出库', value: '-1231223' },
        { time: '2020-1-1', type: '销售出库', value: '-1231223' },
        { time: '2020-1-1', type: '销售出库', value: '-1231223' },
        { time: '2020-1-1', type: '销售出库', value: '-1231223' },
        { time: '2020-1-1', type: '销售出库', value: '-1231223' },
      ],
    }
  },
  created() {
    this.recordList = this.mockData
  },
  methods: {
    changeTab(i) {
      this.currentTab = this.tabs[i].val
      // 测试空数据展示效果
      if (i === 1) {
        this.recordList = []
      } else {
        this.recordList = this.mockData
      }
      //  TO DO 切换页面的时候 刷新/获取当前tab的数据
    },
  },
}
</script>
<style lang="scss" scoped>
.baseInfo {
  background-color: #fff;
  margin-bottom: 14rpx;
  padding: 32rpx;
  .text {
    display: block;
    font-size: 28rpx;
    line-height: 36rpx;
    color: #4c4c4c;
    margin-bottom: 16rpx;
    &:first-child {
      color: #191919;
      font-weight: 500;
    }
    &:last-child {
      margin-bottom: 0;
    }
    .available {
      color: #fa8c16;
    }
  }
}
.record {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 96rpx;
  padding: 0 32rpx;
  background-color: #fff;
  border-bottom: 2rpx solid #f7f7f7;
  &:first-child {
    border-top: 4rpx solid #f7f7f7;
  }
  .time {
    font-size: 28rpx;
  }
  .type {
    font-size: 28rpx;
  }
  .amount {
    font-size: 28rpx;
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
</style>
