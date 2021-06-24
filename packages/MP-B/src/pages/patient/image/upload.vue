<template>
  <div class="imageUploader">
    <dpmsForm ref="form" :model="form" :rules="rules">
      <dpmsCellPicker
        title="就诊信息"
        placeholder="暂无就诊信息"
        v-model="form.registerId"
        :list="registerList"
        defaultType="registerId"
        :defaultProps="{ label: 'registerLabel', value: 'registerId' }"
        :disabled="!registerList.length"
      />
      <dpmsCellPicker
        title="影像医嘱项目"
        placeholder="请选择影像医嘱项目"
        v-model="form.diagnosisSettingsImageItemId"
        :list="settingsImageItems"
        defaultType="diagnosisSettingsImageItemId"
        :defaultProps="{
          label: 'diagnosisSettingsImageItemName',
          value: 'diagnosisSettingsImageItemId',
        }"
      />
      <dpmsCellPicker
        required
        title="影像类型"
        placeholder="请选择影像类型"
        v-model="form.imageType"
        :list="imageTypeList"
        defaultType="value"
        :defaultProps="{ label: 'label', value: 'value' }"
      />
      <dpmsCell title="牙位" wrap>
        <TeethSelect class="handle" v-model="toothPosition" />
      </dpmsCell>
      <dpmsCell
        title="影像上传"
        required
        wrap
        placeholderStyle="font-size: 27rpx"
        placeholder="可添加jpg、png、jpeg、bmp、gif，且大小不超过50M"
      >
        <div class="upload-wrap">
          <MyUpload
            v-model="form.imageUrlStr"
            :format="uploadFormat"
          ></MyUpload>
        </div>
      </dpmsCell>
      <div class="pt-56 pb-82">
        <dpmsButton @click="submit" />
      </div>
    </dpmsForm>
  </div>
</template>

<script>
import TeethSelect from '@/businessComponents/TeethSelect/TeethSelect.vue'
import MyUpload from '@/businessComponents/MyUpload/MyUpload'
import diagnosisAPI from '@/APIS/diagnosis/diagnosis.api.js'
import moment from 'moment'
export default {
  components: { MyUpload, TeethSelect },
  data() {
    return {
      form: {
        registerId: '',
        imageType: '',
        imageUrlStr: '',
        diagnosisSettingsImageItemId: '',
        toothPositionStr: '',
        toothPosition: '',
      },
      rules: {
        imageType: [{ required: true, message: '请选择影像类型' }],
        imageUrlStr: [{ required: true, message: '请上传影像' }],
      },
      toothPosition: '',
      registerList: null,
      imageType: {},
      settingsImageItems: {},
    }
  },
  computed: {
    imageTypeList() {
      return Object.values(this.imageType).map((t) => ({
        ...t,
        label: t.text.zh_CN,
      }))
    },
  },
  watch: {
    toothPosition(newVal) {
      if (!newVal) return
      this.form.toothPositionStr = JSON.stringify(newVal)
      this.form.toothPosition = Object.keys(newVal.teeth).join(',')
    },
  },
  methods: {
    async getSettingsImageItems() {
      const res = await diagnosisAPI.getSettingsItem({ pageSize: 30 })
      this.settingsImageItems = res.data
    },
    async getRegisterList(param) {
      const res = await diagnosisAPI.getRegisterList(param)
      this.registerList = (res.data || []).map((d) => ({
        ...d,
        registerLabel: moment(d.registerTime).format('YYYY/MM/DD HH:mm'),
      }))
      this.form.registerId = this.registerList[0]?.registerId
    },
    async getImageEnums() {
      const res = await diagnosisAPI.getImageEnums()
      this.imageType = res.data.ImageType
    },
    async saveImageInfo() {
      await diagnosisAPI.saveImageInfo({
        ...this.form,
        patientId: this.patientId,
      })
      this.$dpmsUtils.clearLoading()
      this.$dpmsUtils.show('上传成功', { icon: 'success' })
      this.$dpmsUtils.back()
      this.$nextTick(() => {
        this.pending = false
      })
    },
    submit() {
      if (this.pending) return
      this.pending = true
      this.$dpmsUtils.showLoading('请稍后...')
      this.$dpmsUtils.formValidate(this.rules, this.form, (err) => {
        if (err) {
          this.pending = false
          this.$dpmsUtils.clearLoading()
          return this.$dpmsUtils.show(err[0].message)
        }
        this.saveImageInfo()
      })
    },
    uploadFormat(v) {
      return JSON.stringify(v)
    },
  },
  onLoad({ patientId }) {
    this.patientId = patientId
    this.getRegisterList({ patientId })
    this.getImageEnums()
    this.getSettingsImageItems()
  },
}
</script>

<style lang="scss" scoped>
.imageUploader {
  .upload-wrap {
    padding-top: 28rpx;
  }
  .textarea {
    padding: 18rpx 0 0;
    height: 160rpx;
  }
  .count {
    text-align: right;
    color: rgba(0, 0, 0, 0.3);
    font-size: 28rpx;
    width: 100%;
  }
}
</style>
