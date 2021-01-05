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
      <dpmsCellPicker
        required
        title="影像类型"
        placeholder="请选择影像类型"
        v-model="form.imageType"
        :list="imageTypeList"
        defaultType="value"
        :defaultProps="{ label: 'label', value: 'value' }"
      />
      <dpmsCell
        title="影像上传"
        required
        wrap
      >
        <div class="upload-wrap">
          <MyUpload v-model="form.imageUrlStr" :format="uploadFormat"></MyUpload>
        </div>
      </dpmsCell>
      <dpmsCell
        title="备注"
        wrap
      >
        <textarea
          class="textarea" v-model="form.remark"
          placeholder-style="color: rgba(0,0,0,0.3);"
          placeholder="请输入备注" maxlength="500"
        />
        <div class="count">{{form.remark.length}}/500</div>
      </dpmsCell>
      <div class="pt-56 pb-82">
        <dpmsButton @click="submit"/>
      </div>
    </dpmsForm>
  </div>
</template>

<script>
import MyUpload from '@/businessComponents/MyUpload/MyUpload'
import diagnosisAPI from '@/APIS/diagnosis/diagnosis.api.js'
import moment from 'moment'
export default {
  components: {MyUpload},
  data() {
    return {
      form: {registerId: '', imageType: '', imageUrlStr: '', remark: ''}, rules: {
        imageType: [
          {required: true, message: '请选择影像类型'}
        ],
        imageUrlStr: [
          {required: true, message: '请上传影像'}
        ]
      }, registerList: [],
      imageType: {},
    }
  },
  computed: {
    imageTypeList() {
      return Object.values(this.imageType).map(t => ({
        ...t, label: t.text.zh_CN
      }))
    }
  },
  methods: {
    async getRegisterList(param) {
      const res = await diagnosisAPI.getRegisterList(param)
      this.registerList = (res.data || []).map(d => ({
        ...d, registerLabel: moment(d.registerTime).format('YYYY/MM/DD HH:mm')
      }))
    },
    async getImageEnums() {
      const res = await diagnosisAPI.getImageEnums()
      this.imageType = res.data.ImageType
    },
    async saveImageInfo() {
      await diagnosisAPI.saveImageInfo({
        ...this.form, patientId: this.patientId
      })
      this.$utils.clearLoading()
      this.$utils.show('上传成功', {icon: 'success'})
      this.$utils.back()
      this.$nextTick(() => {
        this.pending = false
      })
    },
    submit() {
      if (this.pending) return
      this.pending = true
      this.$utils.showLoading('请稍后...')
      this.$utils.formValidate(
        this.rules, this.form,
        (err) => {
          if (err) {
            this.pending = false
            this.$utils.clearLoading()
            return this.$utils.show(err[0].message)
          }
          this.saveImageInfo()
        }
      )
    },
    uploadFormat(v) {
      return JSON.stringify(v)
    }
  },
  onLoad({patientId}) {
    this.patientId = patientId
    this.getRegisterList({patientId})
    this.getImageEnums()
  }
}
</script>

<style lang="scss" scoped>
.upload-wrap{
  padding-top: 28rpx;
}
.textarea{
  padding: 18rpx 0 0;
  height: 160rpx;
}
.count{
  text-align: right;
  color: rgba(0,0,0,0.3);
  font-size: 28rpx;
  width: 100%;
}
</style>