<template>
  <scroll-view scroll-y class="h100 page-bg">
    <dpmsForm ref="createPatientForm" :model="form" :rules="rules">
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
        title="用户画像"
        placeholder="请选择用户画像"
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
        type="number"
        title="联系电话"
        placeholder="请输入联系电话"
        v-model="form.mobile"
      />
      <dpmsCellInput
        type="number"
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
        type="number"
        title="QQ"
        placeholder="请输入QQ"
        v-model="form.qqNum"
      />
      <dpmsCellPicker
        mode="multiSelector"
        :list="allPlace"
        v-model="form.area"
        listKey="name"
        title="家庭住址"
        placeholder="请选择地区"
      />
      <div class="dpms-cell-group dpms-cell-group-textarea">
        <div class="dpms-cell" data-layout-align="space-between center">
          <textarea
            placeholder-style="font-size: 34rpx;font-weight: 400;color: rgba(0, 0, 0, 0.25);"
            placeholder="请输入详细住址"
            auto-height
            v-model="form.address"
          />
        </div>
      </div>
      <div class="pt-56 pb-82">
        <dpmsButton @click="submit" type="primary" />
        <!-- <dpmsButton @click="submit" text="取消" /> -->
      </div>
    </dpmsForm>
  </scroll-view>
</template>

<script>
import moment from 'moment'
import { getStorage, STORAGE_KEY } from '@/utils/storage'
import authAPI from '@/APIS/patient/patient.api'
import institutionAPI from '@/APIS/institution/institution.api'

export default {
  data() {
    return {
      allPlace: [], //省市区列表
      patientTypeList: [], //患者类型列表
      patientTagsCheckedText: '', //用户画像选中文本
      endDate: moment().format('YYYY-MM-DD'),
      index: 0,
      form: {
        patientName: '',
        gender: '',
        birthday: '',
        settingsTypeId: '',
        tagIds: [],
        contactLabel: '',
        mobile: '',
        alternateMobile: '',
        weChatId: '',
        qqNum: '',
        area: '',
        address: '',
      },
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
        contactLabel: {
          required: true,
          message: '请选择联系电话标签',
        },
        mobile: [
          {
            required: true,
            pattern: /^[0-9]*$/,
            message: '请输入联系电话',
          },
          {
            len: 11,
            message: '联系电话格式不正确',
          },
        ],
        alternateMobile: {
          pattern: /^[0-9]{11}$/,
          message: '备用号码格式不正确',
        },
        weChatId: {
          min: 0,
          max: 20,
          message: '请输入正确的微信号',
        },
        qqNum: {
          pattern: /^[0-9]{1,20}$/,
          message: '请输入正确的QQ格式',
        },
        address: {
          min: 0,
          max: 100,
          message: '详细地址输入不应该超过 100 字',
        },
      },
    }
  },
  created() {
    // 更新用户画像选中值
    uni.$on('updateTagsCheckedList', (checked) => {
      this.form.tagIds = checked

      this.updateTagsCheckedText()
    })
  },
  beforeDestroy() {
    uni.$off('updateTagsCheckedList')
    uni.removeStorageSync('patientTagsList')
  },
  onLoad() {
    let that = this
    institutionAPI.getAllPlace().then((res) => {
      that.allPlace = res.data
      // TODO：省市区展示
      console.log('---res0---', res)
    })
    authAPI.getPatientTypeList().then((res) => {
      that.patientTypeList = res.data
    })
    authAPI.getPatientTags().then((res) => {
      uni.setStorageSync(
        'patientTagsList',
        res.data.filter((v) => v.tagInfoDTOList.length > 0),
      )

      this.updateTagsCheckedText()
    })
  },
  methods: {
    bindDateChange: function (e) {
      this.patientData.date = e.detail.value
    },
    onSelectTags() {
      this.$utils.push({
        url: '/pages/personas/personas?checked=' + this.form.tagIds.join(','),
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
    // 检查患者是否已存在scrm系统中
    async checkPatientInScrm() {
      let { data: scrmPatientInfo } = await authAPI.getPatientInScrm({
        medicalInstitutionId: getStorage(STORAGE_KEY.STAFF)
          .belongsInstitutionId,
        mobile: this.form.mobile,
        patientName: this.form.patientName,
      })

      let that = this

      if (scrmPatientInfo.newCustomer) {
        //如果是新患者
        that.createPatient(scrmPatientInfo)
      } else {
        //如果患者已存在
        uni.showModal({
          content: 'SCRM中存在姓名和手机号相同的客户，是否关联',
          confirmText: '确认',
          success: function (res) {
            if (res.confirm) {
            } else if (res.cancel) {
              delete scrmPatientInfo.customerId
            }
            that.createPatient(scrmPatientInfo)
          },
        })
      }
    },
    async createPatient(scrmPatientInfo) {
      let patientContact = {
        contactLabel: this.form.contactLabel,
        mobile: this.form.mobile,
        alternateMobile: this.form.alternateMobile,
        weChatId: this.form.weChatId,
        qqNum: this.form.qqNum,
        area: this.form.area,
        address: this.form.address,
      }

      delete this.form.contactLabel
      delete this.form.alternateMobile
      delete this.form.weChatId
      delete this.form.qqNum
      delete this.form.area
      delete this.form.address

      authAPI
        .createPatient({
          ...this.form,
          ...scrmPatientInfo,
          patientContactStr: JSON.stringify([{ ...patientContact }]),
        })
        .then((res) => {
          //TODO：新建患者成功
        })
    },
    async submit() {
      this.$refs.createPatientForm.validate((err, fileds) => {
        if (err) {
          this.$utils.show(err[0]?.message)
          return
        }

        this.checkPatientInScrm()
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.page-bg {
  height: 100%;
  background: rgba(0, 0, 0, 0.04);
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
    textarea {
    }
  }
}
</style>
