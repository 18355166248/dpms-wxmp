<template>
  <view class="drawerPage">
    <uni-drawer ref="drawer" mode="left" :width="300">
      <dpmsCell
        v-if="isHeaderWithLargeArea"
        title="诊所"
        isLink
        :value="accessMedicalInstitution.medicalInstitutionSimpleCode"
        @click.native="openSelectMedicalInstitution"
      />
      <scroll-view scroll-y style="height: calc(100% - 155px);">
        <view class="p-16">
          <view class="title">按医生查看：</view>
          <view class="btnGroup">
            <view
              v-for="doctor in doctorSelectList"
              :key="doctor.staffId"
              :class="{
                btn: true,
                btnActive: doctor.staffId === apptViewDoctor.staffId,
                block: doctor.staffId === 'all',
              }"
              @click="onSelectDoctor(doctor)"
            >
              {{ doctor.staffName }}
            </view>
          </view>
          <view class="title">其他：</view>
          <view class="btnGroup">
            <view class="btn btnActive">
              待定预约
            </view>
          </view>
        </view>
      </scroll-view>
      <view class="btnConfirm btnActive" @click="confirm">确认</view>
    </uni-drawer>
    <!-- 选择诊所弹窗 -->
    <selectMedicalInstitution
      ref="selectMedicalInstitution"
      @confirm="onSelectInstitution"
      :medicalInstitutionType="2"
    ></selectMedicalInstitution>
  </view>
</template>

<script>
import { frontAuthUtil } from '@/utils/frontAuth.util'
import { globalEventKeys } from '@/config/global.eventKeys'
import { getDoctorListByInstitutionId } from './utils'

const ALL_DOCTOR_ITEM = { staffId: 'all', staffName: '所有医生' }
export default {
  data() {
    return {
      isHeaderWithLargeArea: frontAuthUtil.check(
        '预约中心/预约视图/诊所的查询条件',
      ),
      accessMedicalInstitution: null,
      doctorList: [],
      apptViewDoctor: null,
    }
  },
  computed: {
    // 显示供选择的医生，需在原有基础上加上所有医生
    doctorSelectList() {
      return [ALL_DOCTOR_ITEM].concat(this.doctorList)
    },
  },
  methods: {
    open() {
      this.accessMedicalInstitution = uni.getStorageSync(
        'accessMedicalInstitution',
      )
      this.doctorList = uni.getStorageSync('doctorList')
      this.apptViewDoctor = uni.getStorageSync('apptViewDoctor')
      this.$refs.drawer.open()
    },
    close() {
      this.$refs.drawer.close()
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

      this.apptViewDoctor = {}
      this.accessMedicalInstitution = {
        medicalInstitutionSimpleCode: value.name,
        medicalInstitutionId: value.id,
      }
      this.reloadDoctorList()
    },
    onSelectDoctor(doctor) {
      this.apptViewDoctor = doctor
    },
    confirm() {
      uni.setStorageSync(
        'accessMedicalInstitution',
        this.accessMedicalInstitution,
      )
      uni.setStorageSync('doctorList', this.doctorList)
      uni.$emit(globalEventKeys.onSelectApptViewDoctor, this.apptViewDoctor)
      this.close()
    },
    async reloadDoctorList() {
      const res = await getDoctorListByInstitutionId(
        this.accessMedicalInstitution.medicalInstitutionId,
      )
      this.doctorList = res.data
      this.apptViewDoctor = ALL_DOCTOR_ITEM
    },
  },
}
</script>

<style lang="scss" scoped>
$primary-color: #5cbb89;
.drawerPage {
  .title {
    margin-top: 16px;
    margin-bottom: 8px;
  }
  .btnGroup {
    margin: 0 -4px;
  }
  .btn {
    display: inline-block;
    width: 130px;
    height: 34px;
    line-height: 34px;
    border: 1px solid $primary-color;
    color: $primary-color;
    background: #ffffff;
    border-radius: 4px;
    text-align: center;
    font-size: 14px;
    margin: 5px;
  }
  .block {
    display: block;
  }

  .btnActive {
    background: $primary-color;
    color: #ffffff;
  }

  .btnConfirm {
    position: fixed;
    width: 269px;
    height: 40px;
    bottom: 42px;
    font-size: 18px;
    border-radius: 20px;
    margin: auto 0;
    text-align: center;
    line-height: 40px;
  }
}
</style>
