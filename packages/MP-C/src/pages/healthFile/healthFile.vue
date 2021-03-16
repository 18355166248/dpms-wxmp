<template>
  <div class="healthFile">
    <div
      v-if="healthFileDataSource.length > 0"
      class="healthFileList"
      v-for="item in healthFileDataSource"
    >
      <div class="flexContentCard">
        <div class="leftContent">
          <div class="textContent2">
            <span class="iconfont icon-time" style="color: #191919;"></span
            ><span class="itemTimer">{{ getVisTime(item.visTime) }}</span>
          </div>
        </div>
        <div class="rightContent">
          <div class="medicalInstitutionName">
            {{ item.medicalInstitutionName }}
          </div>
        </div>
      </div>
      <div class="flexContentCard">
        <div class="leftContent">
          <div class="textContent">
            <span class="doctorName">主治医生：</span
            ><span>{{ item.doctorStaffName || '-' }}</span>
          </div>
        </div>
        <div class="rightContent">
          <div style="width: 100%; text-align: right;">
            <div
              v-if="item.showElectronicMedicalRecord === 1"
              class="healthBtn"
              @click="onHandleElectronicCase(item)"
            >
              电子病例
            </div>
            <div
              v-if="item.showImaging === 1"
              class="healthBtn"
              @click="onHandleElectronicImage(item)"
              style="margin-left: 16rpx;"
            >
              影像
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="healthFileDataSource.length === 0" class="emptyContent">
      <image class="imgContent" src="../../static/empty-icon@2x.png" />
      <div class="emptyText">暂无健康档案数据</div>
    </div>
  </div>
</template>

<script>
import customerAPI from '@/APIS/customer/customer.api'
import moment from 'moment'
export default {
  name: 'healthFile',
  data() {
    return {
      healthFileDataSource: [],
    }
  },
  // created() {
  //   this.getHealthFileList()
  // },
  onLoad(params) {
    console.log('params', params)
    const { patientId } = params
    this.getHealthFileList(patientId)
  },
  methods: {
    getHealthFileList(patientId) {
      customerAPI.healthRecordsList({ patientId: patientId }).then((res) => {
        this.healthFileDataSource = res.data
      })
    },
    onHandleElectronicCase(val) {
      this.$utils.push({
        url: `/pages/healthFile/electronicCase?patientId=${val.patientId}&registerId=${val.registerId}`,
      })
    },
    onHandleElectronicImage(val) {
      this.$utils.push({
        url: `/pages/healthFile/electronicImage?patientId=${val.patientId}&registerId=${val.registerId}`,
      })
    },
    getVisTime(visTime) {
      return moment(Number(visTime)).format('YYYY-MM-DD HH:mm:ss')
    },
  },
}
</script>

<style lang="scss" scoped>
.healthFileList {
  padding: 0 24rpx;
  height: 170rpx;
  background-color: #fff;
  border-radius: 8rpx;
  margin: 32rpx;
  .flexContentCard {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 85rpx;
    .leftContent {
      width: 50%;
      font-size: 28rpx;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.7);
      .textContent2 {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        span {
          display: inline-block;
        }
        .itemTimer {
          margin-left: 14rpx;
        }
      }

      .textContent {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        height: 85rpx;
        line-height: 70rpx;
        .doctorName {
          display: inline-block;
          color: rgba(0, 0, 0, 0.9);
          height: 36rpx;
          line-height: 36rpx;
        }
      }
    }
    .rightContent {
      width: 50%;
      .medicalInstitutionName {
        width: 100%;
        text-align: right;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.7);
        font-size: 28rpx;
        height: 36rpx;
        line-height: 36rpx;
      }
      .healthBtn {
        margin-bottom: 24rpx;
        display: inline-block;
        padding: 10rpx 24rpx;
        font-size: 28rpx;
        font-family: PingFangSC, PingFangSC-Regular, sans-serif;
        font-weight: 400;
        color: #5cbb89;
        height: 36rpx;
        line-height: 36rpx;
        border: 1px solid #5cbb89;
        border-radius: 10rpx;
      }
    }
  }
}
.emptyContent {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 580rpx;
  .imgContent {
    margin-top: 176rpx;
    margin-bottom: 20rpx;
    width: 320rpx;
    height: 320rpx;
    /*background: yellow;*/
  }
  .emptyText {
    width: 100%;
    font-size: 34rpx;
    font-family: PingFangSC, PingFangSC-Regular, sans-serif;
    text-align: center;
    color: rgba(0, 0, 0, 0.65);
  }
}
</style>
