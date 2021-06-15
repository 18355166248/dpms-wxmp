<template>
  <div class="container" v-if="detail.medicalRecordId">
    <div class="time">
      <div class="head-memo">
        <div class="iconfont icon-time-circle"></div>
        {{ detail.visTimeFormated }}
      </div>
      <div>
        {{
          ['', '草稿', '审核中', '审核通过', '审核不通过'][
            detail.approveStatus
          ] || ''
        }}
      </div>
    </div>
    <div class="rows">
      <div class="row">
        <div class="label">就诊信息：</div>
        {{ detail.visTimeFormated }} {{ detail.medicalInstitutionSimpleCode }}
      </div>
      <div class="row">
        <div class="label">发起人：</div>
        {{ detail.createStaffName || '' }}
      </div>
      <div class="row">
        <div class="label">医生：</div>
        {{ detail.doctorStaffName || '' }}
      </div>
      <div class="row">
        <div class="label">就诊类型：</div>
        {{ visTypeMap[detail.visType].zh_CN || getCustomType(detail.visType) }}
      </div>
      <div class="row">
        <div class="label">主诉：</div>
        {{ detail.mainComplaint || '' }}
      </div>
      <div class="row" v-if="detail.visType !== 2">
        <div class="label">现病史：</div>
        {{ detail.presentIllnessHistory || '' }}
      </div>
      <div class="row" v-if="detail.visType !== 2">
        <div class="label">既往史：</div>
        {{ detail.pastIllnessHistory || '' }}
      </div>
      <div class="row">
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
      <div class="row">
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
      <div class="row">
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
      <div class="row">
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
      <div class="row">
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
      <div class="row">
        <div class="label">医嘱：</div>
        {{ detail.doctorAdvice || '' }}
      </div>
      <div class="row">
        <div class="label">备注：</div>
        <input
          :type="text"
          @input="remarkChange"
          :maxlength="60"
          v-model="approveRemark"
        />
      </div>
    </div>
    <div class="bottom" v-if="currentStaffApproveType === 0">
      <div v-if="detail.approveStatus === 3 || !detail.approveStatus">
        <button @click="deleteMedicalRecord">删 除</button>
        <button @click="toEdit">编 辑</button>
      </div>
    </div>
    <div class="bottom" v-if="currentStaffApproveType === 1">
      <div v-if="detail.approveStatus === 2">
        <button @click="noPassing(detail)">不 通 过</button>
        <button @click="passing(detail)">通 过</button>
      </div>
      <div v-if="detail.approveStatus === 3 || !detail.approveStatus">
        <button @click="deleteMedicalRecord">删 除</button>
        <button @click="toEdit">编 辑</button>
      </div>
    </div>
    <div class="bottom" v-if="currentStaffApproveType === 2">
      <div v-if="detail.approveStatus === 1 || detail.approveStatus === 4">
        <button @click="againEdit(detail)">重 新 修 改</button>
      </div>
      <div v-if="detail.approveStatus === 2">
        <button @click="withdraw(detail)">撤 回</button>
      </div>
      <div v-if="detail.approveStatus === 3 || !detail.approveStatus">
        <button @click="deleteMedicalRecord">删 除</button>
        <button @click="toEdit">编 辑</button>
      </div>
    </div>
    <div class="bottom" v-if="currentStaffApproveType === 3">
      <div v-if="detail.approveStatus === 1 || detail.approveStatus === 4">
        <button @click="againEdit(detail)">重 新 修 改</button>
      </div>
      <div v-if="detail.approveStatus === 2">
        <button @click="withdraw(detail)">撤 回</button>
        <button @click="noPassing(detail)">不 通 过</button>
        <button @click="passing(detail)">通 过</button>
      </div>
      <div v-if="detail.approveStatus === 3">
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
import { mapMutations } from 'vuex'

export default {
  components: { TeethSelect },
  data() {
    return {
      currentStaffApproveType: 0,
      detail: {},
      approveRemark: '',
      visTypeMap: this.$utils.getEnums('VisType').properties,
      TreatmentTypes: [], // 就诊类型
    }
  },
  methods: {
    ...mapMutations('medicalRecord', ['setMedicalRecordObj']),
    // 获取就诊类型列表
    initTreatmentTypes() {
      diagnosisAPI.getTreatmentTypes().then((res) => {
        if (res?.data?.length > 0) {
          this.TreatmentTypes = res.data
        }
      })
    },
    // 获取自定义的就诊类型
    getCustomType(typeId) {
      if (this.TreatmentTypes.length) {
        return this.TreatmentTypes.find((e) => e.codeId === typeId)?.name || ''
      } else {
        return ''
      }
    },
    async getRole() {
      const res = await diagnosisAPI.getRole({})
      this.currentStaffApproveType = res?.data?.currentStaffApproveType
    },
    async getMedicalRecordDetail() {
      this.$utils.showLoading('加载中...')
      const res = await diagnosisAPI.getMedicalRecordDetail({
        medicalRecordId: this.medicalRecordId,
      })
      this.$utils.clearLoading()
      this.detail = {
        visTimeFormated: moment(res.data.visTime).format('YYYY-MM-DD HH:mm'),
        createTimeFormated: moment(res.data.createTime).format(
          'YYYY-MM-DD HH:mm',
        ),
        ...res.data,
      }
    },
    deleteMedicalRecord() {
      uni.showModal({
        title: '确认删除这条病历吗？',
        success: async ({ confirm }) => {
          if (confirm) {
            this.$utils.showLoading('请稍后...')
            const res = await diagnosisAPI.deleteMedicalRecord({
              medicalRecordId: this.medicalRecordId,
            })
            this.$utils.clearLoading()
            this.$utils.show('删除成功', { icon: 'success' })
            uni.$emit('medicalRecordListUpdate')
            this.$utils.back()
          }
        },
      })
    },
    toEdit() {
      this.$utils.push({
        url: `/pages/patient/medicalRecord/create?patientId=${this.patientId}&medicalRecordId=${this.medicalRecordId}`,
      })
    },
    againEdit(detail) {
      this.setMedicalRecordObj(detail)
      this.$utils.push({
        url: `/pages/patient/medicalRecord/create`,
      })
    },
    async passing() {
      let data = {
        medicalRecordId: this.medicalRecordId,
        approveStatus: 3,
        approveRemark: this.approveRemark,
      }
      const res = await diagnosisAPI.medicalRecords(data)
      if (res.code === 0) {
        this.$utils.show('审核成功', { icon: 'success' })
        setTimeout(() => {
          uni.$emit('medicalRecordListUpdate')
          this.$utils.back()
        }, 1000)
      }
    },
    async noPassing() {
      let data = {
        medicalRecordId: this.medicalRecordId,
        approveStatus: 4,
        approveRemark: this.approveRemark,
      }
      const res = await diagnosisAPI.medicalRecords(data)
      if (res.code === 0) {
        this.$utils.show('审核成功', { icon: 'success' })
        setTimeout(() => {
          uni.$emit('medicalRecordListUpdate')
          this.$utils.back()
        }, 1000)
      }
    },
    async withdraw() {
      let data = {
        medicalRecordId: this.medicalRecordId,
        approveStatus: 1,
        approveRemark: this.approveRemark,
      }
      const res = await diagnosisAPI.medicalRecords(data)
      if (res.code === 0) {
        this.$utils.show('撤回成功', { icon: 'success' })
        setTimeout(() => {
          uni.$emit('medicalRecordListUpdate')
          this.$utils.back()
        }, 1000)
      }
    },
    remarkChange(ev) {
      this.approveRemark = ev.target.value
    },
  },
  onLoad({ medicalRecordId, patientId }) {
    this.medicalRecordId = medicalRecordId
    this.patientId = patientId
    this.initTreatmentTypes()
  },
  onShow() {
    this.getRole()
    this.getMedicalRecordDetail()
  },
}
</script>

<style lang="scss" scoped>
.container {
  color: rgba(0, 0, 0, 0.7);
  font-size: 28rpx;
  background: white;
  overflow: auto;
  height: calc(100% - 90rpx);
}

.time {
  height: 80rpx;
  background: rgba(0, 0, 0, 0.04);
  color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 34rpx;
  white-space: nowrap;

  .head-memo {
    display: flex;
    align-items: center;
  }

  .iconfont {
    margin-right: 14rpx;
  }
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
      }
    }
  }
}

.bottom {
  height: 90rpx;

  > div {
    background: #fff;
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
</style>
