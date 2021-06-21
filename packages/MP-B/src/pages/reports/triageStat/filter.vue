<template>
  <div class="rpt_filter">
    <dpmsCellInput
      title="患者信息"
      placeholder="请输入 患者姓名/联系电话 模糊查询"
      v-model="searchKey"
      :max="50"
    />
    <dpmsCellPicker
      title="分诊咨询师"
      placeholder="请选择分诊咨询师"
      v-model="triageConsultedStaffId"
      :list="consultantList"
      defaultType="staffId"
      :defaultProps="{ label: 'staffName', value: 'staffId' }"
      isLink
    />
    <dpmsCellPicker
      title="医生"
      placeholder="请选择医生"
      v-model="doctorStaffId"
      :list="doctorList"
      defaultType="staffId"
      :defaultProps="{ label: 'staffName', value: 'staffId' }"
      isLink
    />
    <dpmsCellPicker
      title="科室"
      placeholder="请选择科室"
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
      consultantList: [],
      departmentList: [],

      // 医生id
      doctorStaffId: '',
      // 科室id
      institutionDepartmentId: '',
      // 分诊咨询师id
      triageConsultedStaffId: '',
      searchKey: '',
    }
  },
  onLoad({
    searchKey,
    doctorStaffId,
    institutionDepartmentId,
    triageConsultedStaffId,
  }) {
    this.searchKey = searchKey
    this.doctorStaffId = +doctorStaffId
    this.institutionDepartmentId = +institutionDepartmentId
    this.triageConsultedStaffId = +triageConsultedStaffId

    this.doctorList = uni.getStorageSync('triageDoctorList')
    this.consultantList = uni.getStorageSync('triageConsultantList')
    this.departmentList = uni.getStorageSync('triageDepartmentList')
  },
  methods: {
    onSave() {
      uni.$emit('rptTriageFilter', {
        searchKey: this.searchKey,
        doctorStaffId: this.doctorStaffId,
        institutionDepartmentId: this.institutionDepartmentId,
        triageConsultedStaffId: this.triageConsultedStaffId,
      })
      this.$dpmsUtils.back()
    },
    onReset() {
      this.searchKey = ''
      this.doctorStaffId = ''
      this.institutionDepartmentId = ''
      this.triageConsultedStaffId = ''

      // 重置筛选结果
      uni.$emit('rptTriageFilter', {
        searchKey: '',
        doctorStaffId: '',
        institutionDepartmentId: '',
        triageConsultedStaffId: '',
      })
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
