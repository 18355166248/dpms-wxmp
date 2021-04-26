<template>
  <div class="chargestandTitle">
    <div class="content ellipsis">
      <slot name="content"></slot>
    </div>
    <div class="extra">
      <slot name="extra"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'chargestandTitle',

};
</script>

<style lang="scss" scoped>
.chargestandTitle {
  width: 750rpx;
  box-sizing: border-box;
  height: 64rpx;
  padding: 0 32rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #eef8f3;
  .content, .extra {
    font-size: 30rpx;
    color: #5CBB89;
  }
  .content {
    width:560rpx;
  }
}
</style>
