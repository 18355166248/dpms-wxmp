<template>
  <div>
    <scroll-view class="records" v-if="records.length" scroll-y @scrolltolower="getMedicalRecordList">
      <div class="record" v-for="r in records" :key="r.medicalRecordId" @click="toDetail(r)">
        <div class="head">
          <div class="iconfont icon-time-circle"></div>{{r.createTimeFormated}}
        </div>
        <div class="row">
          就诊信息：<span class="content">{{r.visTimeFormated}} {{r.medicalInstitutionSimpleCode}}</span>
        </div>
        <div class="row">
          医生：<span class="content">{{r.doctorStaffName}}</span>
        </div>
        <div class="row">
          主诉：<span class="content">{{r.mainComplaint}}</span>
        </div>
        <div class="row">
          现病史：<span class="content">{{r.presentIllnessHistory}}</span>
        </div>
      </div>
    </scroll-view>
    <empty :disabled="true" text="无影像记录" v-else />
    <div class="bottom">
      <button @click="$utils.push({url: `/pages/patient/medicalRecord/create?patientId=${patientId}`})">新建病历</button>
    </div>
  </div>
</template>

<script>
import diagnosisAPI from '@/APIS/diagnosis/diagnosis.api.js'
import moment from 'moment'
export default {
  data() {
    return {
      records: []
    }
  },
  methods: {
    async getMedicalRecordList() {
      if (this.total && this.total <= this.current * 10) return this.$utils.show('没有更多了')
      this.$utils.showLoading('加载中...')
      const res = await diagnosisAPI.getMedicalRecordList({
        patientId: this.patientId, current: this.current,
      })
      this.$utils.clearLoading()
      ++this.current
      this.total = res.data.total
      this.records = res.data.records.map(r => ({
        ...r, visTimeFormated: moment(r.visTime).format('YYYY-MM-DD HH:mm'),
        createTimeFormated: moment(r.createTime).format('YYYY-MM-DD HH:mm'),
      }))
    },
    toDetail({medicalRecordId}) {
      this.$utils.push({url: `/pages/patient/medicalRecord/detail?medicalRecordId=${medicalRecordId}&patientId=${this.patientId}`})
    },
    onUpdate() {
      uni.$on('medicalRecordListUpdate', () => {
        this.current = 1
        this.total = 0
        this.getMedicalRecordList()
      })
    }
  },
  onLoad({patientId}) {
    this.patientId = patientId
    this.current = 1
    this.getMedicalRecordList()
    this.onUpdate()
  },
}
</script>

<style lang="scss" scoped>
.records{
  padding: 32rpx;
  padding-bottom: 0;
  height: calc(100vh - 90rpx);
  box-sizing: border-box;
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