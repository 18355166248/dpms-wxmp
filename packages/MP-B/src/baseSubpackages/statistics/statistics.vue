<template>
  <view class="content">
    <tabs
      v-model="current"
      :scroll="false"
      :tabs="tabs"
      field="name"
      height="76rpx"
      lineHeight="4rpx"
      activeColor="#5CBB89"
      lineColor="#5CBB89"
      lineScale="0.2"
      @change="changeTab"
    />
    <view class="list">
      <view class="tit">新增患者性别分布</view>
      <view v-show="genderData.length">
        <canvas canvas-id="genderCanvas" id="genderCanvas" class="charts" />
        <view class="link" @click="link(1)">查看全部</view>
      </view>
      <view v-show="genderData.length === 0" class="empty">
        暂无统计数据
      </view>
    </view>
    <view class="list">
      <view class="tit">到诊类型分布</view>
      <view v-show="registerData.length">
        <canvas canvas-id="registerCanvas" id="registerCanvas" class="charts" />
        <view class="link" @click="link(2)">查看全部</view>
      </view>
      <view v-show="registerData.length === 0" class="empty">
        暂无统计数据
      </view>
    </view>
    <view class="list">
      <view class="tit">医生收款分布</view>
      <view v-show="doctorData.length">
        <canvas canvas-id="doctorCanvas" id="doctorCanvas" class="charts" />
        <view class="link" @click="link(3)">查看全部</view>
      </view>
      <view v-show="doctorData.length === 0" class="empty">
        暂无统计数据
      </view>
    </view>
    <view class="list">
      <view class="tit">诊疗项目收款</view>
      <view v-show="projectData.series.length">
        <canvas canvas-id="projectCanvas" id="projectCanvas" class="charts" />
        <view class="link" @click="link(4)">查看全部</view>
      </view>
      <view v-show="projectData.series.length === 0" class="empty">
        暂无统计数据
      </view>
    </view>
  </view>
</template>

<script>
import tabs from '@/components/tabs/tabs.vue'
import uCharts from '@/components/u-charts/u-charts.min.js'

export default {
  components: {
    tabs,
  },
  data() {
    return {
      current: 0,
      tabs: [
        { name: '昨天', val: 111 },
        { name: '近七天', val: 222 },
        { name: '近30天', val: 333 },
      ],
      cWidth: '',
      cHeight: '',
      pixelRatio: 1,
      genderData: [
        {
          name: '其他',
          data: 50,
        },
        {
          name: '男',
          data: 30,
        },
        {
          name: '女',
          data: 20,
        },
      ],
      registerData: [],
      doctorData: [],
      projectData: {
        categories: ['2012', '2013', '2014', '2015', '2016', '2017'],
        series: [15, 20, 45, 37, 43, 34],
      },
    }
  },
  onLoad() {
    this.cWidth = uni.upx2px(750)
    this.cHeight = uni.upx2px(608)
    this.showPie('genderCanvas', this.genderData)
    this.showPie('registerCanvas', this.registerData)
    this.showRing('doctorCanvas', this.doctorData)
    this.showColumn('projectCanvas', this.projectData)
  },
  methods: {
    changeTab(i) {
      console.log('当前选中的值：' + this.tabs[i].val)
    },
    showPie(canvasId, chartData) {
      new uCharts({
        $this: this,
        canvasId: canvasId,
        type: 'pie',
        legend: { show: true },
        pixelRatio: this.pixelRatio,
        series: chartData,
        width: this.cWidth * this.pixelRatio,
        height: this.cHeight * this.pixelRatio,
        dataLabel: true,
        extra: {
          pie: {
            lableWidth: 15,
          },
        },
      })
    },
    showRing(canvasId, chartData) {
      new uCharts({
        $this: this,
        canvasId: canvasId,
        type: 'ring',
        legend: { show: true },
        pixelRatio: this.pixelRatio,
        series: chartData,
        width: this.cWidth * this.pixelRatio,
        height: this.cHeight * this.pixelRatio,
        dataLabel: true,
        extra: {
          pie: {
            offsetAngle: -45,
            ringWidth: 40 * this.pixelRatio,
            lableWidth: 15,
          },
        },
      })
    },
    showColumn(canvasId, chartData) {
      new uCharts({
        $this: this,
        canvasId: canvasId,
        type: 'column',
        legend: { show: false },
        padding: [30, 15, 20, 15],
        pixelRatio: this.pixelRatio,
        categories: chartData.categories,
        series: [
          {
            name: '',
            data: chartData.series,
          },
        ],
        xAxis: {
          disableGrid: true,
        },
        yAxis: {
          //disabled:true
        },
        dataLabel: true,
        width: this.cWidth * this.pixelRatio,
        height: this.cHeight * this.pixelRatio,
        extra: {
          column: {
            type: 'group',
            width:
              (this.cWidth * this.pixelRatio * 0.45) /
              chartData.categories.length,
          },
        },
      })
    },
    link(type) {
      console.log(111)
      this.$utils.push({
        url:
          '/baseSubpackages/statistics/detail/detail?type=' +
          type +
          '&time=' +
          this.tabs[this.current].val,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.list {
  background-color: #fff;
  margin-top: 20rpx;
  .tit {
    font-size: 34rpx;
    line-height: 108rpx;
    padding: 0 32rpx;
  }
  .empty {
    font-size: 28rpx;
    text-align: center;
    color: rgba(0, 0, 0, 0.5);
    line-height: 320rpx;
  }
  .charts {
    width: 100%;
    height: 608rpx;
  }
  .link {
    font-size: 34rpx;
    color: #5cbb89;
    line-height: 108rpx;
    text-align: center;
    border-top: 2rpx solid rgba(0, 0, 0, 0.15);
  }
}
</style>
