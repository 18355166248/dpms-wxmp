<template>
  <div class="container" v-if="detail.medicalRecordId">
    <div class="time">
      <div class="iconfont icon-time-circle"></div>{{detail.createTimeFormated}}
    </div>
    <div class="rows">
      <div class="row">
        <div class="label">就诊信息：</div>
        {{detail.visTimeFormated}} {{detail.medicalInstitutionSimpleCode}}
      </div>
      <div class="row">
        <div class="label">医生：</div>
        {{detail.doctorStaffName}}
      </div>
      <div class="row">
        <div class="label">主诉：</div>
        {{detail.mainComplaint}}
      </div>
      <div class="row">
        <div class="label">现病史：</div>
        {{detail.presentIllnessHistory}}
      </div>
      <div class="row">
        <div class="label">既往史：</div>
        {{detail.pastIllnessHistory}}
      </div>
      <div class="row">
        <div class="label">口腔检查：</div>
        <div>
          <div class="teeth-content" v-for="(v0, i) in detail.medicalRecordCheckNormalVOList" :key="i">
            <div>
              <TeethSelect :value="JSON.parse(v0.checkNormalToothPosition || 'null')" disabled/>
            </div>
            <div>{{v0.checkNormalSymptoms}}</div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="label">辅助检查：</div>
        <div>
          <div class="teeth-content" v-for="(v0, i) in detail.medicalRecordCheckRayVOList" :key="i">
            <div>
              <TeethSelect :value="JSON.parse(v0.checkRayToothPosition || 'null')" disabled/>
            </div>
            <div>{{v0.checkRaySymptoms}}</div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="label">诊断：</div>
        <div>
          <div class="teeth-content" v-for="(v0, i) in detail.medicalRecordDiagnosisVOList" :key="i">
            <div>
              <TeethSelect :value="JSON.parse(v0.diagnosisPosition || 'null')" disabled/>
            </div>
            <div>{{v0.diagnosisDesc}}</div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="label">治疗方案：</div>
        <div>
          <div class="teeth-content" v-for="(v0, i) in detail.medicalRecordTreatmentProgramVOList" :key="i">
            <div>
              <TeethSelect :value="JSON.parse(v0.treatmentProgramPosition || 'null')" disabled/>
            </div>
            <div>{{v0.treatmentProgram}}</div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="label">处置：</div>
        <div>
          <div class="teeth-content" v-for="(v0, i) in detail.medicalRecordDisposeVOList" :key="i">
            <div>
              <TeethSelect :value="JSON.parse(v0.disposePosition || 'null')" disabled/>
            </div>
            <div>{{v0.dispose}}</div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="label">医嘱：</div>
        {{detail.doctorAdvice}}
      </div>
    </div>
    <div class="bottom" v-if="detail.isEdit">
      <div>
        <button @click="deleteMedicalRecord">删 除</button>
        <button @click="toEdit">编 辑</button>
      </div>
    </div>
  </div>
</template>

<script>
import TeethSelect from '@/businessComponents/TeethSelect/TeethSelect.vue'
import diagnosisAPI from '@/APIS/diagnosis/diagnosis.api.js'
import moment from 'moment'
export default {
  components: {TeethSelect},
  data() {
    return {
      detail: {},
    }
  },
  methods: {
    async getMedicalRecordDetail() {
      this.$utils.showLoading('加载中...')
      const res = await diagnosisAPI.getMedicalRecordDetail({medicalRecordId: this.medicalRecordId})
      this.$utils.clearLoading()
      this.detail = {visTimeFormated: moment(res.data.visTime).format('YYYY-MM-DD HH:mm'),
        createTimeFormated: moment(res.data.createTime).format('YYYY-MM-DD HH:mm'),
        doctorStaffName: '',
        ...res.data
      }
    },
    deleteMedicalRecord() {
      uni.showModal({
        title: '确认删除这条病历吗？',
        success: async ({confirm}) => {
          if (confirm) {
            this.$utils.showLoading('请稍后...')
            const res = await diagnosisAPI.deleteMedicalRecord({medicalRecordId: this.medicalRecordId})
            this.$utils.clearLoading()
            this.$utils.show('删除成功', {icon: 'success'})
            uni.$emit('medicalRecordListUpdate')
            this.$utils.back()
          }
        }
      })
    },
    toEdit() {
      this.$utils.push({url: `/pages/patient/medicalRecord/create?patientId=${this.patientId}&medicalRecordId=${this.medicalRecordId}`})
    },
  },
  onLoad({medicalRecordId, patientId}) {
    this.medicalRecordId = medicalRecordId
    this.patientId = patientId
  },
  onShow() {
    this.getMedicalRecordDetail()
  }
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
    &+div{
      flex: auto;
    }
  }
  .teeth-content{
    width: 570rpx;
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