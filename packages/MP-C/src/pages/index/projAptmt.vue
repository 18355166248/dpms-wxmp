<template>
  <scroll-view class="content" scroll-y>
    <view class="nav">
      <navigator
        class="navigator"
        url="navigate/navigate?title=navigate"
        hover-class="navigator-hover"
      >
        <button type="default">按预约项目</button>
      </navigator>
      <navigator
        class="navigator"
        url="navigate/navigate?title=navigate"
        hover-class="navigator-hover"
      >
        <button type="default">按医生预约</button>
      </navigator>
    </view>
    <view class="filter">
      <dpmsEnumsPicker
        enumsKey="VisType"
        v-model="form.visType"
        title="就诊类型"
        placeholder="请选择就诊类型"
      />
    </view>
  </scroll-view>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          value: 'USA',
          name: '美国',
        },
        {
          value: 'CHN',
          name: '中国',
          checked: 'true',
        },
        {
          value: 'BRA',
          name: '巴西',
        },
        {
          value: 'JPN',
          name: '日本',
        },
        {
          value: 'ENG',
          name: '英国',
        },
        {
          value: 'FRA',
          name: '法国',
        },
      ],
      index: '',
    }
  },
  onLoad() {},
  methods: {
    bindPickerChange: function (e) {
      console.log('picker发送选择改变，携带值为', e.target.value)
      this.index = e.target.value
    },
  },
  components: {},
}
</script>

<style>
.content {
  margin: 0 auto;
  height: 100%;
}
.nav {
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-top: 20rpx;
}
.navigator {
  width: 50%;
}
</style>
