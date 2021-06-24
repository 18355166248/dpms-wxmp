<template>
  <div class="finance_filter">
    <dpmsCellInput
      title="患者信息"
      v-if="showItem('patientInfo')"
      :value="patientInfo"
      @input="setPatientInfo"
      placeholder="请输入患者姓名/联系电话模糊查询"
    />
    <dpmsCellInput
      title="单据号"
      v-if="showItem('billOrderNo')"
      :value="billOrderNo"
      @input="setBillOrderNo"
      placeholder="请输入单据号"
    />
    <dpmsCell
      title="项目"
      v-if="showItem('parentChargeTypeIds')"
      :value="parentChargeType.parentChargeTypeNames"
      isLink
      @click.native="onProjectClick"
      placeholder="请选择项目"
    />
    <dpmsCell
      title="医生"
      v-if="showItem('doctorIds')"
      :value="doctor.doctorNames"
      isLink
      @click.native="onStaffClick('doctor')"
      placeholder="请选择医生"
    />
    <dpmsCell
      title="咨询师"
      v-if="showItem('consultantIds')"
      :value="consultant.consultantNames"
      isLink
      @click.native="onStaffClick('consultant')"
      placeholder="请选择咨询师"
    />
    <button class="ensurebutton" @click="onSave">
      查询
    </button>
    <button class="cancelbutton" @click="onReset">
      重置
    </button>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'filter',
  data() {
    return {
      filtersList: [],
    }
  },
  onLoad(options) {
    const { filter } = options
    this.filtersList = JSON.parse(filter)
    console.log(this.patientInfo)
  },
  computed: {
    ...mapState('finaceReport', [
      'parentChargeType',
      'doctor',
      'consultant',
      'patientInfo',
      'billOrderNo',
    ]),
  },
  methods: {
    ...mapMutations('finaceReport', [
      'setBillOrderNo',
      'setPatientInfo',
      'clearState',
    ]),
    onStaffClick(name) {
      this.$dpmsUtils.push({
        url: `/pages/finance-report/staffList?name=${name}`,
      })
    },
    onProjectClick() {
      this.$dpmsUtils.push({
        url: '/pages/finance-report/projectList',
      })
    },
    showItem(str) {
      return this.filtersList.includes(str)
    },
    onSave() {
      uni.$emit('finFilter', 'filter')
      this.$dpmsUtils.back()
    },
    onReset() {
      this.clearState()
      uni.$emit('finFilter', 'empty')
      this.$dpmsUtils.back()
    },
  },
}
</script>

<style lang="scss" scoped>
.finance_filter {
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
