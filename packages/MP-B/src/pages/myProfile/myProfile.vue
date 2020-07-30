<template>
  <div class="page-bg">
    <dpmsForm ref="myProfileForm" :model="form" :rules="rules">
      <dpmsCellInput
        required
        title="姓名"
        placeholder="请输入姓名"
        v-model="form.staffName"
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
      <dpmsCellPicker
        title="出生日期"
        placeholder="请选择出生日期"
        v-model="form.birthdayStamp"
        mode="date"
        :end="endDate"
        headerText="选择出生日期"
      />
      <dpmsCellInput
        required
        title="手机号"
        placeholder="请输入手机号"
        v-model="form.mobile"
      />
      <dpmsEnumsPicker
        required
        title="岗位"
        placeholder="请选择岗位"
        v-model="form.position"
        enumsKey="StaffPosition"
        isLink
        headerText="选择岗位"
      />
    </dpmsForm>

    <div class="mt-56">
      <dpmsButton @click="saveMyProfile" text="保存" />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { getStorage, STORAGE_KEY } from '@/utils/storage'
import institutionAPI from '@/APIS/institution/institution.api'

export default {
  data() {
    return {
      form: {},
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
    }
  },
  methods: {
    saveMyProfile() {
      this.$refs.myProfileForm.validate((err, fileds) => {
        delete this.form.belongsMedicalInstitutionDTO
        delete this.form.workMedicalInstitutionList
        delete this.form.birthday
        if (err) {
          this.show(err[0]?.message)
          return
        }
        //成功执行
        institutionAPI
          .updateStaff({
            ...this.form,
            birthdayStamp: moment(this.form.birthdayStamp).valueOf(),
          })
          .then((res) => {
            //TODO：成功
          })
      })
    },
    onLoad() {
      let that = this
      institutionAPI
        .getStaffDetail({
          staffId: getStorage(STORAGE_KEY.STAFF).staffId,
        })
        .then((res) => {
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
