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
      <view v-if="genderData.length">
        <canvas canvas-id="genderCanvas" id="genderCanvas" class="charts" />
        <view class="link" @click="link(1)">查看全部</view>
      </view>
      <view v-else class="empty">
        暂无统计数据
      </view>
    </view>
    <view class="list">
      <view class="tit">到诊类型分布</view>
      <view v-if="registerData.length">
        <canvas canvas-id="registerCanvas" id="registerCanvas" class="charts" />
        <view class="link" @click="link(2)">查看全部</view>
      </view>
      <view v-else class="empty">
        暂无统计数据
      </view>
    </view>
    <view class="list">
      <view class="tit">医生收款分布</view>
      <view v-if="doctorData.length">
        <canvas canvas-id="doctorCanvas" id="doctorCanvas" class="charts" />
        <view class="link" @click="link(3)">查看全部</view>
      </view>
      <view v-else class="empty">
        暂无统计数据
      </view>
    </view>
    <view class="list">
      <view class="tit">诊疗项目收款</view>
      <view v-if="projectData.series.length">
        <canvas canvas-id="projectCanvas" id="projectCanvas" class="charts" />
        <view class="link" @click="link(4)">查看全部</view>
      </view>
      <view v-else class="empty">
        暂无统计数据
      </view>
    </view>
  </view>
</template>

<script>
import statisticsAPI from '@/APIS/statistics.api'
import tabs from '@/components/tabs/tabs.vue'
import uCharts from '@/components/u-charts/u-charts.min.js'

var _self
var genderCanvas = null
var registerCanvas = null
var doctorCanvas = null
var projectCanvas = null

export default {
  components: {
    tabs,
  },
  data() {
    return {
      current: 0,
      tabs: [
        { name: '昨天', val: 1 },
        { name: '近七天', val: 7 },
        { name: '近30天', val: 30 },
      ],
      cWidth: '',
      cHeight: '',
      pixelRatio: 1,
      genderData: [],
      registerData: [],
      doctorData: [],
      projectData: {
        categories: [],
        series: [],
      },
    }
  },
  onLoad() {
    _self = this
    this.cWidth = uni.upx2px(750)
    this.cHeight = uni.upx2px(608)
    this.setCharts()
    this.getStatistics(0)
  },
  methods: {
    changeTab(i) {
      this.getStatistics(i)
    },
    getStatistics(i) {
      statisticsAPI
        .getStatistics({
          type: this.tabs[i].val,
        })
        .then((res) => {
          const { data } = res

          if (data.patient.reduce((acc, val) => acc + val.count, 0)) {
            this.genderData = data.patient.map((v) => {
              return {
                name: v.product,
                data: v.count,
                format(val) {
                  return v.count + '人 ' + val + '%'
                },
              }
            })
          } else {
            this.genderData = []
          }

          if (data.register.reduce((acc, val) => acc + val.count, 0)) {
            this.registerData = data.register.map((v) => {
              return {
                name: v.product,
                data: v.count,
                format(val) {
                  return v.count + '人 ' + val + '%'
                },
              }
            })
          } else {
            this.registerData = []
          }

          this.doctorData = data.doctor.map((v) => {
            return {
              name: v.product,
              data: v.count,
              format(val) {
                return _self.$utils.formatPrice(val)
              },
            }
          })

          this.projectData.categories = data.project.map((v) => v.product)
          this.projectData.series = data.project.map((v) => v.count)

          this.changeData()
        })
        .catch()
    },
    changeData() {
      genderCanvas.updateData({
        series: this.genderData,
      })
      registerCanvas.updateData({
        series: this.registerData,
      })
      doctorCanvas.updateData({
        series: this.doctorData,
      })
      projectCanvas.updateData({
        categories: this.projectData.categories,
        series: [
          {
            name: '',
            data: this.projectData.series,
            format(val) {
              return _self.$utils.formatPrice(val)
            },
          },
        ],
      })
    },
    setCharts() {
      genderCanvas = new uCharts({
        $this: this,
        canvasId: 'genderCanvas',
        type: 'pie',
        legend: { show: true },
        pixelRatio: this.pixelRatio,
        series: [],
        width: this.cWidth * this.pixelRatio,
        height: this.cHeight * this.pixelRatio,
        dataLabel: true,
        extra: {
          pie: {
            lableWidth: 15,
          },
        },
      })
      registerCanvas = new uCharts({
        $this: this,
        canvasId: 'registerCanvas',
        type: 'pie',
        legend: { show: true },
        pixelRatio: this.pixelRatio,
        series: [],
        width: this.cWidth * this.pixelRatio,
        height: this.cHeight * this.pixelRatio,
        dataLabel: true,
        extra: {
          pie: {
            lableWidth: 15,
          },
        },
      })
      doctorCanvas = new uCharts({
        $this: this,
        canvasId: 'doctorCanvas',
        type: 'ring',
        legend: { show: true },
        pixelRatio: this.pixelRatio,
        series: [],
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
      projectCanvas = new uCharts({
        $this: this,
        canvasId: 'projectCanvas',
        type: 'column',
        legend: { show: false },
        padding: [30, 15, 20, 15],
        pixelRatio: this.pixelRatio,
        categories: [],
        series: [
          {
            name: '',
            data: [],
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
              this.projectData.categories.length,
          },
        },
      })
    },
    link(type) {
      uni.navigateTo({
        url:
          '/baseSubpackages/statistics/detail/detail?type=' +
          type +
          '&time=' +
          this.tabs[this.current].val,
        animationType: 'slide-in-right',
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
