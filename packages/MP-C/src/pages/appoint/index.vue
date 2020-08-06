<template>
  <div>
    <dpmsCell
      title="预约门店"
      placeholder="请选择门店"
      :value="institution.medicalInstitutionSimpleCode"
      isLink
    ></dpmsCell>
    <dpmsCell title="门店地址" placeholder="请选择地址" :value="institution.address" isLink />
    <dpmsCell
      title="预约医生"
      placeholder="请选择医生"
      :value="doctor.doctorName"
      isLink
      @cellclick="doctorPickerVisible = true"
    />
    <dpmsCellInput
      title="预约项目"
      isRequired
      inputType="picker"
      placeholder="请选择项目"
      mode="selector"
      isArrowRight
    ></dpmsCellInput>
    <dpmsCellInput
      title="预约日期"
      isRequired
      inputType="picker"
      placeholder="请选择日期"
      mode="date"
      isArrowRight
    ></dpmsCellInput>
    <dpmsCellInput title="预约备注" placeholder="请输入备注" inputType="text"></dpmsCellInput>
    <div class="agree">
      我已知悉并同意
      <a href>《预约服务协议》</a>
    </div>
    <button>确认预约</button>
    <dpmsBottomPicker :visible.sync="doctorPickerVisible">
      <div class="doctor" v-for="d in dockers" :key="d.doctorId" @click="dockerClick(d)">
        <image :src="d.doctorAvatarUrl" />
        <div class="info">
          <div class="name">{{d.doctorName}}</div>
          <div>擅长: {{d.goodAt}}</div>
        </div>
      </div>
    </dpmsBottomPicker>
  </div>
</template>

<script>
import { getStorage, STORAGE_KEY } from '@/utils/storage'
import appointAPI from '../../APIS/appoint/appoint.api'
export default {
  data() {
    return {
      institution: getStorage(STORAGE_KEY.MEDICALINSTITUTION),
      form: {},
      doctor: {},
      dockers: [],
      doctorPickerVisible: false,
    }
  },
  methods: {
    async getDoctors() {
      const res = await appointAPI.getDoctorList({
        medicalInstitutionId: this.institution.medicalInstitutionId,
      })
      this.dockers = res.data.doctorList
    },
    dockerClick(d) {
      this.doctor = d
      this.doctorPickerVisible = false
    },
  },
  created() {
    this.getDoctors()
  },
}
</script>

<style lang="scss">
.agree {
  color: rgba(153, 153, 153, 1);
  font-size: 24rpx;
  padding: 0 32rpx;
  line-height: 80rpx;
  display: flex;
  a {
    color: rgba(92, 187, 137, 1);
  }
}
button {
  width: 620rpx;
  height: 78rpx;
  line-height: 78rpx;
  background: #5cbb89;
  border-radius: 8rpx;
  font-size: 36rpx;
  font-weight: 400;
  text-align: center;
  color: #ffffff;
  margin-top: 40rpx;
}
.doctor {
  margin-bottom: 16rpx;
  border-radius: 8rpx;
  box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.09);
  display: flex;
  padding: 32rpx 24rpx;
  color: rgba(0, 0, 0, 0.5);
  font-size: 28rpx;
  line-height: 1.6;
  image {
    width: 120rpx;
    height: 120rpx;
    flex: none;
    margin-right: 32rpx;
    border-radius: 50%;
  }
  .name {
    color: rgba(0, 0, 0, 0.9);
    font-size: 34rpx;
    margin-bottom: 8rpx;
  }
}
</style>
