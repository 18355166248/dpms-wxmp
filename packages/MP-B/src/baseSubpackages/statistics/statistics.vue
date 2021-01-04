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
    <view
      class="list"
      v-if="menu.pageElementsList.some((m) => m.enumValue === '11002')"
    >
      <view class="tit">新增患者性别分布</view>
      <view v-if="genderData.length">
        <canvas canvas-id="genderCanvas" id="genderCanvas" class="charts" />
        <view class="link" @click="link('genderData')">查看全部</view>
      </view>
      <view v-else class="empty">
        暂无统计数据
      </view>
    </view>
    <view
      class="list"
      v-if="menu.pageElementsList.some((m) => m.enumValue === '11003')"
    >
      <view class="tit">到诊类型分布</view>
      <view v-if="registerData.length">
        <canvas canvas-id="registerCanvas" id="registerCanvas" class="charts" />
        <view class="link" @click="link('registerData')">查看全部</view>
      </view>
      <view v-else class="empty">
        暂无统计数据
      </view>
    </view>
    <view
      class="list"
      v-if="menu.pageElementsList.some((m) => m.enumValue === '11004')"
    >
      <view class="tit">医生收款分布</view>
      <view v-if="doctorData.length">
        <canvas canvas-id="doctorCanvas" id="doctorCanvas" class="charts" />
        <view class="link" @click="link('doctorData')">查看全部</view>
      </view>
      <view v-else class="empty">
        暂无统计数据
      </view>
    </view>
    <view
      class="list"
      v-if="menu.pageElementsList.some((m) => m.enumValue === '11001')"
    >
      <view class="tit">诊疗项目收款</view>
      <view v-if="projectData.length">
        <canvas canvas-id="projectCanvas" id="projectCanvas" class="charts" />
        <view class="link" @click="link('projectData')">查看全部</view>
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
import { setStorage } from '@/utils/storage'
import { mapState } from 'vuex'

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
      current: 1,
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
      projectData: [],
      color: {
        男: '#5AD8A6',
        女: '#5D7092',
        初诊: '#5AD8A6',
        复诊: '#5D7092',
      },
    }
  },
  computed: {
    ...mapState({
      menu: (state) => state.workbenchStore.menu,
    }),
  },
  onLoad() {
    _self = this
    this.cWidth = uni.upx2px(750)
    this.cHeight = uni.upx2px(608)
    this.setCharts()
    this.getStatistics(this.current)
  },
  methods: {
    changeTab(i) {
      this.getStatistics(i)
    },
    getStatistics(i) {
      const _self = this
      statisticsAPI
        .getStatistics({
          type: this.tabs[i].val,
        })
        .then((res) => {
          const that = this
          const { data } = res

          data.patient = data.patient.sort((a, b) => {
            if (a.businessId === 0) {
              a.businessId = 99
            }
            if (b.businessId === 0) {
              b.businessId = 99
            }
            return a.businessId - b.businessId
          })

          const genderDataCount = data.patient.reduce(
            (acc, val) => acc + val.count,
            0,
          )
          if (genderDataCount) {
            this.genderData = data.patient.map((v) => {
              return {
                name: v.product,
                data: v.count,
                color: _self.color[v.product],
                format(val) {
                  return (
                    v.product +
                    ' ' +
                    ((v.count / genderDataCount) * 100).toFixed(2) +
                    '%'
                  )
                },
              }
            })
          } else {
            this.genderData = []
          }

          data.register = data.register.sort((a, b) => {
            if (a.businessId === 0) {
              a.businessId = 99
            }
            if (b.businessId === 0) {
              b.businessId = 99
            }
            return a.businessId - b.businessId
          })

          const registerDataCount = data.register.reduce(
            (acc, val) => acc + val.count,
            0,
          )
          if (registerDataCount) {
            this.registerData = data.register.map((v) => {
              return {
                name: v.product,
                data: v.count,
                color: _self.color[v.product],
                format(val) {
                  return (
                    v.product +
                    ' ' +
                    ((v.count / registerDataCount) * 100).toFixed(2) +
                    '%'
                  )
                },
              }
            })
          } else {
            this.registerData = []
          }

          const doctorDataCount = data.doctor.reduce(
            (acc, val) => acc + val.count,
            0,
          )
          this.doctorData = data.doctor.map((v) => {
            return {
              name: v.product,
              data: v.count,
              format(val) {
                return (
                  that.nameFilter(v.product) +
                  ' ' +
                  ((v.count / doctorDataCount) * 100).toFixed(2) +
                  '%'
                )
              },
            }
          })

          this.projectData = data.project.map((v) => {
            return {
              name: v.product,
              data: v.count,
              color: '#5B8FF9',
            }
          })

          this.$nextTick(() => {
            this.changeData()
          })
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
        categories: this.projectData.map((v) => v.name),
        series: [
          {
            name: '',
            data: this.projectData.map((v) => v.data),
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
            ringWidth: 40 * this.pixelRatio,
            lableWidth: 5,
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
          rotateLabel: true,
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
              (this.cWidth * this.pixelRatio * 0.45) / this.projectData.length,
          },
        },
      })
    },
    nameFilter(txt) {
      if (txt.length > 4) {
        return txt.slice(0, 3) + '…'
      }
      return txt
    },
    link(type) {
      setStorage('statistics_detail', this[type])

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
