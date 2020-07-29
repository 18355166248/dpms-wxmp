<template>
  <div class="page-bg">
    <dpmsForm ref="myProfileForm" :model="form" :rules="rules">
      <dpmsCellInput
        required
        title="姓名"
        placeholder="请输入姓名"
        v-model="form.staffName"
      />
      <dpmsCellPicker
        required
        title="性别"
        placeholder="请选择性别"
        v-model="form.gender"
        :list="GENDER_ENUMS"
        rangeType="enums"
        listKey="gender"
        isLink
      />
      <dpmsCellPicker
        title="出生日期"
        placeholder="请选择出生日期"
        v-model="form.birthdayStamp"
        mode="date"
        :end="endDate"
      />
      <dpmsCellInput
        required
        title="手机号"
        placeholder="请输入手机号"
        v-model="form.mobile"
      />
      <dpmsCellPicker
        required
        title="岗位"
        placeholder="请选择岗位"
        v-model="form.position"
        :list="POSITION_ENUMS"
        listKey="job"
        isLink
      />
    </dpmsForm>

    <div class="mt-56">
      <formButton @click="saveMyProfile"></formButton>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import AsyncValidator from 'async-validator'
import { CCEnumUtil } from '@arctic/tools/es'
import { getStorage, STORAGE_KEY } from '@/utils/storage'
import institutionAPI from '@/APIS/institution/institution.api'
import formButton from '../../components/formButton/formButton'

console.log(moment().format('YYYY-MM-DD'))

export default {
  data() {
    return {
      form: {
        staffName: '',
        gender: '',
        birthdayStamp: '',
        mobile: '',
        position: '',
      },
      rules: {
        staffName: [
          {
            required: true,
            message: '请输入姓名',
          },
          {
            min: 1,
            max: 30,
            message: '姓名输入不应该超过 30 字',
          },
        ],
        gender: {
          required: true,
          message: '请选择性别',
        },
        mobile: {
          required: true,
          message: '请输入手机号',
        },
        position: {
          required: true,
          message: '请选择岗位',
        },
      },
      endDate: moment().format('YYYY-MM-DD'),
      GENDER_ENUMS: [],
      POSITION_ENUMS: [],
    }
  },
  components: {
    formButton,
  },
  methods: {
    saveMyProfile() {
      this.$refs.myProfileForm.validate((err, fileds) => {
        // console.log(err, '*******', fileds)
        // console.log('&&&', this.form)
        delete this.form.belongsMedicalInstitutionDTO
        delete this.form.workMedicalInstitutionList
        if (err) {
          this.show(err[0]?.message)
          return
        }
        //成功执行
        institutionAPI
          .updateStaff({
            ...this.form,
          })
          .then((res) => {
            //TODO：成功
          })
      })
    },
    onLoad() {
      this.GENDER_ENUMS = getStorage(STORAGE_KEY.ENUMS)?.Gender || {}
      this.POSITION_ENUMS = getStorage(STORAGE_KEY.ENUMS).StaffPosition || {}

      //TODO： 枚举值方法调用传值
      const GENDER_ENUM = CCEnumUtil.create(
        getStorage(STORAGE_KEY.ENUMS)?.Gender || {},
      )
      console.log('----', Object.values(GENDER_ENUM.properties))

      let that = this
      institutionAPI
        .getStaffDetail({
          staffId: getStorage(STORAGE_KEY.STAFF).staffId,
        })
        .then((res) => {
          //成功
          that.form = res.data
          this.form.birthdayStamp = moment(res.data.birthdayStamp).format(
            'YYYY-MM-DD',
          )
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
</style>
