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
      <dpmsDatePicker
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

    <div class="pt-56 pb-82">
      <dpmsButton
        @click="saveMyProfile"
        type="primary"
        :disabled="isLoading"
        :loading="isLoading"
      />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
import institutionAPI from '@/APIS/institution/institution.api'

const formData = {
  staffId: '',
  photoUrl: '',
  username: '',
  staffName: '',
  mobile: '',
  gender: '',
  jobNo: '',
  position: '',
  departmentId: '',
  workStatus: '',
  belongsInstitutionId: '',
  workMedicalInstitutionIds: '',
  roleIds: '',
  birthdayStamp: '',
}

export default {
  data() {
    return {
      form: formData,
      isLoading: false,
      rules: {
        staffName: [
          {
            required: true,
            message: '请输入姓名',
          },
          {
            min: 1,
            max: 20,
            message: '姓名输入不应该超过 20 字',
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
  computed: {
    ...mapState('workbenchStore', ['staff']),
  },
  created() {
    // 初始化form
    let form = JSON.parse(JSON.stringify(this.staff, Object.keys(formData)))
    form.birthdayStamp = moment(form.birthdayStamp).format('YYYY-MM-DD')
    console.log('form', form)
    this.form = form
  },
  methods: {
    saveMyProfile() {
      this.$refs.myProfileForm.validate((err, fileds) => {
        if (err) {
          this.$utils.show(err[0].message)
          return
        }
        this.isLoading = true
        //成功执行
        institutionAPI
          .updateStaff({
            ...this.form,
            birthdayStamp: moment(this.form.birthdayStamp).valueOf(),
          })
          .then((res) => {
            this.$store.commit('workbenchStore/setStaff', {
              ...this.staff,
              ...this.form,
            })
            let that = this
            this.$utils.show('修改成功', {
              duration: 1000,
              complete() {
                setTimeout(() => {
                  that.$utils.back()
                }, 1000)
              },
            })
          })
          .catch(() => {
            this.isLoading = false
          })
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
