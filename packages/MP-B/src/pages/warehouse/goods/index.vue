<template>
  <view class="goods">
    <sideScroll :value="0" :data="list" class="goods-left" />
    <view class="goods-main">
      <view>111111</view>
    </view>
  </view>
</template>
<script>
import sideScroll from '../components/sideScroll.vue'
export default {
  components: { sideScroll },
  data() {
    return {
      list: [
        {
          id: 0,
          name: '全部',
        },
        {
          id: 1,
          name: '一级分类',
        },
        {
          id: 2,
          name: '二级分类',
        },
        {
          id: 3,
          name: '三级分类',
        },
        {
          id: 4,
          name: '四级分类',
        },
        {
          id: 5,
          name: '五级分类',
        },
        {
          id: 6,
          name: '六级分类',
        },
        {
          id: 7,
          name: '七级分类',
        },
      ],
    }
  },
}
</script>
<style lang="scss" scoped>
.goods {
  width: 100%;
  height: 100%;
  display: flex;
  &-left {
    width: 200rpx;
    height: 100%;
  }
  &-main {
    flex: 1;
  }
}
</style>
