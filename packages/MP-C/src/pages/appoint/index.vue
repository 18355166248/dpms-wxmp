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
    <div class="modal" v-show="doctorModalVisible">
      <div class="mask"></div>
      <div class="inner">
        <div class="head">选择医生</div>
        <div class="body">
          <div class="item">
            <image src="/static/logo.png" />
            <div class="info">
              <div class="name">张医生</div>
              <div>
                擅长: 整形，美容整形，美容整，美容整形，美容整形，美容整
              </div>
            </div>
          </div>
          <div class="item">
            <image src="/static/logo.png" />
            <div class="info">
              <div class="name">张医生</div>
              <div>
                擅长: 整形，美容整形，美容整，美容整形，美容整形，美容整
              </div>
            </div>
          </div>
          <div class="item">
            <image src="/static/logo.png" />
            <div class="info">
              <div class="name">张医生</div>
              <div>
                擅长: 整形，美容整形，美容整，美容整形，美容整形，美容整
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {},
      doctorModalVisible: false,
    }
  },
}
</script>

<style lang="scss">
.agree {
  color: rgba(153, 153, 153, 1);
  font-size: 24rpx;
  padding: 0 32rpx;
  line-height: 80rpx;
  display: flex;
  a {
    color: rgba(92, 187, 137, 1);
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
.modal {
  position: relative;
  z-index: 2;
  .mask {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.6);
  }
  .inner {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    .head {
      background: white;
      border-radius: 24rpx 24rpx 0 0;
      line-height: 112rpx;
      text-align: center;
      border-bottom: solid 2rpx rgba(0, 0, 0, 0.15);
      font-size: 36rpx;
    }
    .body {
      background: white;
      padding: 32rpx 24rpx 0;
      .item {
        margin-bottom: 16rpx;
        border-radius: 8rpx;
        box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.09);
        display: flex;
        padding: 32rpx 24rpx;
        color: rgba(0, 0, 0, 0.5);
        font-size: 28rpx;
        line-height: 1.6;
        image {
          width: 120rpx;
          height: 120rpx;
          flex: none;
          margin-right: 32rpx;
        }
        .name {
          color: rgba(0, 0, 0, 0.9);
          font-size: 34rpx;
          margin-bottom: 8rpx;
        }
      }
    }
  }
}
</style>
