<template>
  <div class="imageUploader">
    <dpmsForm ref="form" :model="form" :rules="rules">
      <dpmsCell title="就诊信息" :isLink="registerList">
        <template #title>
          <div class="treatmentInfo">
            就诊信息
            <dpmsDatetimePicker
              isCell
              showDayOfWeek
              :end="endTime"
              @change="registNew"
            >
              <span class="iconfont icon-plus-circle addTreatInfo" />
            </dpmsDatetimePicker>
          </div>
        </template>
        <picker
          mode="selector"
          :range="registerList"
          range-key="registerLabel"
          :disabled="!registerList.length"
          :value="registerInx"
          @change="registerChange"
        >
          <div>
            <div v-if="!registerList.length">暂无就诊信息</div>
            <div v-if="registerText">{{ registerText }}</div>
            <div v-else style="width: 100px; height: 10px;"></div>
          </div>
        </picker>
      </dpmsCell>
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
const statusEnums = [
  { status: 1, text: '已预约' },
  { status: 2, text: '已挂号' },
  { status: 3, text: '咨询中' },
  { status: 4, text: '治疗中' },
  { status: 5, text: '治疗完成' },
  { status: 6, text: '已取消' },
  { status: 7, text: '默认挂号' },
  { status: 8, text: '已离开' },
  { status: 9, text: '已确认' },
  { status: 10, text: '已回退' },
  { status: 11, text: '已失约' },
]
export default {
  components: { MyUpload, TeethSelect },
  data() {
    return {
      form: {
        registerId: '',
        registerTime: null,
        imageType: '',
        imageUrlStr: '',
        diagnosisSettingsImageItemId: '',
        toothPositionStr: '',
        toothPosition: '',
        appointmentId: -1,
        uniqueId: '',
      },
      registerInx: 0,
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
    registerText() {
      return (
        (this.registerList &&
          this.registerList.find((l, i) => i === this.registerInx)
            ?.registerLabel) ||
        ''
      )
    },
    // 自定义时间 不支持选择未来日期
    endTime() {
      return moment().endOf('day').format('YYYY-MM-DD HH:mm')
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
    async getTreatmentList(param) {
      const res = await diagnosisAPI.getTreatmentList(param)
      this.registerList = (res.data || []).map((d) => ({
        ...d,
        registerLabel:
          moment(d.registerTime).format('YYYY-MM-DD/ddd HH:mm') +
          ' ' +
          statusEnums.find((e) => e.status === d.status).text,
      }))
      // 判断当日是否存在就诊信息，如有就选中
      const today = moment().startOf('day')
      this.registerInx = this.registerList.findIndex((e) =>
        moment(e.registerTime).isSame(today, 'd'),
      )
      if (this.registerInx !== -1) {
        this.form.registerId = this.registerList[this.registerInx]?.registerId
        this.form.appointmentId =
          this.registerList[this.registerInx]?.appointmentId === undefined
            ? -1
            : this.registerList[this.registerInx]?.appointmentId //没有值的情况下需要传-1给后端
        this.form.uniqueId = this.registerList[this.registerInx]?.uniqueId
      }
    },
    async getImageEnums() {
      const res = await diagnosisAPI.getImageEnums()
      this.imageType = res.data.ImageType
    },
    async saveImageInfo() {
      const params = {
        ...this.form,
        patientId: this.patientId,
        appointmentId: this.form.uniqueId === -1 ? -1 : this.form.appointmentId,
        registerTime:
          this.form.uniqueId === -1 ? this.form.registerTime : undefined,
      }
      await diagnosisAPI.saveImageInfo(params)
      this.$dpmsUtils.clearLoading()
      this.$dpmsUtils.show('上传成功', { icon: 'success' })
      this.$dpmsUtils.back()
      this.$nextTick(() => {
        this.pending = false
      })
    },
    registNew({ dt }) {
      const uniqueId = -1 // 后端已做更改，不需要传-1
      const registerTime = moment(dt).valueOf()
      const registerLabel = moment(dt).format('YYYY-MM-DD/ddd HH:mm')
      const newRegisterIndex = this.registerList.findIndex(
        (l) => l.uniqueId === uniqueId,
      )
      if (newRegisterIndex !== -1) {
        this.registerList[newRegisterIndex].registerTime = registerTime
        this.registerList[newRegisterIndex].registerLabel = registerLabel
      } else {
        this.form.uniqueId = -1
        this.registerList.unshift({ uniqueId, registerTime, registerLabel })
        this.registerInx = 0
      }

      // this.form.registerId = registerId
      this.form.registerId =
        this.form.uniqueId === -1 ? null : this.form.registerId // 后端已做更改，自定义时间时不用传-1
      this.form.registerTime = registerTime
      this.form.appointmentId = -1
    },
    registerChange({ detail }) {
      console.log(1111, detail)
      const item = this.registerList[detail.value]

      if (item) {
        this.form.registerId = item.registerId
        this.form.appointmentId = item.appointmentId
        this.form.visType = item.visType
        this.registerInx = Number(detail.value)
      }
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
    this.getTreatmentList({ patientId })
    this.getImageEnums()
    this.getSettingsImageItems()
  },
}
</script>

<style lang="scss" scoped>
.imageUploader {
  .treatmentInfo {
    display: flex;
    align-items: center;
  }

  .upload-wrap {
    padding-top: 28rpx;
  }

  .addTreatInfo {
    color: #5cbb89;
    padding: 10rpx;
    display: block;
    font-size: 40rpx;
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
