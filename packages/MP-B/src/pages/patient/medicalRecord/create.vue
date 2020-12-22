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
        wrap
      >
        <div class="text" data-placeholder="请输入既往史"
          @click="openTextarea({title: '既往史', value: form.pastIllnessHistory, key: 'pastIllnessHistory'})"
        >{{form.pastIllnessHistory}}</div>
      </dpmsCell>
      <div style="height:20rpx"></div>
      <!-- <dpmsCell title="同步牙位">
        <switch/>
      </dpmsCell> -->
      <dpmsCell title="口腔检查" wrap>
        <TeethSelect v-model="form.medicalRecordCheckNormalVOList" style="margin-top:60rpx"/>
      </dpmsCell>
    </dpmsForm>
  </div>
</template>

<script>
import diagnosisAPI from '@/APIS/diagnosis/diagnosis.api.js'
import moment from 'moment'
import TeethSelect from '@/businessComponents/TeethSelect/TeethSelect.vue'
export default {
  components: {TeethSelect},
  data() {
    return {
      form: {registerId: '', mainComplaint: '', presentIllnessHistory: '', pastIllnessHistory: '',
        medicalRecordCheckNormalVOList: {teeth: {}}
      }, 
      rules: {},
      registerList: [],
    }
  },
  methods: {
    async getRegisterList(param) {
      const res = await diagnosisAPI.getRegisterList(param)
      this.registerList = (res.data || []).map(d => ({
        ...d, registerLabel: moment(d.registerTime).format('YYYY/MM/DD HH:mm')
      }))
      if (this.registerList.length) {
        this.form.registerId = this.registerList[0].registerId
      }
    },
    onMainComplaint() {
      uni.$on('medicalRecordTextareaChange', ({value, key}) => {
        this.form[key] = value
      })
    },
    openTextarea({title='', value='', key=''}) {
      this.$utils.push({url: `/pages/patient/medicalRecord/Textarea?title=${title}&value=${value || ''}&key=${key}`})
    }
  },
  onLoad({patientId}) {
    this.patientId = patientId
    this.getRegisterList({patientId})
    this.onMainComplaint()
  }
}
</script>

<style lang="scss" scoped>
.text{
  padding-top: 18rpx;
  box-sizing: border-box;
  min-height: 62rpx;
  white-space: normal;
  &:empty{
    &::before{
      content: attr(data-placeholder);
      color: rgba(0,0,0,0.3);
    }
  }
}
</style>