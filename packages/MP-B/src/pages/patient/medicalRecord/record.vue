<template>
  <div>
    <scroll-view
      class="records"
      v-if="records.length"
      scroll-y
      @scrolltolower="getMedicalRecordList"
    >
      <div
        class="record"
        v-for="r in records"
        :key="r.medicalRecordId"
        @click="toDetail(r)"
      >
        <div class="head">
          <div class="head-memo">
            <div class="iconfont icon-time-circle"></div>
            {{ r.visTimeFormated }}
          </div>
          <div>
            {{
              ['', '草稿', '审核中', '审核通过', '审核不通过'][
                r.approveStatus
              ] || ''
            }}
          </div>
        </div>
        <div class="row">
          就诊信息：<span class="content"
            >{{ r.visTimeFormated }} {{ r.medicalInstitutionSimpleCode }}</span
          >
        </div>
        <div class="row">
          发起人：<span class="content">{{ r.createStaffName }}</span>
        </div>
        <div class="row">
          医生：<span class="content">{{ r.doctorStaffName }}</span>
        </div>
        <div class="row">
          就诊类型：<span class="content">{{ r.visText }}</span>
        </div>
        <div class="row">
          主诉：<span class="content">{{ r.mainComplaint }}</span>
        </div>
        <div class="row">
          备注：<span class="content">{{ r.approveRemark }}</span>
        </div>
      </div>
    </scroll-view>
    <empty :disabled="true" text="无病历记录" v-else />
    <fixed-footer bgColor="#F5F5F5" v-if="btnPremisstion('new-medical-record')">
      <div class="bottom">
        <button
          @click="
            $dpmsUtils.push({
              url: `/pages/patient/medicalRecord/create?patientId=${patientId}`,
            })
          "
        >
          新建病历
        </button>
      </div>
    </fixed-footer>
  </div>
</template>

<script>
import diagnosisAPI from '@/APIS/diagnosis/diagnosis.api.js'
import moment from 'moment'
import fixedFooter from '@/components/fixed-footer/fixed-footer.vue'
import { mapMutations } from 'vuex'
import login from '@/pages/login/login'

export default {
  components: { fixedFooter },
  data() {
    return {
      records: [],
      primaryColor: this.$commonCss.commonColor,
      VIS_TYPE_ENUM: this.$dpmsUtils.getEnums('VisType'),
    }
  },
  methods: {
    ...mapMutations('medicalRecord', ['setMedicalRecordObj']),
    async getMedicalRecordList() {
      if (this.total && this.total <= (this.current - 1) * 10)
        return this.$dpmsUtils.show('没有更多了')
      this.$dpmsUtils.showLoading('加载中...')
      const res = await diagnosisAPI.getMedicalRecordList({
        patientId: this.patientId,
        current: this.current,
      })
      this.$dpmsUtils.clearLoading()
      ++this.current
      this.total = res.data.total
      this.records = [
        ...this.records,
        ...res.data.records.map((r) => ({
          ...r,
          visTimeFormated: moment(r.visTime).format('YYYY-MM-DD HH:mm'),
          createTimeFormated: moment(r.createTime).format('YYYY-MM-DD HH:mm'),
          visText: r.visTypeName,
        })),
      ]
    },
    toDetail({
      medicalRecordId,
      canEdit = '',
      revoke = '',
      canApprove = '',
      reEditable = '',
    }) {
      console.log(medicalRecordId)
      this.$dpmsUtils.push({
        url: `/pages/patient/medicalRecord/detail?medicalRecordId=${medicalRecordId}&patientId=${this.patientId}&canEdit=${canEdit}&revoke=${revoke}&canApprove=${canApprove}&reEditable=${reEditable}`,
      })
    },
    onUpdate() {
      uni.$off('medicalRecordListUpdate')
      uni.$on('medicalRecordListUpdate', () => {
        this.current = 1
        this.total = 0
        this.records = []
        this.getMedicalRecordList()
      })
    },
  },
  onLoad({ patientId }) {
    this.patientId = patientId
    this.current = 1
    this.getMedicalRecordList()
    this.onUpdate()
    this.setMedicalRecordObj(null)
  },
}
</script>

<style lang="scss" scoped>
.records {
  padding: 32rpx 32rpx 0 32rpx;
  height: calc(100vh - 90rpx);
  box-sizing: border-box;
}

.record {
  background: #ffffff;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: rgba(0, 0, 0, 0.9);
  padding: 0 24rpx 16rpx;
  margin-bottom: 25rpx;

  .head {
    height: 84rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: solid 1rpx rgba(0, 0, 0, 0.1);
    margin-bottom: 16rpx;
    white-space: nowrap;

    .head-memo {
      display: flex;
      align-items: center;
    }

    .icon-time-circle {
      margin-right: 10rpx;
    }
  }

  .row {
    line-height: 1.9;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    .content {
      color: rgba(0, 0, 0, 0.7);
    }
  }
}

.bottom {
  height: 90rpx;

  button {
    height: 90rpx;
    background: #5cbb89;
    color: #ffffff;
    font-size: 36rpx;
    border-radius: 0;
  }
}
</style>
