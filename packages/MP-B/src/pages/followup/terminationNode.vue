<template>
  <view class="apptForm">
    <view class="pageWrap">
      <view class="bg" />
      <view class="patientInfo tc">
        <view class="patientCard">
          <view class="patientDetail">
            <view>
              <patientAvatar :patient="customer" />
            </view>
            <view class="patientCenter">
              <view class="patientTop text-ellipsis">
                {{ customer.name }}
              </view>
              <view class="patientC mt-8 mb-16">
                <span class="gender mr-8">{{
                  customer.gender | getGenderText
                }}</span>
                <span class="age">{{ customer.age }}</span>
              </view>
              <view class="patientBottom">
                <span>联系方式:</span>
                <span class="ml-10">{{ customer.mobile }}</span>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="reason">
        <view class="title">终止原因</view>
        <view class="appointmentMemo">
          <textarea
            v-model="appointmentMemo"
            placeholder="请输入终止原因(100字以内)"
            placeholder-style="font-size: 28rpx; font-weight: 400; color: #bfbfbf;"
            style="height: 450rpx;"
            :maxlength="100"
          />
        </view>
      </view>
    </view>
    <view class="bottom-wrap">
      <view class="btns">
        <saveButton
          type="solid"
          @click="onSave"
          :buttonStyle="{ width: '686rpx' }"
        >
          保存
        </saveButton>
      </view>
    </view>
  </view>
</template>

<script>
import patientAvatar from 'businessComponents/patientAvatar/patientAvatar'
import { commonUtil } from 'mpcommon'
import followupAPI from '@/APIS/followup/followup.api.js'
import saveButton from './common/saveButton'

const GENDER_ENUM = commonUtil.getEnums('Gender')

export default {
  components: {
    patientAvatar,
    saveButton,
  },
  data() {
    return {
      customer: {},
      primaryColor: this.$commonCss.commonColor,
      appointmentMemo: '',
      followUpNodeId: null,
      followUpPlanId: null,
    }
  },
  filters: {
    getGenderText(gender) {
      if (GENDER_ENUM && GENDER_ENUM.properties && gender) {
        return GENDER_ENUM.properties[gender].text.zh_CN
      }
      return '未知'
    },
  },
  onLoad(params) {
    this.followUpNodeId = params.followUpNodeId
    this.followUpPlanId = params.followUpPlanId
    this.getFollowUpList()
  },
  methods: {
    onSave() {
      var textValue = this.appointmentMemo.replace(/(^\s*)|(\s*$)/g, '')
      if (!textValue || textValue == '') {
        this.$dpmsUtils.show('请输入终止原因')
        return
      }
      const params = {
        followUpNodeId: this.followUpNodeId,
        followUpPlanId: this.followUpPlanId,
        terminationReason: this.appointmentMemo,
      }
      followupAPI.abortFollowupNode(params).then((res) => {
        // res.data返回followUpNodeId
        if (res.code == 0) {
          let pages = getCurrentPages() //获取页面栈
          if (pages[pages.length - 2]?.route === 'pages/followup/detail') {
            console.log('detail')
            uni.$emit('followUpHomeUpdate')
            uni.$emit('followUpDetailUpdate')
          } else {
            console.log('home')
            uni.$emit('followUpHomeUpdate')
          }
          this.$dpmsUtils.back()
        }
      })
    },
    getFollowUpList() {
      followupAPI.getDetailService({ id: this.followUpPlanId }).then((res) => {
        console.log('detail', res)
        if (res.code == 0) {
          const { customer } = res.data
          this.customer = {
            ...customer,
            name: customer.name || '',
            gender: customer.gender || 3,
            age: customer.medicalRecordNo || '',
            mobile: customer.mobile || '',
          }
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.apptForm {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.04);
  overflow: auto;
  display: flex;
  flex-grow: 2;
  flex-direction: column;
  justify-content: space-between;
  .inputRightIcon {
    color: rgba($color: #000000, $alpha: 0.5);
  }
  .pageWrap {
    height: 100%;
    position: relative;
    .bg {
      position: absolute;
      width: 2500rpx;
      height: 2500rpx;
      border-radius: 1250rpx;
      top: -2300rpx;
      left: -875rpx;
      background-color: $common-color;
      z-index: -1;
    }
  }
  .patientInfo {
    box-sizing: border-box;
    margin-bottom: 24rpx;
    .patientCard {
      width: 702rpx;
      height: 208rpx;
      display: inline-block;
      background-color: #fff;
      padding: 32rpx 24rpx;
      box-sizing: border-box;
      border-radius: 8rpx;
      > .patientDetail {
        display: flex;
        justify-content: space-between;
        align-items: stretch;
        .selectPatient {
          color: $common-color;
          font-size: 28rpx;
          margin-right: 10rpx;
        }
        .patientCenter {
          padding-left: 32rpx;
          flex: 1;
          text-align: left;
          overflow: hidden;
          .patientTop {
            width: 100%;
            font-size: 34rpx;
            font-weight: 500;
            color: rgba(0, 0, 0, 0.9);
            overflow: hidden;
          }
          .patientC {
            font-size: 26rpx;
            .age,
            .gender {
              vertical-align: middle;
              display: inline-block;
              background: #fff2e8;
              color: #fa541c;
              border-radius: 2rpx;
              height: 40rpx;
              line-height: 40rpx;
              text-align: center;
              padding: 2rpx 16rpx;
              // min-width: 90rpx;
            }
          }
          .patientBottom {
            color: rgba($color: #000000, $alpha: 0.5);
            font-size: 28rpx;
          }
        }
      }
    }
  }
  .reason {
    padding: 32rpx;
    width: 100%;
    background-color: #fff;
    height: 532rpx;
    .title {
      height: 40rpx;
      line-height: 40rpx;
      font-size: 30rpx;
      color: #4c4c4c;
      font-weight: 400;
      margin-bottom: 8rpx;
    }
    .appointmentMemo {
      width: 686rpx;
      textarea {
        width: 100%;
      }
    }
  }
  .bottom-wrap {
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    background: #fff;
    .btns {
      padding: 16rpx 32rpx;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
