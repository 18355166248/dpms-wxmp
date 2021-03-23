<template>
  <div class="container">
    <div v-if="detailList.length > 0" v-for="(detail, index) in detailList">
      <div v-if="detailList.length > 1" class="titleName">
        电子病例{{ index + 1 }}
      </div>
      <div class="rows">
        <div class="row">
          <div class="label">就诊信息：</div>
          {{ timeFormated(detail.visTimeFormated) || '' }}
          {{ detail.medicalInstitutionSimpleCode }}
        </div>
        <div class="row">
          <div class="label">医生：</div>
          {{ detail.doctorStaffName || '' }}
        </div>
        <div class="row">
          <div class="label">主诉：</div>
          {{ detail.mainComplaint || '' }}
        </div>
        <div v-if="detail.presentIllnessHistory !== undefined" class="row">
          <div class="label">现病史：</div>
          {{ detail.presentIllnessHistory || '' }}
        </div>
        <div v-if="detail.pastIllnessHistory !== undefined" class="row">
          <div class="label">既往史：</div>
          {{ detail.pastIllnessHistory || '' }}
        </div>
        <div
          v-if="detail.medicalRecordCheckNormalVOList.length > 0"
          class="row"
        >
          <div class="label">口腔检查：</div>
          <div>
            <div
              class="teeth-content"
              v-for="(v0, i) in detail.medicalRecordCheckNormalVOList"
              :key="i"
            >
              <div>
                <TeethSelect
                  :value="JSON.parse(v0.checkNormalToothPosition || 'null')"
                  disabled
                />
              </div>
              <div>{{ v0.checkNormalSymptoms }}</div>
            </div>
          </div>
        </div>
        <div v-if="detail.medicalRecordCheckRayVOList.length > 0" class="row">
          <div class="label">辅助检查：</div>
          <div>
            <div
              class="teeth-content"
              v-for="(v0, i) in detail.medicalRecordCheckRayVOList"
              :key="i"
            >
              <div>
                <TeethSelect
                  :value="JSON.parse(v0.checkRayToothPosition || 'null')"
                  disabled
                />
              </div>
              <div>{{ v0.checkRaySymptoms }}</div>
            </div>
          </div>
        </div>
        <div v-if="detail.medicalRecordDiagnosisVOList.length > 0" class="row">
          <div class="label">诊断：</div>
          <div>
            <div
              class="teeth-content"
              v-for="(v0, i) in detail.medicalRecordDiagnosisVOList"
              :key="i"
            >
              <div>
                <TeethSelect
                  :value="JSON.parse(v0.diagnosisPosition || 'null')"
                  disabled
                />
              </div>
              <div>{{ v0.diagnosisDesc }}</div>
            </div>
          </div>
        </div>
        <div
          v-if="detail.medicalRecordTreatmentProgramVOList.length > 0"
          class="row"
        >
          <div class="label">治疗方案：</div>
          <div>
            <div
              class="teeth-content"
              v-for="(v0, i) in detail.medicalRecordTreatmentProgramVOList"
              :key="i"
            >
              <div>
                <TeethSelect
                  :value="JSON.parse(v0.treatmentProgramPosition || 'null')"
                  disabled
                />
              </div>
              <div>{{ v0.treatmentProgram }}</div>
            </div>
          </div>
        </div>
        <div v-if="detail.medicalRecordDisposeVOList.length > 0" class="row">
          <div class="label">处置：</div>
          <div>
            <div
              class="teeth-content"
              v-for="(v0, i) in detail.medicalRecordDisposeVOList"
              :key="i"
            >
              <div>
                <TeethSelect
                  :value="JSON.parse(v0.disposePosition || 'null')"
                  disabled
                />
              </div>
              <div>{{ v0.dispose }}</div>
            </div>
          </div>
        </div>
        <div v-if="detail.doctorAdvice !== undefined" class="row">
          <div class="label">医嘱：</div>
          {{ detail.doctorAdvice || '' }}
        </div>
      </div>
    </div>
    <div v-if="detailList.length === 0" class="emptyContent">
      <image class="imgContent" src="../../static/empty-icon@2x.png" />
      <div class="emptyText">暂无电子病历数据</div>
    </div>
  </div>
</template>

<script>
import TeethSelect from '@/businessComponents/TeethSelect/TeethSelect.vue'
import customerAPI from '@/APIS/customer/customer.api'
import moment from 'moment'
export default {
  name: 'electronicCase',
  components: { TeethSelect },
  data() {
    return {
      detailList: [],
    }
  },
  onLoad(params) {
    const { patientId, registerId } = params
    this.getHealthRecordsMedicalRecord(patientId, registerId)
  },
  methods: {
    getHealthRecordsMedicalRecord(patientId, registerId) {
      this.$utils.showLoading('加载中...')
      customerAPI
        .healthRecordsMedicalRecord({
          patientId: patientId,
          registerId: registerId,
        })
        .then((res) => {
          console.log('res666', res)
          this.detailList = res.data
          this.$utils.clearLoading()
        })
    },
    timeFormated(visTime) {
      return moment(visTime).format('YYYY-MM-DD HH:mm:ss')
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  color: rgba(0, 0, 0, 0.7);
  font-size: 28rpx;
  background: white;
}
.titleName {
  height: 80rpx;
  background: rgba(0, 0, 0, 0.04);
  color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  padding: 0 20rpx;
}
.rows {
  padding: 15rpx 20rpx;
}
.row {
  padding: 15rpx 0;
  display: flex;
  .label {
    flex: none;
    width: 5em;
    white-space: nowrap;
    color: rgba(0, 0, 0, 0.9);
    text-align: right;
    & + div {
      flex: auto;
    }
  }
  .teeth-content {
    width: 570rpx;
    > div {
      margin-bottom: 16rpx;
      &:last-child {
        margin-bottom: none;
        word-wrap:break-word;
        word-break:normal;
      }
    }
  }
}
.bottom {
  height: 90rpx;
  > div {
    box-sizing: border-box;
    border-top: #5cbb89 solid 1rpx;
    display: flex;
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    height: 90rpx;
  }
  button {
    width: 50%;
    height: 100%;
    background: #5cbb89;
    color: #ffffff;
    font-size: 36rpx;
    border-radius: 0;
    &:first-child {
      background: #ffffff;
      color: #5cbb89;
    }
  }
}
.emptyContent {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 580rpx;
  background-color: rgba(0, 0, 0, 0.04);
  .imgContent {
    margin-top: 176rpx;
    margin-bottom: 20rpx;
    width: 320rpx;
    height: 320rpx;
    /*background: yellow;*/
  }
  .emptyText {
    width: 100%;
    font-size: 34rpx;
    font-family: PingFangSC, PingFangSC-Regular, sans-serif;
    text-align: center;
    color: rgba(0, 0, 0, 0.65);
  }
}
</style>
