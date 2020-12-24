<template>
  <div class="container">
    <div class="time">
      <div class="iconfont icon-time-circle"></div>2020-10-12 12:30
    </div>
    <div class="rows">
      <div class="row">
        <div class="label">就诊信息：</div>
        2020/06/26 10:30 上海医院
      </div>
      <div class="row">
        <div class="label">医生：</div>
        李三
      </div>
      <div class="row">
        <div class="label">主诉：</div>
        主诉内容主诉内容，主诉内容主诉内容主诉内容，主诉内容主诉内容主诉内容主诉内容主诉内容，主诉内容主诉内容。
      </div>
      <div class="row">
        <div class="label">现病史：</div>
        现病史内容现病史内容，现病史内容现病史内容现病史内容现病史内容。
      </div>
      <div class="row">
        <div class="label">既往史：</div>
        既往史内容，既往史内容既往史内容。
      </div>
      <div class="row">
        <div class="label">口腔检查：</div>
        <div class="teeth-content">
          <div>
            <TeethSelect disabled/>
          </div>
          <div>口腔检查内容口腔检查内容，口腔检查内容口腔检查内容，口腔检查内容口腔检查内容口腔检查内容口腔检查内容。</div>
          <div>
            <TeethSelect disabled/>
          </div>
          <div>口腔检查内容。</div>
        </div>
      </div>
      <div class="row">
        <div class="label">辅助检查：</div>
        <div class="teeth-content">
          <div>
            <TeethSelect disabled/>
          </div>
          <div>辅助检查内容，辅助检查内容辅助检查内容。</div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div>
        <button @click="$utils.push({url: `/pages/patient/medicalRecord/create?patientId=${patientId}`})">删 除</button>
        <button @click="$utils.push({url: `/pages/patient/medicalRecord/create?patientId=${patientId}`})">编 辑</button>
      </div>
    </div>
  </div>
</template>

<script>
import TeethSelect from '@/businessComponents/TeethSelect/TeethSelect.vue'
export default {
  components: {TeethSelect},
}
</script>

<style lang="scss" scoped>
.container{
  color: rgba(0,0,0,0.7);
  font-size: 28rpx;
  background: white;
}
.time{
  height: 80rpx;
  background: rgba(0,0,0,0.04);
  color: rgba(0,0,0,0.9);
  display: flex;
  align-items: center;
  padding: 0 34rpx;
  .iconfont{
    margin-right: 14rpx;
  }
}
.rows{
  padding: 15rpx 20rpx;
}
.row{
  padding: 15rpx 0;
  display: flex;
  .label{
    flex: none;
    width: 5em;
    white-space: nowrap;
    color: rgba(0,0,0,0.9);
    text-align: right;
  }
  .teeth-content{
    >div{
      margin-bottom: 16rpx;
      &:last-child{
        margin-bottom: none;
      }
    }
  }
}
.bottom{
  height: 90rpx;
  >div{
    box-sizing: border-box;
    border-top: #5cbb89 solid 1rpx;
    display: flex;
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    height: 90rpx;
  }
  button{
    width: 50%;
    height: 100%;
    background: #5cbb89;
    color: #ffffff;
    font-size: 36rpx;
    border-radius: 0;
    &:first-child{
      background: #ffffff;
      color: #5cbb89;
    }
  }
}
</style>