<template>
  <view class="drawerPage">
    <uni-drawer ref="drawer" mode="left" :width="drawerWidth">
      <dpmsCell
        v-if="isHeaderWithLargeArea"
        title="诊所"
        isLink
        :value="accessMedicalInstitution.medicalInstitutionSimpleCode"
        @click.native="openSelectMedicalInstitution"
      />
      <scroll-view scroll-y :style="{ height: scrollViewHeight + 'px' }">
        <view style="padding: 0 32rpx;">
          <view class="title">按医生查看：</view>
          <view class="btnGroup">
            <view
              v-for="doctor in doctorOptions"
              :key="doctor.staffId"
              :class="{
                btn: true,
                btnActive: doctorActive(doctor),
                block: doctor.staffId === 'all',
              }"
              @click="onSelectDoctor(doctor)"
            >
              {{ doctor.staffName }}
            </view>
          </view>
          <template v-if="!isHeaderWithLargeArea">
            <view class="title">其他：</view>
            <view class="btnGroup">
              <view class="btn btnActive" @click="gotoUndeterminedList">
                {{ `待定预约(${undeterminedCount})` }}
              </view>
            </view>
          </template>
        </view>
      </scroll-view>
      <view class="btnConfirmContainer">
        <view class="btnConfirm btnActive" @click="confirm">确认</view>
      </view>
    </uni-drawer>
    <!-- 选择诊所弹窗 -->
    <selectMedicalInstitution
      ref="selectMedicalInstitution"
      @confirm="onSelectInstitution"
    ></selectMedicalInstitution>
  </view>
</template>

<script>
import { frontAuthUtil } from '@/utils/frontAuth.util'
import { globalEventKeys } from '@/config/global.eventKeys'
import { getDoctorListByInstitutionId } from './utils'
import appointmentAPI from 'APIS/appointment/appointment.api'
import _ from 'lodash'
import selectMedicalInstitution from './selectMedicalInstitution'

const ALL_DOCTOR_ITEM = { staffId: 'all', staffName: '所有医生' }
export default {
  components: {
    selectMedicalInstitution
  },
  data() {
    return {
      isHeaderWithLargeArea: frontAuthUtil.check(
        '预约中心/预约视图/诊所的查询条件',
      ),
      accessMedicalInstitution: null,
      doctorList: [], // 数据请求获取到的医生选项，不包含all
      selectedDoctorList: [],
      undeterminedCount: 0,
    }
  },
  computed: {
    drawerWidth() {
      return uni.upx2px(600)
    },
    scrollViewHeight() {
      const institutionSelectHeight = this.isHeaderWithLargeArea ? 112 : 0
      return (
        this.$systemInfo.windowHeight -
        uni.upx2px(institutionSelectHeight) -
        uni.upx2px(112) -
        20
      )
    },
    doctorOptions() {
      return [ALL_DOCTOR_ITEM].concat(this.doctorList)
    },
  },
  methods: {
    open() {
      this.accessMedicalInstitution = uni.getStorageSync(
        'accessMedicalInstitution',
      )
      this.doctorList = uni.getStorageSync('doctorList')
      this.selectedDoctorList = uni.getStorageSync('drawerSelectedDoctorList')
      this.$refs.drawer.open()
      this.getUndeterminedCount()
    },
    close() {
      this.$refs.drawer.close()
    },
    doctorActive(doctor) {
      const index = _.findIndex(this.selectedDoctorList, {
        staffId: doctor.staffId,
      })
      return index > -1
    },
    // 打开选择诊所弹窗
    openSelectMedicalInstitution() {
      this.$refs.selectMedicalInstitution.show()
    },
    // 切换诊所后更新医生
    onSelectInstitution(value) {
      if (value.id === this.accessMedicalInstitution.medicalInstitutionId) {
        return
      }

      this.accessMedicalInstitution = {
        medicalInstitutionSimpleCode: value.name,
        medicalInstitutionId: value.id,
      }
      this.reloadDoctorList()
    },
    onSelectDoctor(doctor) {
      // 如果当前选择所有医生，清除其他所有
      if (doctor.staffId === 'all') {
        this.selectedDoctorList = [ALL_DOCTOR_ITEM]
        return
      }

      // 如果之前是选择的所有医生
      const preSelectAll =
        this.selectedDoctorList.length === 1 &&
        this.selectedDoctorList[0].staffId === 'all'
      if (preSelectAll) {
        this.selectedDoctorList = []
        this.selectedDoctorList = [doctor]
        return
      }

      if (this.doctorActive(doctor)) {
        // 如果医生已被选中，则清除
        const index = this.selectedDoctorList.findIndex(
          (d) => d.staffId === doctor.staffId,
        )
        this.selectedDoctorList.splice(index, 1)

        // 如果最后一个医生被清除，则选择全部
        if (this.selectedDoctorList.length === 0) {
          this.selectedDoctorList = [ALL_DOCTOR_ITEM]
        }
      } else {
        this.selectedDoctorList.push(doctor)
      }
    },
    confirm() {
      uni.$emit(globalEventKeys.onSelectApptViewDoctor,  {
        selectedDoctorList: this.selectedDoctorList,
        doctorList: this.doctorList,
        accessMedicalInstitution: this.accessMedicalInstitution
      })
      this.close()
    },
    async reloadDoctorList() {
      const res = await getDoctorListByInstitutionId(
        this.accessMedicalInstitution.medicalInstitutionId,
      )
      this.doctorList = res.data
      this.selectedDoctorList = [ALL_DOCTOR_ITEM]
    },
    gotoUndeterminedList() {
      this.$dpmsUtils.push({ url: '/baseSubpackages/apptView/undeterminedList' })
      this.close()
    },
    getUndeterminedCount() {
      appointmentAPI
        .getUndeterminedAppointmentCount()
        .then((res) => (this.undeterminedCount = res.data))
    },
  },
}
</script>

<style lang="scss" scoped>
$primary-color: #5cbb89;
.drawerPage {
  .title {
    font-size: 36rpx;
    margin-top: 32rpx;
    margin-bottom: 16rpx;
  }
  .btnGroup {
    margin: 0 -8rpx;
  }
  .btn {
    display: inline-block;
    width: 256rpx;
    height: 68rpx;
    line-height: 68rpx;
    border: 1rpx solid $primary-color;
    color: $primary-color;
    background: #ffffff;
    border-radius: 8rpx;
    text-align: center;
    font-size: 28rpx;
    margin: 8rpx;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .block {
    display: block;
  }

  .btnActive {
    background: $primary-color;
    color: #ffffff;
  }

  .btnConfirmContainer {
    position: fixed;
    bottom: 0;
    box-sizing: border-box;
    width: 100%;
    padding: 16rpx 32rpx;
  }

  .btnConfirm {
    height: 80rpx;
    font-size: 36rpx;
    border-radius: 80rpx;
    text-align: center;
    line-height: 80rpx;
  }
}
</style>
