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
    <view class="filter"> </view>
  </scroll-view>
</template>

<script>
export default {
  data() {
    return {
      title: 'Hello',
    }
  },
  onLoad() {},
  methods: {},
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
