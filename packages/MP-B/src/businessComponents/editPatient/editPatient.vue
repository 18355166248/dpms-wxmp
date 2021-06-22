<template>
  <div class="editPatientForm">
    <dpmsForm ref="editPatientForm" :model="form" :rules="rules">
      <dpmsFormTitle title="基本信息" />
      <dpmsCellInput
        required
        title="姓名"
        placeholder="请输入姓名"
        v-model="form.patientName"
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
      <dpmsEnumsPicker
        v-if="requiredObj.gender && requiredObj.gender.enableShow"
        :required="requiredObj.gender && requiredObj.gender.enableMust"
        title="性别"
        placeholder="请选择性别"
        v-model="form.gender"
        enumsKey="Gender"
        isLink
        headerText="选择性别"
      />
      <view v-if="requiredObj.nickName && requiredObj.nickName.enableShow">
        <dpmsCellInput
          :required="requiredObj.nickName && requiredObj.nickName.enableMust"
          title="个性称呼"
          placeholder="请输入个性称呼"
          v-model="form.nickName"
        />
      </view>
      <view
        v-if="
          requiredObj.certificatesNo && requiredObj.certificatesNo.enableShow
        "
      >
        <dpmsCellInput
          :required="
            requiredObj.certificatesNo && requiredObj.certificatesNo.enableMust
          "
          type="idcard"
          title="身份证号"
          placeholder="请输入身份证号"
          v-model="form.certificatesNo"
        />
      </view>
      <dpmsTreePicker
        v-if="
          requiredObj.settingsPatientSourceId &&
          requiredObj.settingsPatientSourceId.enableShow
        "
        :required="
          requiredObj.settingsPatientSourceId &&
          requiredObj.settingsPatientSourceId.enableMust
        "
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
        v-if="
          sourceName === '朋友介绍' &&
          form.systemInner === 1 &&
          requiredObj.sourceValue &&
          requiredObj.sourceValue.enableShow
        "
        :required="
          requiredObj.sourceValue && requiredObj.sourceValue.enableMust
        "
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
        v-else-if="
          sourceName === '员工介绍' &&
          form.systemInner === 1 &&
          requiredObj.sourceValue &&
          requiredObj.sourceValue.enableShow
        "
        :required="
          requiredObj.sourceValue && requiredObj.sourceValue.enableMust
        "
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
        v-else-if="
          sourceName === '患者介绍' &&
          form.systemInner === 1 &&
          requiredObj.sourceValue &&
          requiredObj.sourceValue.enableShow
        "
        :required="
          requiredObj.sourceValue && requiredObj.sourceValue.enableMust
        "
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
      <view
        v-else-if="
          requiredObj.sourceValue && requiredObj.sourceValue.enableShow
        "
      >
        <dpmsCellInput
          :required="
            requiredObj.sourceValue && requiredObj.sourceValue.enableMust
          "
          title="介绍人"
          placeholder="请输入介绍人"
          v-model="form.introducer"
          max="20"
        />
      </view>
      <dpmsCellPicker
        v-if="requiredObj.nationality && requiredObj.nationality.enableShow"
        :required="
          requiredObj.nationality && requiredObj.nationality.enableMust
        "
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
      <view v-if="requiredObj.nickName && requiredObj.nickName.enableShow">
      </view>
      <view
        v-if="
          requiredObj.medicalInsuranceCardNo &&
          requiredObj.medicalInsuranceCardNo.enableShow
        "
      >
        <dpmsCellInput
          :required="
            requiredObj.medicalInsuranceCardNo &&
            requiredObj.medicalInsuranceCardNo.enableMust
          "
          title="医保卡号"
          placeholder="请输入医保卡号"
          v-model="form.medicalInsuranceCardNo"
        />
      </view>
      <dpmsDatePicker
        v-if="requiredObj.birthday && requiredObj.birthday.enableShow"
        :required="requiredObj.birthday && requiredObj.birthday.enableMust"
        title="出生日期"
        placeholder="请选择出生日期"
        v-model="form.birthday"
        :end="endDate"
        headerText="选择出生日期"
      />
      <view v-if="requiredObj.age && requiredObj.age.enableShow">
        <dpmsCellInput
          :required="requiredObj.age && requiredObj.age.enableMust"
          title="年龄"
          placeholder="请输入年龄"
          v-model="form.age"
          type="number"
          @blur="ageBlur"
        />
      </view>
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
        v-if="requiredObj.tagIds && requiredObj.tagIds.enableShow"
        :required="requiredObj.tagIds && requiredObj.tagIds.enableMust"
        title="患者标签"
        placeholder="请选择患者标签"
        :value="patientTagsCheckedText"
        isLink
        @click.native="onSelectTags"
      />
      <dpmsFormTitle
        title="联系方式"
        v-if="requiredObj.mobile && requiredObj.mobile.enableShow"
      />
      <view
        class="group"
        v-if="requiredObj.mobile && requiredObj.mobile.enableShow"
      >
        <view style="width: 375rpx;">
          <dpmsCellPicker
            :required="requiredObj.mobile && requiredObj.mobile.enableMust"
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
          <dpmsCellInput
            placeholder="请输入联系电话"
            v-model="form.mobile"
            :required="requiredObj.mobile && requiredObj.mobile.enableMust"
          />
        </view>
      </view>
      <view
        v-if="
          requiredObj.fixedTelephone && requiredObj.fixedTelephone.enableShow
        "
      >
        <dpmsCellInput
          :required="
            requiredObj.fixedTelephone && requiredObj.fixedTelephone.enableMust
          "
          title="固定电话"
          placeholder="请输入固定电话"
          v-model="form.fixedTelephone"
        />
      </view>
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
        v-if="requiredObj.region && requiredObj.region.enableShow"
        :required="requiredObj.region && requiredObj.region.enableMust"
        title="家庭住址"
        placeholder="请选择地区"
        v-model="form.region"
        headerText="选择地区"
      />
      <div
        class="dpms-cell-group dpms-cell-group-textarea"
        v-if="requiredObj.address && requiredObj.address.enableShow"
      >
        <div
          class="dpms-cell"
          :class="{
            'required-icon-a':
              requiredObj.address && requiredObj.address.enableMust,
          }"
          data-layout-align="space-between center"
        >
          <textarea
            style="height: 142rpx; width: 686rpx; margin-top: 30rpx;"
            placeholder-style="font-size: 34rpx;font-weight: 400;color: rgba(0, 0, 0, 0.25);"
            placeholder="请输入详细住址"
            maxlength="100"
            v-model="form.address"
          />
        </div>
      </div>
      <view
        class="space"
        v-if="requiredObj.memo && requiredObj.memo.enableShow"
      ></view>
      <div
        class="remark"
        :class="{ 'pb-68': isPhoneXCeil }"
        v-if="requiredObj.memo && requiredObj.memo.enableShow"
      >
        <view
          class="title"
          :class="{
            'required-icon': requiredObj.memo && requiredObj.memo.enableMust,
          }"
          >备注</view
        >
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
import { handleMustData } from '@/utils/mustData'

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
  memo: '',
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
      staffList: [],
      sourceName: '', //患者来源名称

      // 注意设置了type: 'any'再设置required无效
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
            message: '请输入个性称呼',
          },
          {
            max: 50,
            message: '个性称呼输入不应该超过 50 字',
          },
        ],
        medicalInsuranceCardNo: [
          {
            message: '请输入医保卡号',
          },
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
        birthday: [
          {
            message: '请选择出生日期',
          },
        ],
        age: [
          {
            message: '请输入年龄',
          },
          {
            pattern: /^(?:[0-9][0-9]?|1[01][0-9]|140)$/,
            message: '年龄不合法',
          },
        ],
        certificatesNo: [
          {
            message: '请输入身份证号',
          },
          {
            pattern: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
            message: '身份证号不合法',
          },
        ],
        contactLabel: [
          {
            type: 'any',
          },
        ],
        gender: [
          {
            message: '请选择性别',
          },
        ],
        nationality: [
          {
            message: '请选择国籍',
          },
        ],
        mobile: [
          {
            message: '请输入联系电话',
          },
          {
            // 手机号为1开头的11位数字
            pattern: /^1[0-9]{10}$/,
            message: '联系电话格式不正确',
          },
        ],
        fixedTelephone: [
          {
            message: '请输入固定电话',
          },
          {
            pattern: /^[^*][\d\-]{7,15}$/,
            message: '固定电话格式不正确',
          },
        ],
        alternateMobile: [
          {
            pattern: /^\d{11}$/,
            message: '备用号码格式不正确',
          },
        ],
        weChatId: [
          {
            pattern: /^[^*]{0,20}$/g,
            message: '请输入正确的微信号',
          },
        ],
        qqNum: [
          {
            pattern: /^[^*]\d{1,20}$/g,
            message: '请输入正确的QQ格式',
          },
        ],
        region: [
          {
            message: '请选择地区',
            // region的初始值是[undefined, undefined, undefined]
            validator: (rule, value, callback) => {
              if (!value.some((val) => val) && rule.required) {
                callback('请选择地区')
              } else {
                callback()
              }
            },
          },
        ],
        tagIds: [
          {
            message: '请选择患者标签',
            // tagIds的初始值是[]
            validator: (rule, value, callback) => {
              if (!value.some((val) => val) && rule.required) {
                callback('请选择患者标签')
              } else {
                callback()
              }
            },
          },
        ],
        address: [
          {
            pattern: /^[^*]{0,100}$/g,
            message: '请填写详细地址',
          },
        ],
        settingsPatientSourceId: [
          {
            message: '请选择患者来源',
          },
        ],
        sourceName: [
          {
            type: 'any',
          },
        ],
        sourceValue: [
          {
            message: '请输入介绍人',
          },
        ],
        memo: [
          {
            message: '请输入备注',
          },
        ],
        introducer: [
          {
            message: '请输入介绍人',
          },
          {
            max: 20,
            message: '介绍人输入不应该超过 20 字',
          },
        ],
        systemInner: [
          {
            type: 'any',
          },
        ], //不写validator的rules会变成undefiend，会报错
      },
      requiredObj: {},
      requiredArr: [],
    }
  },
  watch: {
    formData(newVal) {
      this.form = this.filterFormData(newVal)
    },
    'form.settingsTypeId'() {
      this.getPatientMedicalRecordNo()
      // 需要重新赋值 requiredObj
      this.changeMustData()
      this.getSettingsPatientSourceList()
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
    // 获取是否显示、必填数据
    this.getRequiredList()
  },
  beforeDestroy() {
    uni.$off('updateTagsCheckedList')
    uni.$off('onSourceValueSelected')
    uni.removeStorageSync('patientTagsList')
  },
  methods: {
    async getRequiredList() {
      this.requiredObj = handleMustData.initMustData()
      const getData = await patientAPI.getMustData()
      if (
        getData.code !== 0 ||
        !getData.data.createPatient_baseInfo ||
        !getData.data.createPatient_baseInfo.length
      ) {
        return
      }
      this.requiredArr = getData.data.createPatient_baseInfo
      // 获取数据，重新赋值
      const params = {
        obj: this.requiredObj,
        arr: getData.data.createPatient_baseInfo,
      }
      this.requiredObj = handleMustData.formatMustData(params)
      this.changeRules()
    },
    changeRules() {
      for (const keyA in this.requiredObj) {
        for (const keyB in this.rules) {
          if (keyA === keyB) {
            // 判断介绍人item，有两种情况，"sourceValue"以及"introducer"
            if (keyA === 'sourceValue') {
              this.sourceName === '员工介绍'
                ? (this.rules['sourceValue'][0].required = this.requiredObj[
                    keyA
                  ].enableMust)
                : (this.rules['introducer'][0].required = this.requiredObj[
                    keyA
                  ].enableMust)
            } else {
              this.rules[keyB][0].required = this.requiredObj[keyA].enableMust
            }
          }
        }
      }
    },
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
      // 此处为了兼容修改患者类型导致的列表不显示的问题
      this.settingsPatientSourceList = []
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
    changeMustData() {
      // 修改mustObj的对应enable属性
      const data = JSON.parse(JSON.stringify(this.requiredObj))
      for (const key in data) {
        this.requiredArr.forEach((val) => {
          if (Number(val[0].extend) === Number(this.form.settingsTypeId)) {
            val.forEach((valA) => {
              if (Number(valA.belongId) === Number(data[key].key) + 1) {
                data[key].enableMust = Boolean(valA.enableMust)
                data[key].enableShow = Boolean(valA.enableShow)
              }
            })
          }
        })
      }
      this.requiredObj = data
      this.changeRules()
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
    submit() {
      this.$dpmsUtils.formValidate(
        this.rules,
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
  margin-bottom: 80rpx;
  // 页面元素少的时候，整个页面没撑起来
  min-height: calc(100vh - 80rpx);
  background: #fff;
  .bt-68 {
    bottom: 68rpx !important;
  }
  .remark {
    background: #ffffff;
    width: 100vw;
  }
  .required-icon {
    &::after {
      content: '*';
      color: #eb4d4b;
    }
  }
  .required-icon-a {
    &::before {
      content: '*';
      color: #eb4d4b;
      position: absolute;
      left: 10rpx;
      top: 20rpx;
    }
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
    padding-top: 16rpx;
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
  position: relative;
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
  border-radius: 1;
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
