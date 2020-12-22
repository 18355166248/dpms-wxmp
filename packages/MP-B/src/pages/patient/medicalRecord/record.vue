<template>
  <div>
    <div class="records" v-if="records.length">
      <div class="record">
        <div class="head">
          <div class="iconfont icon-time-circle"></div>2020-10-12 12:30
        </div>
        <div class="row">
          就诊信息：<span class="content">2020/06/26 10:30 上海医院</span>
        </div>
        <div class="row">
          就诊信息：<span class="content">2020/06/26 10:30 上海医院</span>
        </div>
        <div class="row">
          就诊信息：<span class="content">2020/06/26 10:30 上海医院</span>
        </div>
        <div class="row">
          就诊信息：<span class="content">2020/06/26 10:30 上海医院</span>
        </div>
      </div>
    </div>
    <empty :disabled="true" text="无影像记录" v-else />
    <div class="bottom">
      <button @click="$utils.push({url: `/pages/patient/medicalRecord/create?patientId=${patientId}`})">新建病历</button>
    </div>
  </div>
</template>

<script>
import diagnosisAPI from '@/APIS/diagnosis/diagnosis.api.js'
export default {
  data() {
    return {
      records: [{}]
    }
  },
  methods: {
    async getMedicalRecordList(param) {
      const res = await diagnosisAPI.getMedicalRecordList(param)
    },
  },
  onLoad({patientId}) {
    this.patientId = patientId
    this.getMedicalRecordList({patientId})
  },
}
</script>

<style lang="scss" scoped>
.records{
  padding: 32rpx;
  padding-bottom: 0;
}
.record{
  background: #ffffff;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: rgba(0,0,0,0.9);
  padding: 0 24rpx 16rpx;
  margin-bottom: 25rpx;
  .head{
    height: 84rpx;
    display: flex;
    align-items: center;
    border-bottom: solid 1rpx rgba(0,0,0,0.1);
    margin-bottom: 16rpx;
    .icon-time-circle{
      margin-right: 10rpx;
    }
  }
  .row{
    line-height: 1.9;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .content{
      color: rgba(0,0,0,0.7);
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