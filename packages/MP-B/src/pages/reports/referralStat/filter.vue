<template>
  <div class="rpt_filter">
    <dpmsCellInput
      title="患者信息"
      placeholder="请输入 患者姓名/联系电话 模糊查询"
      v-model="searchKey"
      :max="50"
    />
    <dpmsCellPicker
      title="转出医生"
      placeholder="请选择转出医生"
      v-model="oldDoctorStaffId"
      :list="doctorList"
      defaultType="staffId"
      :defaultProps="{ label: 'staffName', value: 'staffId' }"
      isLink
    />
    <dpmsCellPicker
      title="转出科室"
      placeholder="请选择转出科室"
      v-model="oldInstitutionDepartmentId"
      :list="departmentList"
      defaultType="institutionDepartmentId"
      :defaultProps="{ label: 'name', value: 'institutionDepartmentId' }"
      isLink
    />
    <dpmsCellPicker
      title="转入医生"
      placeholder="请选择转入医生"
      v-model="doctorStaffId"
      :list="doctorList"
      defaultType="staffId"
      :defaultProps="{ label: 'staffName', value: 'staffId' }"
      isLink
    />
    <dpmsCellPicker
      title="转入科室"
      placeholder="请选择转入科室"
      v-model="institutionDepartmentId"
      :list="departmentList"
      defaultType="institutionDepartmentId"
      :defaultProps="{ label: 'name', value: 'institutionDepartmentId' }"
      isLink
    />

    <button class="ensurebutton" @click="onSave" :disabled="disabled">
      查询
    </button>
    <button class="cancelbutton" @click="onReset" :disabled="disabled">
      重置
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      disabled: false,

      doctorList: [],
      departmentList: [],

      // 转入医生id
      doctorStaffId: '',
      // 转入科室id
      institutionDepartmentId: '',
      // 转出医生id
      oldDoctorStaffId: '',
      // 转出科室id
      oldInstitutionDepartmentId: '',
      searchKey: '',
    }
  },
  onLoad({
    searchKey,
    doctorStaffId,
    institutionDepartmentId,
    oldDoctorStaffId,
    oldInstitutionDepartmentId,
  }) {
    this.searchKey = searchKey
    this.doctorStaffId = +doctorStaffId
    this.institutionDepartmentId = +institutionDepartmentId
    this.oldDoctorStaffId = +oldDoctorStaffId
    this.oldInstitutionDepartmentId = +oldInstitutionDepartmentId

    this.doctorList = uni.getStorageSync('referralDoctorList')
    this.departmentList = uni.getStorageSync('referralDepartmentList')
  },
  methods: {
    onSave() {
      uni.$emit('rptReferralFilter', {
        searchKey: this.searchKey,
        doctorStaffId: this.doctorStaffId,
        institutionDepartmentId: this.institutionDepartmentId,
        oldDoctorStaffId: this.oldDoctorStaffId,
        oldInstitutionDepartmentId: this.oldInstitutionDepartmentId,
      })
      this.$utils.back()
    },
    onReset() {
      this.searchKey = ''
      this.doctorStaffId = ''
      this.institutionDepartmentId = ''
      this.oldDoctorStaffId = ''
      this.oldInstitutionDepartmentId = ''
    },
  },
}
</script>

<style lang="scss" scoped>
.rpt_filter {
  width: 100vw;
  .ensurebutton {
    height: 80rpx;
    background: #5cbb89;
    border-radius: 40rpx;
    margin-top: 320rpx;
    width: 686rpx;
    color: #fff;
    line-height: 80rpx;
  }
  .cancelbutton {
    margin-top: 32rpx;
    height: 80rpx;
    color: #5cbb89;
    border-radius: 40rpx;
    width: 686rpx;
    background: #fff;
    line-height: 80rpx;
    border: 2rpx solid #5cbb89;
  }
}
</style>
