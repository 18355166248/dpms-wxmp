<template>
  <div class="disposalContent">
    <div
      v-if="disposalRecordList.length > 0"
      v-for="item in disposalRecordList"
      :key="item.businessId"
      class="disposalList"
    >
      <div class="flexContent" style="padding: 24rpx 0;">
        <div class="leftText">
          <span class="iconfont icon-time-circle"></span
          ><span style="margin-left: 14rpx;">{{
            getBusinessTime(item.businessTime) || '--'
          }}</span>
          <span style="margin-left: 14rpx;">{{
            item.medicalInstitutionName
          }}</span>
        </div>
        <div class="rightText" style="font-weight: 500;">
          <span>{{
            diagnosisDisposeTypeFormat(item.diagnosisDisposeType)
          }}</span>
        </div>
      </div>
      <div class="lineHr"></div>
      <div class="teethRow">
        <div>
          <div
            v-if="item.diagnosisDisposeType === 1"
            class="teethContent"
            v-for="(v0, i) in item.medicalRecordDisposeList"
            :key="i"
          >
            <div class="label">牙位</div>
            <div class="teethPosition">
              <TeethSelect
                :value="JSON.parse(v0.disposePosition || 'null')"
                disabled
              />
            </div>
            <div class="label">处置说明：</div>
            <div class="labelText">{{ v0.dispose }}</div>
            <div class="lineHr"></div>
          </div>
          <div
            v-if="item.diagnosisDisposeType === 2"
            class="teethContent"
            v-for="(v0, i) in item.chargeDisposeList"
            :key="i"
          >
            <div class="label">牙位</div>
            <div class="teethPosition">
              <TeethSelect
                :value="
                  JSON.parse(v0.billOrderItemBaseDTO.disposePosition || 'null')
                "
                disabled
              />
            </div>
            <div class="label">处置说明：</div>
            <div class="labelText">{{ v0.billOrderItemBaseDTO.dispose }}</div>
            <div class="lineHr"></div>
          </div>
        </div>
      </div>
      <div style="padding: 24rpx 0 26rpx 0;">
        <div class="flexContent">
          <div class="leftText">
            <span v-if="item.diagnosisDisposeType === 1" class="colorFontF7"
              >就诊日期:</span
            >
            <span v-if="item.diagnosisDisposeType === 2" class="colorFontF7"
              >开单时间:</span
            >
            <span class="colorFontF7" style="margin-left: 14rpx;">{{
              getBusinessTime(item.businessTime) || '--'
            }}</span>
          </div>
          <div class="rightText">
            <span
              v-if="item.diagnosisDisposeType === 2"
              :style="item.disposeStatus === 4 ? 'color:red' : 'color: #5cbb89'"
              >{{ billStatusFormat(item.disposeStatus) }}</span
            >
            <span v-if="item.diagnosisDisposeType === 1">{{
              item.visTypeName || '--'
            }}</span>
          </div>
        </div>
        <div class="flexContent">
          <div class="leftText">
            <span class="colorFontF7">医生：</span
            ><span class="colorFontF7">{{ item.doctorStaffName || '--' }}</span>
          </div>
          <div class="rightText"></div>
        </div>
        <div class="flexContent">
          <div class="leftText">
            <span class="colorFontF7">护士：{{ getNurseStr(item.nurse) }}</span>
          </div>
          <div class="rightText"></div>
        </div>
        <div v-if="item.diagnosisDisposeType === 1" class="rowMain">
          <div class="label colorFontF7">主诉：</div>
          <div>{{ item.mainComplaint || '--' }}</div>
        </div>
      </div>
    </div>
    <div v-if="disposalRecordList.length === 0">
      <empty :disabled="true" text="暂无处置记录数据"></empty>
    </div>
  </div>
</template>

<script>
import TeethSelect from '@/businessComponents/TeethSelect/TeethSelect.vue'
import moment from 'moment'
import empty from '@/components/empty/empty.vue'
import patientAPI from '@/APIS/patient/patient.api.js'

export default {
  name: 'disposalRecord',
  components: { TeethSelect, empty },
  data() {
    return {
      disposalRecordList: [],
    }
  },
  onLoad({ patientId }) {
    this.getDiagnosisList(patientId)
  },
  methods: {
    // 显示护士字段
    getNurseStr(nurse) {
      if (nurse) return nurse.nurseList.map((e) => e.name).join(',')
      else return '--'
    },
    getDiagnosisList(patientId) {
      uni.showLoading({
        title: '数据加载中',
        mask: true,
      })
      patientAPI
        .getDisposeList({
          patientId: patientId,
        })
        .then((res) => {
          if (res.code === 0) {
            this.disposalRecordList = res.data
          }
          uni.hideLoading()
        })
        .catch((res) => {
          uni.hideLoading()
        })
    },
    diagnosisDisposeTypeFormat(type) {
      let diagnosisDisposeTypeStr = ''
      if (type === 1) {
        return (diagnosisDisposeTypeStr = '电子病历')
      } else if (type === 2) {
        return (diagnosisDisposeTypeStr = '处置收费')
      }
    },
    billStatusFormat(type) {
      let disposeStatus = ''
      if (type === 1) {
        return (disposeStatus = '待收费')
      } else if (type === 2) {
        return (disposeStatus = '已收费')
      } else if (type === 3) {
        return (disposeStatus = '已退费')
      } else if (type === 4) {
        return (disposeStatus = '欠费')
      }
    },
    getBusinessTime(businessTime) {
      return moment(businessTime).format('YYYY-MM-DD HH:mm:ss')
    },
  },
}
</script>

<style lang="scss" scoped>
.colorFont {
  color: rgba(0, 0, 0, 0.9) !important;
}
.colorFontF7 {
  color: #7f7f7f !important;
}
.lineHr {
  height: 3rpx;
  background: rgba(0, 0, 0, 0.1);
}

.disposalContent {
  .disposalList {
    padding: 0 32rpx;
    background-color: #fff;
    margin-bottom: 32rpx;
    .flexContent {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .leftText {
        width: 80%;
        font-size: 28rpx;
        font-weight: 400;
        color: #191919;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .rightText {
        width: 20%;
        text-align: right;
        font-weight: 400;
        color: #191919;
        font-size: 28rpx;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
  .teethRow {
    .teethContent {
      .label {
        padding: 24rpx 0 8rpx 0;
        font-size: 28rpx;
        font-family: PingFangSC, PingFangSC-Regular, sans-serif;
        font-weight: 400;
        white-space: nowrap;
        color: rgba(0, 0, 0, 0.9);
      }
      .labelText {
        font-size: 28rpx;
        font-family: PingFangSC, PingFangSC-Regular, sans-serif;
        font-weight: 400;
        text-align: left;
        color: #4c4c4c;
        word-wrap: break-word;
        word-break: normal;
        padding-bottom: 16rpx;
      }
      .teethPosition {
        width: 570rpx;
        margin-bottom: 16rpx;
        &:last-child {
          margin-bottom: none;
        }
      }
    }
  }
  .rowMain {
    display: flex;
    font-size: 28rpx;
    font-family: PingFangSC, PingFangSC-Regular, sans-serif;
    font-weight: 400;
    color: #7f7f7f;
    .label {
      flex: none;
      white-space: nowrap;
      color: rgba(0, 0, 0, 0.9);
      text-align: right;
      & + div {
        flex: auto;
        word-break: break-all;
      }
    }
  }
}
</style>
