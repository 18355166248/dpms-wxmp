<template>
  <div>
    <dpmsForm ref="form" :model="form" :rules="rules">
      <dpmsCellPicker
        title="就诊信息"
        placeholder="暂无就诊信息"
        v-model="form.registerId"
        :list="registerList"
        defaultType="registerId"
        :defaultProps="{label: 'registerLabel', value: 'registerId'}"
        :disabled="!registerList.length"
      />
      <dpmsCell
        title="主诉"
        wrap
      >
        <div class="text" data-placeholder="请输入主诉"
          @click="openTextarea({title: '主诉', value: form.mainComplaint, key: 'mainComplaint'})"
        >{{form.mainComplaint}}</div>
      </dpmsCell>
      <dpmsCell
        title="现病史"
        wrap
      >
        <div class="text" data-placeholder="请输入现病史"
          @click="openTextarea({title: '现病史', value: form.presentIllnessHistory, key: 'presentIllnessHistory'})"
        >{{form.presentIllnessHistory}}</div>
      </dpmsCell>
      <dpmsCell
        title="既往史"
        wrap hideBorderBottom
      >
        <div class="text" data-placeholder="请输入既往史"
          @click="openTextarea({title: '既往史', value: form.pastIllnessHistory, key: 'pastIllnessHistory'})"
        >{{form.pastIllnessHistory}}</div>
      </dpmsCell>
      <div style="height:20rpx"></div>
      <dpmsCell title="同步牙位" hideBorderBottom>
        <switch :checked="teethSync" @change="teethSyncChange"/>
      </dpmsCell>
      <div style="height:20rpx"></div>
      <dpmsCell title="口腔检查" wrap hideBorderBottom>
        <div style="margin-top:40rpx">
          <div class="teeth-select" v-for="(v0, i) in form.medicalRecordCheckNormalVOList" :key="i">
            <TeethSelect class="handle" :value="v0.checkNormalToothPosition" :index="i" @input="(val, i) => setTeethSelect(val, `medicalRecordCheckNormalVOList.${i}.checkNormalToothPosition`)"/>
            <button class="btn" v-if="form.medicalRecordCheckNormalVOList.length > 1" @click="delTeeth(form.medicalRecordCheckNormalVOList, i)">删除</button>
            <div class="text" data-placeholder="请输入口腔检查"
              @click="openTextarea({title: '口腔检查', value: v0.checkNormalSymptoms, key: `medicalRecordCheckNormalVOList.${i}.checkNormalSymptoms`})"
            >{{v0.checkNormalSymptoms}}</div>
          </div>
          <div class="bottom-func" @click="form.medicalRecordCheckNormalVOList.push({})">
            <div class="iconfont icon-plus-circle"/>添加牙位
          </div>
        </div>
      </dpmsCell>
      <div style="height:20rpx"></div>
      <dpmsCell title="辅助检查" wrap hideBorderBottom>
        <div style="margin-top:40rpx">
          <div class="teeth-select" v-for="(v0, i) in form.medicalRecordCheckRayVOList" :key="i">
            <TeethSelect class="handle" :value="v0.checkRayToothPosition" :index="i" @input="(val, i) => setTeethSelect(val, `medicalRecordCheckRayVOList.${i}.checkRayToothPosition`)"/>
            <button class="btn" v-if="form.medicalRecordCheckRayVOList.length > 1" @click="delTeeth(form.medicalRecordCheckRayVOList, i)">删除</button>
            <div class="text" data-placeholder="请输入辅助检查"
              @click="openTextarea({title: '辅助检查', value: v0.checkRaySymptoms, key: `medicalRecordCheckRayVOList.${i}.checkRaySymptoms`})"
            >{{v0.checkRaySymptoms}}</div>
          </div>
          <div class="bottom-func" @click="form.medicalRecordCheckRayVOList.push({})">
            <div class="iconfont icon-plus-circle"/>添加牙位
          </div>
        </div>
      </dpmsCell>
      <div style="height:20rpx"></div>
      <dpmsCell title="诊断" wrap hideBorderBottom>
        <div style="margin-top:40rpx">
          <div class="teeth-select" v-for="(v0, i) in form.medicalRecordDiagnosisVOList" :key="i">
            <TeethSelect class="handle" :value="v0.diagnosisPosition" :index="i" @input="(val, i) => setTeethSelect(val, `medicalRecordDiagnosisVOList.${i}.diagnosisPosition`)"/>
            <button class="btn" v-if="form.medicalRecordDiagnosisVOList.length > 1" @click="delTeeth(form.medicalRecordDiagnosisVOList, i)">删除</button>
            <div class="text" data-placeholder="请输入诊断"
              @click="openTextarea({title: '诊断', value: v0.diagnosisDesc, key: `medicalRecordDiagnosisVOList.${i}.diagnosisDesc`})"
            >{{v0.diagnosisDesc}}</div>
          </div>
          <div class="bottom-func" @click="form.medicalRecordDiagnosisVOList.push({})">
            <div class="iconfont icon-plus-circle"/>添加牙位
          </div>
        </div>
      </dpmsCell>
      <div style="height:20rpx"></div>
      <dpmsCell title="治疗方案" wrap hideBorderBottom>
        <div style="margin-top:40rpx">
          <div class="teeth-select" v-for="(v0, i) in form.medicalRecordTreatmentProgramVOList" :key="i">
            <TeethSelect class="handle" :value="v0.treatmentProgramPosition" :index="i" @input="(val, i) => setTeethSelect(val, `medicalRecordTreatmentProgramVOList.${i}.treatmentProgramPosition`)"/>
            <button class="btn" v-if="form.medicalRecordTreatmentProgramVOList.length > 1" @click="delTeeth(form.medicalRecordTreatmentProgramVOList, i)">删除</button>
            <div class="text" data-placeholder="请输入治疗方案"
              @click="openTextarea({title: '治疗方案', value: v0.treatmentProgram, key: `medicalRecordTreatmentProgramVOList.${i}.treatmentProgram`})"
            >{{v0.treatmentProgram}}</div>
          </div>
          <div class="bottom-func" @click="form.medicalRecordTreatmentProgramVOList.push({})">
            <div class="iconfont icon-plus-circle"/>添加牙位
          </div>
        </div>
      </dpmsCell>
      <div style="height:20rpx"></div>
      <dpmsCell title="处置" wrap hideBorderBottom>
        <div style="margin-top:40rpx">
          <div class="teeth-select" v-for="(v0, i) in form.medicalRecordDisposeVOList" :key="i">
            <TeethSelect class="handle" :value="v0.disposePosition" :index="i" @input="(val, i) => setTeethSelect(val, `medicalRecordDisposeVOList.${i}.disposePosition`)"/>
            <button class="btn" v-if="form.medicalRecordDisposeVOList.length > 1" @click="delTeeth(form.medicalRecordDisposeVOList, i)">删除</button>
            <div class="text" data-placeholder="请输入处置"
              @click="openTextarea({title: '处置', value: v0.dispose, key: `medicalRecordDisposeVOList.${i}.dispose`})"
            >{{v0.dispose}}</div>
          </div>
          <div class="bottom-func" @click="form.medicalRecordDisposeVOList.push({})">
            <div class="iconfont icon-plus-circle"/>添加牙位
          </div>
        </div>
      </dpmsCell>
      <div style="height:20rpx"></div>
      <dpmsCell
        title="医嘱"
        wrap hideBorderBottom
      >
        <div class="text" data-placeholder="请输入医嘱"
          @click="openTextarea({title: '医嘱', value: form.doctorAdvice, key: 'doctorAdvice'})"
        >{{form.doctorAdvice}}</div>
      </dpmsCell>
    </dpmsForm>
    <div class="bottom">
      <button @click="save">保 存</button>
    </div>
  </div>
</template>

<script>
import diagnosisAPI from '@/APIS/diagnosis/diagnosis.api.js'
import moment from 'moment'
import TeethSelect from '@/businessComponents/TeethSelect/TeethSelect.vue'
import {mapState} from 'vuex'
import { getStorage, STORAGE_KEY } from '@/utils/storage'

export default {
  components: {TeethSelect},
  data() {
    return {
      form: {registerId: '', mainComplaint: '', presentIllnessHistory: '', pastIllnessHistory: '',
        medicalRecordCheckNormalVOList: [{}], medicalRecordCheckRayVOList: [{}], 
        medicalRecordDiagnosisVOList: [{}], medicalRecordTreatmentProgramVOList: [{}],
        medicalRecordDisposeVOList: [{}], doctorAdvice: '',
      }, 
      rules: {}, teethSync: true,
      registerList: null,
    }
  },
  methods: {
    async getRegisterList(param) {
      const res = await diagnosisAPI.getRegisterList(param)
      this.registerList = (res.data || []).map(d => ({
        ...d, registerLabel: moment(d.registerTime).format('YYYY/MM/DD HH:mm')
      }))
    },
    onTextareaChange() {
      uni.$on('medicalRecordTextareaChange', ({value, key}) => {
        if (/^\w+\.\d+\.\w+$/.test(key)) {
          const ks = key.split('.')
          this.$set(this.form[ks[0]], ks[1], {...this.form[ks[0]][ks[1]], [ks[2]]: value})
        } else {
          this.$set(this.form, key, value)
        }
      })
    },
    openTextarea({title='', value='', key=''}) {
      this.$utils.push({url: `/pages/patient/medicalRecord/Textarea?title=${title}&value=${value || ''}&key=${key}`})
    },
    setTeethSelect(value, key) {
      const ks = key.split('.')
      this.$set(this.form[ks[0]], ks[1], {...this.form[ks[0]][ks[1]], [ks[2]]: value})
      if (this.teethSync && ks[1] == 0) {
        const formKeys = [
          ['medicalRecordCheckNormalVOList', 'checkNormalToothPosition'],
          ['medicalRecordCheckRayVOList', 'checkRayToothPosition'],
          ['medicalRecordDiagnosisVOList', 'diagnosisPosition'],
          ['medicalRecordTreatmentProgramVOList', 'treatmentProgramPosition'],
          ['medicalRecordDisposeVOList', 'disposePosition'],
        ].filter(_ks => _ks[0] !== ks[0])
        formKeys.forEach(fk => {
          this.$set(this.form[fk[0]], 0, {...this.form[fk[0]][0], [fk[1]]: value})
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
          result = this.form[k].reduce((_r, _v) => _r || !!Object.keys(_v).length, false)
        }
        return r || result
      }, false)
      if (!inputed) return this.$utils.show('请至少填写一项内容')
      if (this.pending) return
      this.pending = true
      this.$utils.showLoading('请稍后...')
      await diagnosisAPI[this.medicalRecordId ? 'updateMedicalRecord' : 'createMedicalRecord']({
        medicalRecordVOJson: JSON.stringify({
          medicalRecordId: this.medicalRecordId,
          patientId: this.patientId,
          medicalInstitutionId: getStorage(STORAGE_KEY.MEDICALINSTITUTION).medicalInstitutionId,
          ...this.form,
        })
      })
      this.$utils.clearLoading()
      this.$utils.show(`${this.medicalRecordId ? '编辑' : '新建'}成功`, {icon: 'success'})
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
        title: '编辑病历'
      });
      this.getMedicalRecordDetail()
    },
    async getMedicalRecordDetail() {
      this.$utils.showLoading('加载中...')
      const res = await diagnosisAPI.getMedicalRecordDetail({medicalRecordId: this.medicalRecordId})
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
    teethSyncChange({detail}) {
      this.teethSync = detail.value
    }
  },
  onLoad({patientId, medicalRecordId}) {
    this.patientId = patientId
    this.medicalRecordId = medicalRecordId
    this.getRegisterList({patientId})
    this.onTextareaChange()
    this.onEdit()
  }
}
</script>

<style lang="scss" scoped>
.text{
  padding-top: 18rpx;
  box-sizing: border-box;
  min-height: 62rpx;
  white-space: normal;
  width: 100%;
  color: rgba(0,0,0,0.65);
  &:empty{
    &::before{
      content: attr(data-placeholder);
      color: rgba(0,0,0,0.3);
    }
  }
}
.teeth-select{
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
  padding-bottom: 32rpx;
  border-bottom: rgba(0,0,0,0.15) solid 2rpx;
  .handle{
    padding: 32rpx 0;
    width: 570rpx;
  }
  .btn{
    flex: none;
    font-size: 28rpx;
    color: #5cbb89;
    background: none;
    padding: 0;
    margin: 0 0 0 60rpx;
  }
}
.bottom-func{
  padding-top: 32rpx;
  color: #5cbb89;
  font-size: 34rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  .iconfont{
    font-size: inherit;
    margin-right: 16rpx;
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