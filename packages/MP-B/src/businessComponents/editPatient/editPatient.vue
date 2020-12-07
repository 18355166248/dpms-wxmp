<template>
  <div class="h100">
    <dpmsForm ref="editPatientForm" :model="form" :rules="rules">
      <dpmsFormTitle title="基本信息" />
      <dpmsCellInput
        required
        title="姓名"
        placeholder="请输入姓名"
        v-model="form.patientName"        
      />
      <dpmsEnumsPicker
        required
        title="性别"
        placeholder="请选择性别"
        v-model="form.gender"
        enumsKey="Gender"
        isLink
        headerText="选择性别"
      />
      <dpmsDatePicker
        title="出生日期"
        placeholder="请选择出生日期"
        v-model="form.birthday"
        :end="endDate"
        headerText="选择出生日期"
      />
      <dpmsCellPicker
        title="患者类型"
        placeholder="请选择患者类型"
        v-model="form.settingsTypeId"
        :list="patientTypeList"
        defaultType="settingsTypeId"
        :defaultProps="{ label: 'settingsTypeName', value: 'settingsTypeId' }"
        isLink
      />
      <dpmsCell
        title="患者标签"
        placeholder="请选择患者标签"
        :value="patientTagsCheckedText"
        isLink
        @click.native="onSelectTags"
      />
      <dpmsFormTitle title="联系方式" />
      <dpmsEnumsPicker
        required
        title="联系电话标签"
        placeholder="请选择联系电话标签"
        v-model="form.contactLabel"
        enumsKey="ContactLabel"
        isLink
      />
      <dpmsCellInput
        required
        title="联系电话"
        placeholder="请输入联系电话"
        v-model="form.mobile"
      />
      <dpmsCellInput
        title="固定电话"
        placeholder="请输入固定电话"
        v-model="form.fixedTelephone"
      />
      <dpmsCellInput
        title="备用号码"
        placeholder="请输入备用号码"
        v-model="form.alternateMobile"
      />
      <dpmsCellInput
        title="微信号"
        placeholder="请输入微信号"
        v-model="form.weChatId"
      />
      <dpmsCellInput
        title="QQ"
        placeholder="请输入QQ"
        v-model="form.qqNum"
      />
      <dpmsPlacePicker
        title="家庭住址"
        placeholder="请选择地区"
        v-model="form.region"
        headerText="选择地区"
      />
      <div class="dpms-cell-group dpms-cell-group-textarea">
        <div class="dpms-cell" data-layout-align="space-between center">
          <textarea
            style="height: 142rpx; padding: 6rpx 0; width: 686rpx;"
            placeholder-style="font-size: 34rpx;font-weight: 400;color: rgba(0, 0, 0, 0.25);"
            placeholder="请输入详细住址"
            maxlength="100"
            v-model="form.address"
          />
        </div>
      </div>
      <div class="pt-56 pb-82">
        <dpmsButton
          @click="submit"
          type="primary"
          :disabled="disabledSaveBtn"
          :loading="disabledSaveBtn"
        />
        <!-- <dpmsButton @click="submit" text="取消" /> -->
      </div>
    </dpmsForm>
  </div>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import patientAPI from '@/APIS/patient/patient.api'

const formDefault = {
  patientName: '',
  gender: '',
  birthday: '',
  settingsTypeId: '',
  tagIds: [],
  contactLabel: '',
  mobile: '',
  fixedTelephone: '',
  alternateMobile: '',
  weChatId: '',
  qqNum: '',
  region: [],
  address: '',
}

export default {
  props: {
    formData: {
      type: Object,
      default: formDefault,
    },
    editType : {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      patientTypeList: [], //患者类型列表
      patientTagsCheckedText: '', //用户画像选中文本
      endDate: moment().format('YYYY-MM-DD'),
      disabledSaveBtn: false,
      form: this.filterFormData(this.formData),
      oldForm: this.filterFormData(this.formData),
      newRules: {},
      changeKeys: [],
      rules: {
        patientName: [
          {
            required: true,
            message: '请输入姓名',
          },
          {
            min: 1,
            max: 50,
            message: '姓名输入不应该超过 50 字',
          },
        ],
        gender: {
          required: true,
          message: '请选择性别',
        },
        birthday: {
          message: '请选择出生日期',
        },
        contactLabel: {
          required: true,
          message: '请选择联系电话标签',
        },
        mobile: [
          {
            required: true,
            message: '请输入联系电话',
          },
          {
            pattern: /^\d{11}$/,
            message: '联系电话格式不正确',
          },
        ],
        fixedTelephone: {
          pattern: /^[^*][\d\-]{1,15}$/,
          message: '固定电话格式不正确',
        },
        alternateMobile: {
          pattern: /^\d{11}$/,
          message: '备用号码格式不正确',
        },
        weChatId: {
          pattern: /^[^*]{0,20}$/g,
          message: '请输入正确的微信号',
        },
        qqNum: {
          // pattern: /^\d{1,20}$/,
          pattern: /^[^*]\d{1,20}$/g,
          message: '请输入正确的QQ格式',
        },
        address: {
          pattern: /^[^*]{0,100}$/g,
          message: '详细地址输入不能带*且不超过 100 字',
        },
      },
    }
  },
  watch: {
    formData(newVal) {
      this.form = this.filterFormData(newVal)
      this.oldForm = this.filterFormData(newVal)
    },
  },
  created() {
    // 更新用户画像选中值
    uni.$on('updateTagsCheckedList', (checked) => {
      this.form.tagIds = checked

      this.updateTagsCheckedText()
    })

    this.getPatientTypeList()
    this.getPatientTags()
  },
  beforeDestroy() {
    uni.$off('updateTagsCheckedList')
    uni.removeStorageSync('patientTagsList')
  },
  methods: {
    async getPatientTypeList() {
      let res = await patientAPI.getPatientTypeList()
      this.patientTypeList = res.data
    },
    async getPatientTags() {
      let res = await patientAPI.getPatientTags()

      uni.setStorageSync(
        'patientTagsList',
        res.data.filter((v) => v.tagInfoDTOList?.length > 0),
      )
      this.updateTagsCheckedText()
    },
    filterFormData(data) {
      if (_.isEmpty(data)) {
        return formDefault
      }

      // 格式化formData
      data = data.patientContactsList
        ? { ...formDefault, ...data, ...data.patientContactsList[0] }
        : { ...formDefault, ...data, ...data.patientContactsList }
      data.region = [data.province, data.city, data.area]
      if (data.tagList) {
        data.tagIds = data.tagList.map((v) => v.id)
        this.patientTagsCheckedText = data.tagList.map((v) => v.name).join(',')
      }

      return data
    },
    onSelectTags() {
      this.$utils.push({
        url:
          '/pages/patient/createPatient/personas?checked=' +
          this.form.tagIds.join(','),
      })
    },
    updateTagsCheckedText() {
      let patientTagsList = uni.getStorageSync('patientTagsList')

      let newPaientTagsList = []
      patientTagsList.map((item) => {
        newPaientTagsList = [...newPaientTagsList, ...item.tagInfoDTOList]
        return item
      })

      newPaientTagsList = newPaientTagsList.filter((tagItem) =>
        this.form.tagIds.includes(tagItem.id),
      )

      this.patientTagsCheckedText = newPaientTagsList
        .map((tagItem) => tagItem.name)
        .join(',')
    },
    contrastForm() {
      if (this.editType) {
        let arr = []
        for(let key in this.oldForm){
          if (JSON.stringify(this.form[key]) !== JSON.stringify(this.oldForm[key])){
            arr.push(key)
          }
        }
        this.changeKeys = arr.filter((value,index,self) => {
          return self.indexOf(value) === index
        })
        if (this.changeKeys.length) {
          this.changeKeys.forEach(item => {
            if(item !== 'settingsTypeId' && item !== 'tagIds' && item !== 'region') {
              this.newRules[item] = this.rules[item]
            }
          })
        }
      } else this.newRules = this.rules
    },
    async submit() {
      this.contrastForm()
      if (this.editType && !this.changeKeys.length) {
        //保存患者时，添加禁用和loading效果
        this.disabledSaveBtn = true
        this.$emit('submit', this.form)
        return
      }

      this.$utils.formValidate(
        this.newRules,
        this.form,
        (err, fileds, formValue) => {
          this.form = formValue
          if (err) {
            this.$utils.show(err[0]?.message)
            return
          }

          //保存患者时，添加禁用和loading效果
          this.disabledSaveBtn = true
          this.$emit('submit', this.form)
        },
      )
    },
    showBtn() {
      this.disabledSaveBtn = false
    },
    hideBtn() {
      this.disabledSaveBtn = true
    },
  },
}
</script>

<style lang="scss" scoped>
[data-layout-align] {
  display: flex;
  justify-content: flex-start;
  align-content: stretch;
  align-items: stretch;
}

[data-layout-align='space-between center'] {
  justify-content: space-between;
  align-items: center;
  align-content: center;
  max-width: 100%;
}

.dpms-cell-group {
  width: 750rpx;
  height: 112rpx;
  background: #fff;
  .dpms-cell {
    height: 112rpx;
    margin: 0 32rpx;
    border-bottom: 2rpx solid rgba(0, 0, 0, 0.15);
    .dpms-cell-title {
      width: 211rpx;
      span {
        font-size: 34rpx;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.9);
        margin-left: 4rpx;
      }
    }

    .dpms-cell-value {
      font-size: 34rpx;
      font-weight: 400;
      text-align: right;
      color: rgba(0, 0, 0, 0.5);
      .placeholder-style {
        color: rgba(0, 0, 0, 0.25);
      }
      .iconfont {
        margin-left: 4rpx;
        color: rgba(0, 0, 0, 0.25);
      }
    }
  }
  .dpms-cell:last-child {
    border-bottom: none;
  }
}

.dpms-cell-group-textarea {
  height: 154rpx;
  .dpms-cell {
    height: 154rpx;
  }
}
</style>
