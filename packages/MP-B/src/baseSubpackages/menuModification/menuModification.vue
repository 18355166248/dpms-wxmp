<template>
  <view class="mainWrapper">
    <view class="topBar">
      <view class="topFirstRow">
        <view class="singleImgContainer" v-for="item in featuresToDisplay">
          <text :class="'iconfont ' + item.img"></text>
          <!--            <text class="iconfont icon-chart"></text>-->
          <view>{{ item.titleName }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'menuModification',
  data() {
    return {
      //后端返回数据mock
      mockData: [
        { img: 'icondiagnosis-treatment', titleName: '今日就诊' },
        { img: 'icondiagnosis-treatment', titleName: '库存' },
        { img: 'icondiagnosis-treatment', titleName: '患者' },
        { img: 'icondiagnosis-treatment', titleName: '物品一览' },
        { img: 'icondiagnosis-treatment', titleName: '领用' },
        { img: 'icondiagnosis-treatment', titleName: '预约' },
        { img: 'icondiagnosis-treatment', titleName: '采购' },
        { img: 'icondiagnosis-treatment', titleName: '审批' },
        { img: 'icondiagnosis-treatment', titleName: '归档患者' },
      ],
      //展示图标
      featuresToDisplay: [],
      //待定图标
      featuresOnHold: [],
    }
  },
  methods: {
    iconDisplay() {
      this.featuresToDisplay = this.mockData.slice(0, 7)
      this.featuresOnHold = this.mockData.slice(7)
      console.log('toDis', this.featuresToDisplay)
      console.log('OnHold', this.featuresOnHold)
    },
  },
  created() {
    this.iconDisplay()
  },
}
</script>

<style lang="scss" scoped>
.mainWrapper {
  .topBar {
    .topFirstRow {
      display: flex;
      flex-direction: row;
    }
  }
}
</style>
