<template>
  <div>
    <div v-if="records.length">
      <div class="record">
        <div class="head">
          <div>2020/06/26 10:30</div>
          <div>上海市某某医院</div>
        </div>
        <div class="type">
          <div class="label">全景</div>
          <div class="imgs">
            <image src="/static/avatar-male.png"/>
            <image src="/static/avatar-male.png"/>
            <image src="/static/avatar-male.png"/>
            <image src="/static/avatar-male.png"/>
            <image src="/static/avatar-male.png"/>
          </div>
          <div class="label">小牙片</div>
          <div class="imgs">
            <image src="/static/avatar-male.png"/>
            <image src="/static/avatar-male.png"/>
          </div>
        </div>
      </div>
    </div>
    <empty :disabled="true" text="无影像记录" v-else />
    <div class="bottom">
      <button @click="$utils.push({url: `/pages/patient/image/upload?patientId=${patientId}`})">上传影像</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      records: [{}], patientId: '',
    }
  },
  onLoad({patientId}) {
    this.patientId = patientId
  }
}
</script>

<style lang="scss" scoped>
.record{
  padding: 0 32rpx;
  margin-bottom: 20rpx;
  font-size: 28rpx;
  color: rgba(0,0,0,0.65);
  background: #feffff;
  .head{
    height: 84rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: solid 1rpx rgba(0,0,0,0.15);
  }
  .type{
    padding: 10rpx 0 12rpx;
    .label{
      color: rgba(0,0,0,0.5);
      line-height: 66rpx;
    }
    .imgs{
      display: grid;
      grid-template-columns: repeat(4, 160rpx);
      gap: 16rpx;
      margin-bottom: 20rpx;
      image{
        width: 160rpx;
        height: 160rpx;
        border-radius: 4rpx;
      }
    }
  }
}
.bottom{
  height: 90rpx;
  button{
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    height: 90rpx;
    background: #5cbb89;
    color: #ffffff;
    font-size: 36rpx;
    border-radius: 0;
  }
}
</style>