<template>
  <div class="content">
    <div class="personInfo">
      <div>
        <span>姓名</span>
        <span></span>
      </div>
      <div>
        <span>性别</span>
        <span></span>
      </div>
      <div>
        <span>出生日期</span>
        <span></span>
      </div>
      <div>
        <span>联系电话标签</span>
        <span></span>
      </div>
      <div>
        <span>联系电话</span>
        <span></span>
      </div>
    </div>
    <div class="operation">
      <div class="btn">
        <button @click="del">移除</button>
        <button @click="amend">修改</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  onLoad(info) {
    console.log('qqqqqqqqqqqqqq', info, JSON.parse(info))
  },
  methods: {
    amend() {
      this.$utils.push({ url: '/pages/personAmend/personAmend' })
    },
    del() {},
  },
}
</script>

<style lang="scss" scoped>
.content {
  padding-bottom: 118rpx;
  height: 100%;
  background: rgba($color: #000000, $alpha: 0.04);
}
.personInfo {
  padding-left: 32rpx;
  background: #fff;
  margin-bottom: 64rpx;
  div {
    height: 112rpx;
    line-height: 112rpx;
    position: relative;
    border-bottom: rgba($color: #000000, $alpha: 0.15) 2rpx solid;
    span:first-child {
      color: rgba($color: #000000, $alpha: 0.9);
      font-size: 34rpx;
    }
    span:last-child {
      position: absolute;
      right: 32rpx;
      color: rgba($color: #000000, $alpha: 0.5);
      font-size: 34rpx;
    }
  }
}
.operation {
  .btn {
    padding: 0 64rpx;
    button {
      border-radius: 8px;
      border: none;
      font-size: 36rpx;
    }
    button:first-child {
      background: #5cbb89;
      color: #fff;
      margin-bottom: 24rpx;
    }
    button:last-child {
      color: #5cbb89;
      border: 2rpx solid #5cbb89;
    }
  }
}
</style>
