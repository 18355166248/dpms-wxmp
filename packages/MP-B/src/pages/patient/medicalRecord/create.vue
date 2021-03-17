<template>
  <div>
    <dpmsForm ref="form" :model="form" :rules="rules">
      <dpmsCell title="就诊信息" :isLink="registerList">
        <template #title>
          <div class="title">
            就诊信息
            <dpmsDatetimePicker isCell @change="registNew">
              <span class="iconfont icon-plus-circle addRegist" />
            </dpmsDatetimePicker>
          </div>
        </template>
        <picker
          mode="selector"
          :range="registerList"
          range-key="registerLabel"
          :disabled="!registerList"
          :value="form.registerId"
          @change="registerChange"
        >
          <div>
            <div v-if="!registerList">暂无就诊信息</div>
            <div v-else>{{ registerText }}</div>
          </div>
        </picker>
      </dpmsCell>
      <!-- <dpmsCellPicker
        title="就诊信息"
        placeholder="暂无就诊信息"
        v-model="form.registerId"
        :list="registerList"
        defaultType="registerId"
        :defaultProps="{ label: 'registerLabel', value: 'registerId' }"
        :disabled="!registerList.length"
      >
        <template #title>
          <div @focus="ev => ev.stopPropagation()">
            就诊信息
            <dpmsDatetimePicker
              isCell
            >
              <span class="iconfont icon-plus-circle addRegist" />
            </dpmsDatetimePicker>
          </div>
        </template>
      </dpmsCellPicker> -->
      <dpmsCellPicker
        title="医生"
        placeholder="请选择医生"
        :list="doctors"
        :defaultProps="{ label: 'doctorName', value: 'doctorId' }"
        defaultType="doctorId"
        v-model="form.doctorStaffId"
      />
      <dpmsEnumsPicker
        enumsKey="VisType"
        v-model="form.medicalRecordRegisterVO.visType"
        title="就诊类型"
        placeholder="请选择就诊类型"
      />
      <dpmsCell title="主诉" wrap>
        <div
          class="text"
          data-placeholder="请输入主诉"
          @click="
            openTextarea({
              title: '主诉',
              value: form.mainComplaint,
              key: 'mainComplaint',
            })
          "
        >
          {{ form.mainComplaint || '' }}
        </div>
      </dpmsCell>
      <dpmsCell
        title="现病史"
        wrap
        v-if="
          VIS_TYPE_ENUM.REVISIT.value !== form.medicalRecordRegisterVO.visType
        "
      >
        <div
          class="text"
          data-placeholder="请输入现病史"
          @click="
            openTextarea({
              title: '现病史',
              value: form.presentIllnessHistory,
              key: 'presentIllnessHistory',
            })
          "
        >
          {{ form.presentIllnessHistory || '' }}
        </div>
      </dpmsCell>
      <dpmsCell
        title="既往史"
        wrap
        hideBorderBottom
        v-if="
          VIS_TYPE_ENUM.REVISIT.value !== form.medicalRecordRegisterVO.visType
        "
      >
        <div
          class="text"
          data-placeholder="请输入既往史"
          @click="
            openTextarea({
              title: '既往史',
              value: form.pastIllnessHistory,
              key: 'pastIllnessHistory',
            })
          "
        >
          {{ form.pastIllnessHistory || '' }}
        </div>
      </dpmsCell>
      <div style="height: 20rpx;"></div>
      <dpmsCell title="同步牙位" hideBorderBottom>
        <switch :checked="teethSync" @change="teethSyncChange" />
      </dpmsCell>
      <div style="height: 20rpx;"></div>
      <dpmsCell title="口腔检查" wrap hideBorderBottom>
        <div style="margin-top: 40rpx;">
          <div
            class="teeth-select"
            v-for="(v0, i) in form.medicalRecordCheckNormalVOList"
            :key="i"
          >
            <TeethSelect
              class="handle"
              :value="v0.checkNormalToothPosition"
              :index="i"
              @input="
                (val, i) =>
                  setTeethSelect(
                    val,
                    `medicalRecordCheckNormalVOList.${i}.checkNormalToothPosition`,
                  )
              "
            />
            <button
              class="btn"
              v-if="form.medicalRecordCheckNormalVOList.length > 1"
              @click="delTeeth(form.medicalRecordCheckNormalVOList, i)"
            >
              删除
            </button>
            <div
              class="text"
              data-placeholder="请输入口腔检查"
              @click="
                openTextarea({
                  title: '口腔检查',
                  value: v0.checkNormalSymptoms,
                  key: `medicalRecordCheckNormalVOList.${i}.checkNormalSymptoms`,
                })
              "
            >
              {{ v0.checkNormalSymptoms || '' }}
            </div>
          </div>
          <div
            class="bottom-func"
            @click="form.medicalRecordCheckNormalVOList.push({})"
          >
            <div class="iconfont icon-plus-circle" />
            添加牙位
          </div>
        </div>
      </dpmsCell>
      <div style="height: 20rpx;"></div>
      <dpmsCell title="辅助检查" wrap hideBorderBottom>
        <div style="margin-top: 40rpx;">
          <div
            class="teeth-select"
            v-for="(v0, i) in form.medicalRecordCheckRayVOList"
            :key="i"
          >
            <TeethSelect
              class="handle"
              :value="v0.checkRayToothPosition"
              :index="i"
              @input="
                (val, i) =>
                  setTeethSelect(
                    val,
                    `medicalRecordCheckRayVOList.${i}.checkRayToothPosition`,
                  )
              "
            />
            <button
              class="btn"
              v-if="form.medicalRecordCheckRayVOList.length > 1"
              @click="delTeeth(form.medicalRecordCheckRayVOList, i)"
            >
              删除
            </button>
            <div
              class="text"
              data-placeholder="请输入辅助检查"
              @click="
                openTextarea({
                  title: '辅助检查',
                  value: v0.checkRaySymptoms,
                  key: `medicalRecordCheckRayVOList.${i}.checkRaySymptoms`,
                })
              "
            >
              {{ v0.checkRaySymptoms || '' }}
            </div>
          </div>
          <div
            class="bottom-func"
            @click="form.medicalRecordCheckRayVOList.push({})"
          >
            <div class="iconfont icon-plus-circle" />
            添加牙位
          </div>
        </div>
      </dpmsCell>
      <div style="height: 20rpx;"></div>
      <dpmsCell title="诊断" wrap hideBorderBottom>
        <div style="margin-top: 40rpx;">
          <div
            class="teeth-select"
            v-for="(v0, i) in form.medicalRecordDiagnosisVOList"
            :key="i"
          >
            <TeethSelect
              class="handle"
              :value="v0.diagnosisPosition"
              :index="i"
              @input="
                (val, i) =>
                  setTeethSelect(
                    val,
                    `medicalRecordDiagnosisVOList.${i}.diagnosisPosition`,
                  )
              "
            />
            <button
              class="btn"
              v-if="form.medicalRecordDiagnosisVOList.length > 1"
              @click="delTeeth(form.medicalRecordDiagnosisVOList, i)"
            >
              删除
            </button>
            <div
              class="text"
              data-placeholder="请输入诊断"
              @click="
                openTextarea({
                  title: '诊断',
                  value: v0.diagnosisDesc,
                  key: `medicalRecordDiagnosisVOList.${i}.diagnosisDesc`,
                })
              "
            >
              {{ v0.diagnosisDesc || '' }}
            </div>
          </div>
          <div
            class="bottom-func"
            @click="form.medicalRecordDiagnosisVOList.push({})"
          >
            <div class="iconfont icon-plus-circle" />
            添加牙位
          </div>
        </div>
      </dpmsCell>
      <div style="height: 20rpx;"></div>
      <dpmsCell title="治疗方案" wrap hideBorderBottom>
        <div style="margin-top: 40rpx;">
          <div
            class="teeth-select"
            v-for="(v0, i) in form.medicalRecordTreatmentProgramVOList"
            :key="i"
          >
            <TeethSelect
              class="handle"
              :value="v0.treatmentProgramPosition"
              :index="i"
              @input="
                (val, i) =>
                  setTeethSelect(
                    val,
                    `medicalRecordTreatmentProgramVOList.${i}.treatmentProgramPosition`,
                  )
              "
            />
            <button
              class="btn"
              v-if="form.medicalRecordTreatmentProgramVOList.length > 1"
              @click="delTeeth(form.medicalRecordTreatmentProgramVOList, i)"
            >
              删除
            </button>
            <div
              class="text"
              data-placeholder="请输入治疗方案"
              @click="
                openTextarea({
                  title: '治疗方案',
                  value: v0.treatmentProgram,
                  key: `medicalRecordTreatmentProgramVOList.${i}.treatmentProgram`,
                })
              "
            >
              {{ v0.treatmentProgram || '' }}
            </div>
          </div>
          <div
            class="bottom-func"
            @click="form.medicalRecordTreatmentProgramVOList.push({})"
          >
            <div class="iconfont icon-plus-circle" />
            添加牙位
          </div>
        </div>
      </dpmsCell>
      <div style="height: 20rpx;"></div>
      <dpmsCell title="处置" wrap hideBorderBottom>
        <div style="margin-top: 40rpx;">
          <div
            class="teeth-select"
            v-for="(v0, i) in form.medicalRecordDisposeVOList"
            :key="i"
          >
            <TeethSelect
              class="handle"
              :value="v0.disposePosition"
              :index="i"
              @input="
                (val, i) =>
                  setTeethSelect(
                    val,
                    `medicalRecordDisposeVOList.${i}.disposePosition`,
                  )
              "
            />
            <button
              class="btn"
              v-if="form.medicalRecordDisposeVOList.length > 1"
              @click="delTeeth(form.medicalRecordDisposeVOList, i)"
            >
              删除
            </button>
            <div
              class="text"
              data-placeholder="请输入处置"
              @click="
                openTextarea({
                  title: '处置',
                  value: v0.dispose,
                  key: `medicalRecordDisposeVOList.${i}.dispose`,
                })
              "
            >
              {{ v0.dispose || '' }}
            </div>
          </div>
          <div
            class="bottom-func"
            @click="form.medicalRecordDisposeVOList.push({})"
          >
            <div class="iconfont icon-plus-circle" />
            添加牙位
          </div>
        </div>
      </dpmsCell>
      <div style="height: 20rpx;"></div>
      <dpmsCell title="医嘱" wrap hideBorderBottom>
        <div
          class="text"
          data-placeholder="请输入医嘱"
          @click="
            openTextarea({
              title: '医嘱',
              value: form.doctorAdvice,
              key: 'doctorAdvice',
            })
          "
        >
          {{ form.doctorAdvice || '' }}
        </div>
      </dpmsCell>
    </dpmsForm>
    <div class="bottom">
      <div class="inner">
        <div class="funcs">
          <div @click="historyMedicalVisible = true">
            <div class="iconfont icon-lishibingli1" />
            历史病历
          </div>
          <div @click="templateMedicalVisible = true">
            <div class="iconfont icon-moban1" />
            模板
          </div>
        </div>
        <button @click="save">保 存</button>
      </div>
    </div>
    <HistoryMedicalSelect
      :visible.sync="historyMedicalVisible"
      :patientId="patientId"
      @change="historyMedicalChange"
    />
    <TemplateMedicalSelect
      :visible.sync="templateMedicalVisible"
      @change="templateMedicalChange"
    />
  </div>
</template>

<script>
import moment from 'moment'
import diagnosisAPI from '@/APIS/diagnosis/diagnosis.api.js'
import institutionAPI from '@/APIS/institution/institution.api.js'
import TeethSelect from '@/businessComponents/TeethSelect/TeethSelect.vue'
import HistoryMedicalSelect from '@/businessComponents/MedicalSelect/HistorySelect.vue'
import TemplateMedicalSelect from '@/businessComponents/MedicalSelect/TemplateSelect.vue'
import { getStorage, STORAGE_KEY } from '@/utils/storage'

export default {
  components: { TeethSelect, HistoryMedicalSelect, TemplateMedicalSelect },
  data() {
    return {
      form: {
        registerId: '',
        doctorStaffId: '',
        doctorStaffName: '',
        mainComplaint: '',
        presentIllnessHistory: '',
        pastIllnessHistory: '',
        medicalRecordCheckNormalVOList: [{}],
        medicalRecordCheckRayVOList: [{}],
        medicalRecordDiagnosisVOList: [{}],
        medicalRecordTreatmentProgramVOList: [{}],
        medicalRecordDisposeVOList: [{}],
        doctorAdvice: '',
        medicalRecordRegisterVO: { visType: '' },
      },
      rules: {},
      teethSync: true,
      registerList: null,
      doctors: [],
      VIS_TYPE_ENUM: this.$utils.getEnums('VisType'),
      historyMedicalVisible: false,
      patientId: '',
      templateMedicalVisible: false,
    }
  },
  computed: {
    registerText() {
      return (
        (this.registerList &&
          this.registerList.find((l) => l.registerId === this.form.registerId)
            ?.registerLabel) ||
        ''
      )
    },
  },
  methods: {
    async getDoctors() {
      const res = await institutionAPI.getDoctors()
      this.doctors = res.data
    },
    async getRegisterList(param) {
      const res = await diagnosisAPI.getRegisterList(param)
      this.registerList = (res.data || []).map((d) => ({
        ...d,
        registerLabel: moment(d.registerTime).format('YYYY/MM/DD HH:mm'),
      }))
      if (this.registerList.length > 0) {
        this.form.registerId = this.registerList[0].registerId
        this.form.medicalRecordRegisterVO.visType = this.VIS_TYPE_ENUM.REVISIT.value
      } else {
        this.form.medicalRecordRegisterVO.visType = this.VIS_TYPE_ENUM.FIRST_DIAGNOSIS.value
      }
    },
    onTextareaChange() {
      uni.$on('medicalRecordTextareaChange', ({ value, key }) => {
        if (/^\w+\.\d+\.\w+$/.test(key)) {
          const ks = key.split('.')
          this.$set(this.form[ks[0]], ks[1], {
            ...this.form[ks[0]][ks[1]],
            [ks[2]]: value,
          })
        } else {
          this.$set(this.form, key, value)
        }
      })
    },
    openTextarea({ title = '', value = '', key = '' }) {
      this.$utils.push({
        url: `/pages/patient/medicalRecord/Textarea?title=${title}&value=${
          value || ''
        }&key=${key}`,
      })
    },
    setTeethSelect(value, key) {
      const ks = key.split('.')
      this.$set(this.form[ks[0]], ks[1], {
        ...this.form[ks[0]][ks[1]],
        [ks[2]]: value,
      })
      if (this.teethSync && ks[1] == 0) {
        const formKeys = [
          ['medicalRecordCheckNormalVOList', 'checkNormalToothPosition'],
          ['medicalRecordCheckRayVOList', 'checkRayToothPosition'],
          ['medicalRecordDiagnosisVOList', 'diagnosisPosition'],
          ['medicalRecordTreatmentProgramVOList', 'treatmentProgramPosition'],
          ['medicalRecordDisposeVOList', 'disposePosition'],
        ].filter((_ks) => _ks[0] !== ks[0])
        formKeys.forEach((fk) => {
          this.$set(this.form[fk[0]], 0, {
            ...this.form[fk[0]][0],
            [fk[1]]: value,
          })
        })
      }
    },
    delTeeth(list, i) {
      list.splice(i, 1)
    },
    async save() {
      const inputed = Object.keys(this.form).reduce((r, k) => {
        let result = false
        if (k === 'registerId') {
          result = false
        } else if (typeof this.form[k] === 'string') {
          result = !!this.form[k]
        } else if (Array.isArray(this.form[k])) {
          result = this.form[k].reduce(
            (_r, _v) => _r || !!Object.keys(_v).length,
            false,
          )
        }
        return r || result
      }, false)
      if (!inputed) return this.$utils.show('请至少填写一项内容')
      if (this.pending) return
      this.pending = true
      this.$utils.showLoading('请稍后...')
      await diagnosisAPI[
        this.medicalRecordId ? 'updateMedicalRecord' : 'createMedicalRecord'
      ]({
        medicalRecordVOJson: JSON.stringify({
          medicalRecordId: this.medicalRecordId,
          patientId: this.patientId,
          medicalInstitutionId: getStorage(STORAGE_KEY.MEDICALINSTITUTION)
            .medicalInstitutionId,
          ...this.form,
        }),
      })
      this.$utils.clearLoading()
      this.$utils.show(`${this.medicalRecordId ? '编辑' : '新建'}成功`, {
        icon: 'success',
      })
      uni.$emit('medicalRecordListUpdate')
      this.$utils.back()
      setTimeout(() => {
        this.$nextTick(() => {
          this.pending = false
        })
      }, 100)
    },
    onEdit() {
      if (!this.medicalRecordId) return
      uni.setNavigationBarTitle({
        title: '编辑病历',
      })
      this.getMedicalRecordDetail()
    },
    async getMedicalRecordDetail() {
      this.$utils.showLoading('加载中...')
      const res = await diagnosisAPI.getMedicalRecordDetail({
        medicalRecordId: this.medicalRecordId,
      })
      this.$utils.clearLoading()
      const formKeys = Object.keys(this.form)
      this.form = formKeys.reduce((r, k) => {
        if (k.endsWith('VOList')) {
          res.data[k] = res.data[k].map((v0, i0) => {
            v0 = Object.keys(v0).reduce((_r, _k) => {
              if (_k.endsWith('Position')) {
                v0[_k] = JSON.parse(v0[_k] || 'null')
              }
              _r[_k] = v0[_k]
              return _r
            }, {})
            return v0
          })
        }
        r[k] = res.data[k]
        return r
      }, {})
    },
    teethSyncChange({ detail }) {
      this.teethSync = detail.value
    },
    registNew({ dt }) {
      const registerId = null
      const registerTime = moment(dt).valueOf()
      const registerLabel = moment(dt).format('YYYY/MM/DD HH:mm')
      const newRegisterIndex = this.registerList.indexOf(
        (l) => l.registerId === registerId,
      )
      if (newRegisterIndex !== null) {
        this.registerList = this.registerList.filter(
          (l) => l.registerId !== registerId,
        )
      }
      this.registerList = [
        ...(this.registerList || []),
        { registerId, registerTime, registerLabel },
      ]
      this.form.registerId = registerId
      this.form.medicalRecordRegisterVO.registerTime = registerTime
    },
    registerChange({ detail }) {
      this.form.registerId = registerList[detail.value].registerId
    },
    historyMedicalChange(contents) {
      const keyP = {
        symptom: 'medicalRecordCheckNormalVOList.0.checkNormalSymptoms',
        rayExamination: 'medicalRecordCheckRayVOList.0.checkRaySymptoms',
        diagnosisDesc: 'medicalRecordDiagnosisVOList.0.diagnosisDesc',
        treatmentProgram:
          'medicalRecordTreatmentProgramVOList.0.treatmentProgramn',
        dispose: 'medicalRecordDisposeVOList.0.dispose',
      }
      contents.forEach((c) => {
        const k = keyP[c.key] || c.key
        if (/^\w+\.\d+\.\w+$/.test(k)) {
          const ks = k.split('.')
          this.$set(this.form[ks[0]], ks[1], {
            ...this.form[ks[0]][ks[1]],
            [ks[2]]: c.content,
          })
        } else {
          this.$set(this.form, k, c.content)
        }
      })
    },
    templateMedicalChange(t) {
      const keyPs = [
        ['chiefComplaint', 'mainComplaint'],
        [
          'dentalExamination',
          'medicalRecordCheckNormalVOList.0.checkNormalSymptoms',
        ],
        [
          'auxiliaryExamination',
          'medicalRecordCheckRayVOList.0.checkRaySymptoms',
        ],
        ['diagnosis', 'medicalRecordDiagnosisVOList.0.diagnosisDesc'],
        [
          'treatmentPlan',
          'medicalRecordTreatmentProgramVOList.0.treatmentProgramn',
        ],
        ['disposal', 'medicalRecordDisposeVOList.0.dispose'],
      ]
      const formKeys = Object.keys(this.form)
      Object.keys(t).forEach((tk) => {
        if (formKeys.includes(tk)) {
          this.$set(this.form, tk, t[tk])
        } else {
          const kps = keyPs.find((ks) => ks[0] === tk)
          if (kps) {
            if (/^\w+\.\d+\.\w+$/.test(kps[1])) {
              const ks = kps[1].split('.')
              this.$set(this.form[ks[0]], ks[1], {
                ...this.form[ks[0]][ks[1]],
                [ks[2]]: t[tk],
              })
            } else {
              this.$set(this.form, kps[1], t[tk])
            }
          }
        }
      })
    },
  },
  onLoad({ patientId, medicalRecordId }) {
    this.patientId = patientId
    this.medicalRecordId = medicalRecordId
    this.getRegisterList({ patientId })
    this.onTextareaChange()
    this.onEdit()
    this.getDoctors()
  },
  watch: {
    'form.doctorStaffId'(newVal) {
      if (newVal) {
        this.form.doctorStaffName = this.doctors.find(
          (d) => d.doctorId === newVal,
        )?.doctorName
        this.form.medicalRecordRegisterVO.doctorStaffId = newVal
      }
    },
    'form.registerId'(newVal) {
      if (newVal) {
        this.form.medicalRecordRegisterVO.createRegister = false
      } else {
        this.form.medicalRecordRegisterVO.createRegister = true
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.title {
  display: flex;
  align-items: center;
}
.addRegist {
  color: #5cbb89;
  padding: 10rpx;
  display: block;
  font-size: 40rpx;
}
.text {
  padding-top: 18rpx;
  box-sizing: border-box;
  min-height: 62rpx;
  white-space: normal;
  width: 100%;
  color: rgba(0, 0, 0, 0.65);
  &:empty {
    &::before {
      content: attr(data-placeholder);
      color: rgba(0, 0, 0, 0.3);
    }
  }
}
.teeth-select {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
  padding-bottom: 32rpx;
  border-bottom: rgba(0, 0, 0, 0.15) solid 2rpx;
  .handle {
    padding: 32rpx 0;
    width: 570rpx;
  }
  .btn {
    flex: none;
    font-size: 28rpx;
    color: #5cbb89;
    background: none;
    padding: 0;
    margin: 0 0 0 60rpx;
  }
}
.bottom-func {
  padding-top: 32rpx;
  color: #5cbb89;
  font-size: 34rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  .iconfont {
    font-size: inherit;
    margin-right: 16rpx;
  }
}
.bottom {
  height: 90rpx;
  .inner {
    display: flex;
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    height: 90rpx;
  }
  .funcs {
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    color: #4c4c4c;
    font-size: 24rpx;
    background: white;
    border-top: rgba(0, 0, 0, 0.15) solid 2rpx;
    text-align: center;
    .iconfont {
      color: #5cbb89;
      font-size: 36rpx;
    }
  }
  button {
    width: 50%;
    height: 100%;
    background: #5cbb89;
    color: #ffffff;
    font-size: 36rpx;
    border-radius: 0;
  }
}
</style>
