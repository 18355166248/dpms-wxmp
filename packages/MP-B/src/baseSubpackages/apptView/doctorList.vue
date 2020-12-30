<template>
  <view class="doctorListWithPage">
    <dpmsCell
      v-if="isHeaderWithLargeArea"
      title="诊所"
      isLink
      :value="accessMedicalInstitution.medicalInstitutionSimpleCode"
      @click.native="openSelectMedicalInstitution"
    />
    <view class="pv-32 ph-24 selectDrawer">
      <view class="title mb-32 ml-8">医生</view>
      <div class="doctorList">
        <view
          :class="{
            doctorDetail: true,
            selected: doctorItem.staffId === apptViewdoctor.staffId,
          }"
          v-for="doctorItem in doctorList"
          :key="doctorItem.staffId"
          @click="onSelected(doctorItem)"
        >
          {{ doctorItem.staffName }}
        </view>
      </div>
    </view>

    <!-- 选择诊所弹窗 -->
    <selectMedicalInstitution
      ref="selectMedicalInstitution"
      @confirm="selectInstitution"
    ></selectMedicalInstitution>
  </view>
</template>

<script>
import { frontAuthUtil } from '@/utils/frontAuth.util'
import { globalEventKeys } from '@/config/global.eventKeys'
import appointmentAPI from 'APIS/appointment/appointment.api'

export default {
  data() {
    return {
      isHeaderWithLargeArea: frontAuthUtil.check(
        '预约中心/预约视图/诊所的查询条件',
      ),
      accessMedicalInstitution: uni.getStorageSync('accessMedicalInstitution'),
      doctorList: uni.getStorageSync('doctorList'),
      apptViewdoctor: uni.getStorageSync('apptViewdoctor'),
      institutionList: uni.getStorageSync('institutionList'),
      institutionCanSelectList: uni.getStorageSync('institutionCanSelectList'),
    }
  },
  onLoad() {
    console.log('institutionCanSelectList', this.institutionCanSelectList)
    uni.$on(globalEventKeys.updateDoctorListByPosition, (doctorList) => {
      this.doctorList = doctorList
    })
  },
  onUnload() {
    uni.$off(globalEventKeys.updateDoctorListByPosition)
  },
  methods: {
    // 打开选择诊所弹窗
    openSelectMedicalInstitution() {
      this.$refs.selectMedicalInstitution.show()
    },
    onSelected(doctor) {
      uni.setStorageSync(
        'accessMedicalInstitution',
        this.accessMedicalInstitution,
      )
      uni.setStorageSync('doctorList', this.doctorList)
      uni.setStorageSync('apptViewdoctor', this.apptViewdoctor)
      uni.$emit(globalEventKeys.onSelectedDcotorWithApptView, doctor)
    },
    // 总部/大区 筛选医生
    selectInstitution(value) {
      if (value.id === this.accessMedicalInstitution.medicalInstitutionId)
        return

      this.apptViewdoctor = {}

      this.accessMedicalInstitution = {
        medicalInstitutionSimpleCode: value.name,
        medicalInstitutionId: value.id,
      }

      // 获取在职医生列表
      uni.$emit(
        globalEventKeys.getDoctorListByPosition,
        this.accessMedicalInstitution,
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.doctorListWithPage {
  width: 100%;
  height: 100%;
  overflow: auot;
  background-color: #fff;
  .selectDrawer {
    .title {
      color: rgba($color: #000000, $alpha: 0.9);
      font-size: 34rpx;
    }
    .doctorList {
      .doctorDetail {
        margin: 0 8rpx 24rpx 8rpx;
        display: inline-block;
        border-radius: 2rpx;
        height: 68rpx;
        line-height: 68rpx;
        background: #f5f5f5;
        font-size: 28rpx;
        text-align: center;
        padding: 0 32rpx;
        &.selected {
          color: rgba(92, 187, 137, 1);
          background-color: rgba(227, 251, 238, 1);
          background: #e3fbee;
        }
      }
    }
  }
}
</style>
