<template>
  <view class="content">
    <scroll-view v-if="dataSource.length > 0" class="h100" scroll-y>
      <view class="ph-24 pb-32">
        <apptCard
          v-for="apptInfo in dataSource"
          :key="apptInfo.appointmentId"
          :appt="apptInfo"
          :isVisType="false"
          :doctor="getDoctor(apptInfo.appointmentResourceMap.STAFF)"
        />
      </view>
    </scroll-view>
    <template v-else>
      <empty :disabled="true" text="暂无预约数据"></empty>
    </template>
    <fixed-footer :bgColor="primaryColor">
      <button
        class="button-new"
        @click="
          toPage('/baseSubpackages/apptForm/apptForm', {
            type: 'createAppt',
            patientId,
          })
        "
      >
        新建预约
      </button>
    </fixed-footer>
  </view>
</template>

<script>
import moment from 'moment'
import qs from 'qs'
import patientAPI from '@/APIS/patient/patient.api'
import apptCard from '@/businessComponents/apptCard/apptCard.vue'
import empty from '@/components/empty/empty.vue'
import { mapState } from 'vuex'
import { checkQwInstitution } from '@/utils/utils'

export default {
  data() {
    return {
      patientId: '',
      primaryColor: this.$commonCss.commonColor,
      patient: {},
      dataSource: [],
      INSTITUTION_CHAIN_TYPE_ENUM: this.$dpmsUtils.getEnums(
        'InstitutionChainType',
      ),
    }
  },
  onShow() {
    this.init()
  },
  onLoad(params) {
    checkQwInstitution()
    this.patientId = params.patientId
  },
  onReady() {
    this.init()
  },

  methods: {
    // 页面跳转
    toPage(url, params) {
      this.$dpmsUtils.push({
        url: `${url}?${qs.stringify(params, {
          arrayFormat: 'comma', // a: [1, 2] => a=1,2
        })}`,
      })
    },

    async init() {
      this.$dpmsUtils.showLoading()
      await this.getPatient()
      await this.loadData()
      this.$dpmsUtils.clearLoading()
    },
    // 获取列表数据
    async loadData() {
      const { data } = await patientAPI.getApptList({
        patientId: this.patientId,
      })
      this.dataSource = [
        ...data.afterList,
        ...data.beforeList,
        ...data.currentList,
      ]

      this.dataSource = this.dataSource.map((v) => ({
        patient: this.patient,
        ...v,
      }))
    },
    // 获取患者信息
    async getPatient() {
      const { data } = await patientAPI.getPatientDetail({
        patientId: this.patientId,
      })
      this.patient = data
    },
    getDoctor(val) {
      let doctor = val.filter((v) => v.position === 2 && v.staffId !== -1)[0]
      return doctor ? doctor : { staffName: '未指定医生' }
    },
  },
  computed: {
    ...mapState('workbenchStore', ['medicalInstitution', 'staff']),
    institutionChainTypeKey() {
      if (this.INSTITUTION_CHAIN_TYPE_ENUM && this.medicalInstitution) {
        if (
          this.INSTITUTION_CHAIN_TYPE_ENUM.properties &&
          this.medicalInstitution.institutionChainType
        ) {
          return this.INSTITUTION_CHAIN_TYPE_ENUM.properties[
            this.medicalInstitution.institutionChainType
          ].key
        }
      }
    },
  },
  components: {
    apptCard,
    empty,
  },
}
</script>

<style lang="scss" scoped>
.content {
  padding-top: 32rpx;
  .button-new {
    width: 100%;
    height: 90rpx;
    line-height: 90rpx;
    text-align: center;
    font-size: 36rpx;
    background-color: $dpms-color-primary;
    color: #fff;
    border-radius: 0;

    &::after {
      border: none;
    }
  }
}
</style>
