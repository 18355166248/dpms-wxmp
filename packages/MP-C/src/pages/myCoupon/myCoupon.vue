<template>
  <div class="myCouponPage">
    <div class="tab">
      <div :class="{active: tab === 1}" @click="tabClick(1)">未使用</div>
      <div :class="{active: tab === 2}" @click="tabClick(2)">已使用</div>
      <div :class="{active: tab === 3}" @click="tabClick(3)">已失效</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tab: 1,
    }
  },
  methods: {
    tabClick(tab) {
      this.tab = tab
    }
  }
}
</script>

<style lang="scss" scoped>
.myCouponPage{
  height: 100vh;
  background: rgba(0,0,0,0.04);
}
.tab{
  display: flex;
  line-height: 76rpx;
  background: white;
  justify-content: space-evenly;
  color: rgba(0,0,0,0.65);
  font-size: 28rpx;
  font-weight: 500;
  .active{
    color: #5cbb89;
    position: relative;
    &::before{
      content: '';
      position: absolute;
      width: 58rpx;
      height: 4rpx;
      background: #5cbb89;
      border-radius: 2rpx;
      top: 100%;
      left: 50%;
      transform: translate(-50%);
    }
  }
}
</style>