<template>
  <div>
    <dpmsCellInput
      title="预约门店"
      isRequired
      inputType="picker"
      placeholder="请选择门店"
      mode="selector"
      isArrowRight
    ></dpmsCellInput>
    <dpmsCellInput
      title="门店地址"
      isRequired
      inputType="picker"
      placeholder="请选择地址"
      mode="selector"
      isArrowRight
    ></dpmsCellInput>
    <dpmsCellInput
      title="预约医生"
      isRequired
      inputType="picker"
      placeholder="请选择医生"
      mode="selector"
      isArrowRight
    ></dpmsCellInput>
    <dpmsCellInput
      title="预约项目"
      isRequired
      inputType="picker"
      placeholder="请选择项目"
      mode="selector"
      isArrowRight
    ></dpmsCellInput>
    <dpmsCellInput
      title="预约日期"
      isRequired
      inputType="picker"
      placeholder="请选择日期"
      mode="date"
      isArrowRight
    ></dpmsCellInput>
    <dpmsCellInput
      title="预约备注"
      placeholder="请输入备注"
      inputType="text"
    ></dpmsCellInput>
    <div class="agree">我已知悉并同意<a href="">《预约服务协议》</a></div>
    <button>确认预约</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {}
    }
  }
}
</script>

<style lang="scss">
.agree{
  color: rgba(153,153,153,1);
  font-size: 24rpx;
  padding: 0 32rpx;
  line-height: 80rpx;
  display: flex;
  a{
    color: rgba(92,187,137,1);
  }
}
button {
  width: 620rpx;
  height: 78rpx;
  line-height: 78rpx;
  background: #5cbb89;
  border-radius: 8rpx;
  font-size: 36rpx;
  font-weight: 400;
  text-align: center;
  color: #ffffff;
  margin-top: 40rpx;
}
</style>