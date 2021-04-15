<template>
  <div class="h100 editPatientForm">
    <dpmsForm ref="editPatientForm" :model="form" :rules="rules">
      <dpmsFormTitle title="基本信息" />
      <dpmsCellInput
        required
        title="姓名"
        placeholder="请输入姓名"
        v-model="form.patientName"
      />
      <dpmsEnumsPicker
        title="性别"
        placeholder="请选择性别"
        v-model="form.gender"
        enumsKey="Gender"
        isLink
        headerText="选择性别"
      />
      <dpmsCellInput
        title="个性称呼"
        placeholder="请输入个性称呼"
        v-model="form.nickName"
      />
      <dpmsCellInput
        type="idcard"
        title="身份证号"
        placeholder="请输入身份证号"
        v-model="form.certificatesNo"
      />
      <dpmsTreePicker
        title="患者来源"
        placeholder="请选择患者来源"
        :list="settingsPatientSourceList"
        childrenItemKeyName="childSourceTypeList"
        labelId="settingsPatientSourceTypeId"
        labelName="settingsPatientSourceTypeName"
        dataKeyName="patientSourceList"
        dataKeyLabelId="settingsPatientSourceId"
        dataKeyLabelName="settingsPatientSourceName"
        dataParentId="settingsPatientSourceTypeId"
        :value="form.settingsPatientSourceId"
        @confirm="setPatientSource"
        :openAll="true"
      />
      <dpmsCell
        title="介绍人"
        :isLink="true"
        v-if="sourceName === '朋友介绍' && form.systemInner === 1"
      >
        <input
          placeholder-style="font-size: 34rpx; font-weight: 400; color: rgba(0, 0, 0, 0.25);"
          placeholder="请选择介绍人"
          v-model="form.introducer"
          @click="
            () => {
              this.$utils.push({
                url: '/pages/patient/searchPatient/searchCustomer',
              })
            }
          "
        />
        <template v-slot:right-icon>
          <slot name="inputRight" />
        </template>
      </dpmsCell>
      <dpmsCellPicker
        v-else-if="sourceName === '员工介绍' && form.systemInner === 1"
        title="介绍人"
        placeholder="请选择介绍人"
        v-model="form.sourceValue"
        :list="staffList"
        defaultType="staffId"
        :defaultProps="{ label: 'showStaffName', value: 'staffId' }"
        isLink
      />
      <dpmsCell
        title="介绍人"
        :isLink="true"
        v-else-if="sourceName === '患者介绍' && form.systemInner === 1"
      >
        <input
          placeholder-style="font-size: 34rpx; font-weight: 400; color: rgba(0, 0, 0, 0.25);"
          placeholder="请选择介绍人"
          v-model="form.introducer"
          @click="
            () => {
              this.$utils.push({
                url: '/pages/patient/searchPatient/searchPatient?type=source',
              })
            }
          "
        />
        <template v-slot:right-icon>
          <slot name="inputRight" />
        </template>
      </dpmsCell>
      <dpmsCellInput
        v-else
        title="介绍人"
        placeholder="请输入介绍人"
        v-model="form.introducer"
      />
      <dpmsCellPicker
        title="国籍"
        placeholder="请选择国籍"
        v-model="form.nationality"
        :list="patientNationalityList"
        defaultType="patientNationalityId"
        :defaultProps="{
          label: 'nationalityName',
          value: 'patientNationalityId',
        }"
        isLink
      />
      <dpmsCellInput
        title="医保卡号"
        placeholder="请输入医保卡号"
        v-model="form.medicalInsuranceCardNo"
      />
      <dpmsDatePicker
        title="出生日期"
        placeholder="请选择出生日期"
        v-model="form.birthday"
        :end="endDate"
        headerText="选择出生日期"
      />
      <dpmsCellInput
        title="年龄"
        placeholder="请输入年龄"
        v-model="form.age"
        type="number"
        @blur="ageBlur"
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
      <view style="display: relative;">
        <view class="iconfont icon-sync" @click="onSyncClick"></view>
        <dpmsCellInput
          required
          title="病历号"
          :value="medicalRecordNo"
          placeholder="请输入病历号"
          v-model="form.medicalRecordNo"
        />
      </view>
      <dpmsCell
        title="患者标签"
        placeholder="请选择患者标签"
        :value="patientTagsCheckedText"
        isLink
        @click.native="onSelectTags"
      />
      <dpmsFormTitle title="联系方式" />
      <view class="group">
        <view style="width: 375rpx;">
          <dpmsCellPicker
            title="联系电话"
            placeholder="请选择电话标签"
            v-model="form.contactLabel"
            :list="contactLabelList"
            defaultType="patientContactLabelId"
            :defaultProps="{
              label: 'contactLabelName',
              value: 'patientContactLabelId',
            }"
          />
        </view>
        <view style="width: 375rpx; padding-top: 2px; background: #fff;">
          <dpmsCellInput placeholder="请输入联系电话" v-model="form.mobile" />
        </view>
      </view>
      <dpmsCellInput
        title="固定电话"
        placeholder="请输入固定电话"
        v-model="form.fixedTelephone"
      />
      <dpmsCellInput
        v-if="editType"
        title="备用号码"
        placeholder="请输入备用号码"
        v-model="form.alternateMobile"
      />
      <dpmsCellInput
        v-if="editType"
        title="微信号"
        placeholder="请输入微信号"
        v-model="form.weChatId"
      />
      <dpmsCellInput
        v-if="editType"
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
            style="height: 142rpx; width: 686rpx; margin-top: 30rpx;"
            placeholder-style="font-size: 34rpx;font-weight: 400;color: rgba(0, 0, 0, 0.25);"
            placeholder="请输入详细住址"
            maxlength="100"
            v-model="form.address"
          />
        </div>
      </div>
      <view class="space"></view>
      <div class="remark" :class="{ 'pb-68': isPhoneXCeil }">
        <view class="title">备注</view>
        <textarea
          class="txt"
          placeholder-style="font-size: 34rpx;font-weight: 400;color: rgba(0, 0, 0, 0.25);"
          placeholder="请输入备注"
          maxlength="500"
          v-model="form.memo"
        />
      </div>
      <button
        class="ensurebutton"
        :class="{ 'bt-68': isPhoneXCeil }"
        @click="submit"
        :disabled="disabledSaveBtn"
        :loading="disabledSaveBtn"
      >
        保存
      </button>
      <view class="bottomSpace" v-if="isPhoneXCeil"></view>
    </dpmsForm>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapState } from 'vuex'
import moment from 'moment'
import patientAPI from '@/APIS/patient/patient.api'

const formDefault = {
  patientName: '',
  gender: '',
  birthday: '',
  settingsTypeId: '',
  //患者来源 以及介绍人
  settingsPatientSourceId: '',
  sourceValue: '',
  systemInner: '',
  tagIds: [],
  contactLabel: -1,
  mobile: '',
  fixedTelephone: '',
  alternateMobile: '',
  weChatId: '',
  qqNum: '',
  region: [],
  address: '',
  medicalRecordNo: '',
  nationality: '',
  medicalInsuranceCardNo: '',
  introducer: '',
  sourceName: '',
}

export default {
  props: {
    formData: {
      type: Object,
      default: formDefault,
    },
    editType: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      patientTypeList: [], //患者类型列表
      settingsPatientSourceList: [],
      patientTagsCheckedText: '', //用户画像选中文本
      medicalRecordNo: '', //病历号
      settingsTypeId: '', //患者类型
      settingsPatientSourceId: '', //患者来源
      contactLabelList: [],
      patientNationalityList: [],
      endDate: moment().format('YYYY-MM-DD'),
      disabledSaveBtn: false,
      form: this.filterFormData(this.formData),
      oldForm: this.filterFormData(this.formData),
      newRules: {},
      changeKeys: [],
      staffList: [],
      sourceName: '', //患者来源名称
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
        nickName: [
          {
            max: 50,
            message: '个性称呼输入不应该超过 50 字',
          },
        ],
        medicalInsuranceCardNo: [
          {
            max: 50,
            message: '医保卡号不应该超过 50 字',
          },
        ],
        medicalRecordNo: [
          {
            required: true,
            message: '请输入病历号',
          },
          {
            min: 1,
            max: 30,
            message: '病历号输入不应该超过 30 字',
          },
        ],
        birthday: {
          message: '请选择出生日期',
        },
        age: {
          pattern: /^(?:[1-9][0-9]?|1[01][0-9]|140)$/,
          message: '年龄不合法',
        },
        certificatesNo: {
          pattern: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
          message: '身份证不合法',
        },
        contactLabel: {
          type: 'any',
        },
        mobile: [
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
          pattern: /^[^*]\d{1,20}$/g,
          message: '请输入正确的QQ格式',
        },
        address: {
          pattern: /^[^*]{0,100}$/g,
          message: '请填写详细地址',
        },
        settingsPatientSourceId: {
          type: 'any',
        },
        sourceName: {
          type: 'any',
        },
        sourceValue: {
          type: 'any',
        },
        introducer: {
          type: 'any',
        },
        systemInner: {
          type: 'any',
        }, //不写validator的rules会变成undefiend，会报错
      },
    }
  },
  watch: {
    formData(newVal) {
      this.form = this.filterFormData(newVal)
      this.oldForm = this.filterFormData(newVal)
    },
    'form.settingsTypeId'() {
      this.getPatientMedicalRecordNo()
    },
    'form.birthday'(val) {
      this.form.age = moment().weekYear() - moment(val).weekYear()
    },
    'form.settingsPatientSourceId'(id) {
      if (this.sourceName) return
      const _self = this
      const falt = (arr) => {
        arr.forEach((v) => {
          if (v.childSourceTypeList.length > 0) {
            falt(v.childSourceTypeList)
          } else if (v.patientSourceList.length > 0) {
            v.patientSourceList.forEach((ele) => {
              if (ele.settingsPatientSourceId === Number(id)) {
                _self.form.systemInner = ele.systemInner
                _self.sourceName = ele.settingsPatientSourceName
              }
            })
          }
        })
      }
      falt(this.settingsPatientSourceList)
    },
    'form.sourceValue'(id) {
      if (this.form.systemInner === 1) {
        this.form.sourceValue = Number(id)
      }
    },
  },
  computed: {
    ...mapState('systemStore', ['isPhoneXCeil']),
  },
  created() {
    // 更新用户画像选中值
    uni.$on('updateTagsCheckedList', (checked) => {
      this.form.tagIds = checked
      this.updateTagsCheckedText()
    })
    uni.$on('onSourceValueSelected', ({ patientId, patientName }) => {
      this.form.sourceValue = patientId
      this.form.introducer = patientName
    })
    this.getPatientTypeList()
    this.getPatientTags()
    this.getPatientMedicalRecordNo()
    this.getSettingsPatientSourceList()
    this.getPatientContactLabel()
    this.getPatientNationality()
    this.getScrmStaffList()
  },
  beforeDestroy() {
    uni.$off('updateTagsCheckedList')
    uni.$off('onSourceValueSelected')
    uni.removeStorageSync('patientTagsList')
  },
  methods: {
    setPatientSource({
      settingsPatientSourceId,
      systemInner,
      settingsPatientSourceName,
    }) {
      if (settingsPatientSourceId === this.form.settingsPatientSourceId) return
      this.form.settingsPatientSourceId = settingsPatientSourceId
      this.form.systemInner = systemInner
      this.form.sourceValue = ''
      this.form.introducer = ''
      this.sourceName = settingsPatientSourceName
    },
    async getScrmStaffList() {
      const res = await patientAPI.getScrmStaffList()
      this.staffList = res.data
    },
    async getPatientTypeList() {
      const res = await patientAPI.getPatientTypeList()
      this.patientTypeList = res.data
      this.form.settingsTypeId = this.patientTypeList[0].settingsTypeId
    },
    async getSettingsPatientSourceList() {
      const res = await patientAPI.patientSource()
      this.settingsPatientSourceList = res.data || []
    },
    async getPatientContactLabel() {
      const res = await patientAPI.patientContactLabel()
      this.contactLabelList = res.data || []
    },
    async getPatientNationality() {
      const res = await patientAPI.patientNationality()
      this.patientNationalityList = res.data || []
    },
    async getPatientTags() {
      const res = await patientAPI.getPatientTags()
      uni.setStorageSync(
        'patientTagsList',
        res.data.filter((v) => v.tagInfoDTOList?.length > 0),
      )
      this.updateTagsCheckedText()
    },
    async getPatientMedicalRecordNo() {
      const res = await patientAPI.getPatientMedicalRecordNo({
        patientType: this.form.settingsTypeId,
      })
      this.form.medicalRecordNo = res.data
    },
    ageBlur(val) {
      if (val !== '') {
        this.form.birthday =
          Number(moment().weekYear()) - val + '-' + moment().format('MM-DD')
      } else {
        this.form.birthday = ''
      }
    },
    onSyncClick() {
      this.$utils.showLoading('刷新病例号中……')
      this.getPatientMedicalRecordNo()
      this.$utils.clearLoading()
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
        for (let key in this.oldForm) {
          if (
            JSON.stringify(this.form[key]) !== JSON.stringify(this.oldForm[key])
          ) {
            arr.push(key)
          }
        }
        this.changeKeys = arr.filter((value, index, self) => {
          return self.indexOf(value) === index
        })
        if (this.changeKeys.length) {
          this.changeKeys.forEach((item) => {
            if (
              item !== 'settingsTypeId' &&
              item !== 'tagIds' &&
              item !== 'region'
            ) {
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
.editPatientForm {
  .bt-68 {
    bottom: 68rpx !important;
  }
  .remark {
    background: #ffffff;
    width: 100vw;
    margin-bottom: 30rpx;
  }
  .title {
    font-size: 35rpx;
    color: #4c4c4c;
    line-height: 40rpx;
    padding-left: 32rpx;
    padding-top: 32rpx;
  }
  .txt {
    padding: 32rpx;
    width: 686rpx;
    overflow-y: scroll;
  }
}

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

.group {
  display: flex;
  align-items: center;
  flex-direction: row;
}

.dpms-cell-group {
  width: 750rpx;
  height: 112rpx;
  background: #fff;
  .dpms-cell {
    height: 112rpx;
    margin: 0 32rpx;
    border-bottom: 2rpx solid rgba(22, 18, 18, 0.15);
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

.icon-sync {
  position: absolute;
  left: 140rpx;
  font-size: 40rpx;
  color: #5cbb89;
  padding: 35rpx;
  z-index: 9;
}

.ensurebutton {
  height: 80rpx;
  background: #5cbb89;
  border-radius: 0;
  margin-top: 320rpx;
  color: #fff;
  line-height: 80rpx;
  position: fixed;
  bottom: 0;
  width: 750rpx;
  z-index: 9;
}

.bottomSpace {
  height: 68rpx;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 9;
}

.space {
  width: 100%;
  height: 16rpx;
  background: rgba(0, 0, 0, 0.04);
}
</style>
