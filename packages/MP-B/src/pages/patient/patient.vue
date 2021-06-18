<template>
  <view class="content">
    <div class="bg"></div>
    <card
      :patient="patient"
      :name="patient.patientName"
      :avatarUrl="patient.avatarUrl"
      :gender="patient.gender"
      :medicalRecordNo="patient.medicalRecordNo"
      :visType="
        patient.visTypeName === undefined ? `未到诊` : patient.visTypeName
      "
      :infos="[
        {
          label: '出生日期',
          value: patient.age ? `${patient.birthday}（${patient.age}）` : '',
        },
        { label: '联系方式', value: patient.mobile },
        { label: '患者标签', value: patient.tagListTxt },
      ]"
    />
    <view class="menu-area">
      <view class="menu-area-body mt-48">
        <view
          v-if="
            menu.pageElementsList.some((m) => m.enumValue === 'detailed-infos')
          "
          class="menu-area-item"
          @click="
            toUrl(
              '/pages/patient/editPatient/editPatient?patientId=' + patientId,
            )
          "
        >
          <view class="menu-area-item-icon menu-area-item-icon-color1">
            <text class="iconfont icon-my-entity"></text>
          </view>
          <view class="menu-area-item-txt mt-24">
            详细信息
          </view>
        </view>
        <view
          v-if="
            menu.pageElementsList.some(
              (m) => m.enumValue === 'treatment-record',
            )
          "
          class="menu-area-item"
          @click="
            toUrl('/pages/patient/apptList/apptList?patientId=' + patientId)
          "
        >
          <view class="menu-area-item-icon menu-area-item-icon-color2">
            <text class="iconfont icon-clock"></text>
          </view>
          <view class="menu-area-item-txt mt-24">
            预约
          </view>
        </view>
        <view
          v-if="iconShow.isChargeShow"
          class="menu-area-item"
          @click="
            toUrl(
              '/pages/charge/chargeForm?patientId=' +
                patientId +
                '&customerId=' +
                customerId,
            )
          "
        >
          <view class="menu-area-item-icon menu-area-item-icon-color6">
            <text class="iconfont icon-renmingbi"></text>
          </view>
          <view class="menu-area-item-txt mt-24">
            收费
          </view>
        </view>
        <view
          v-if="menu.pageElementsList.some((m) => m.enumValue === 'image')"
          class="menu-area-item"
          @click="toUrl('/pages/patient/image/record?patientId=' + patientId)"
        >
          <view class="menu-area-item-icon menu-area-item-icon-color3">
            <text class="iconfont icon-yingxiang"></text>
          </view>
          <view class="menu-area-item-txt mt-24">
            影像记录
          </view>
        </view>
        <view
          v-if="
            menu.pageElementsList.some(
              (m) => m.enumValue === 'electronic-medical-record',
            )
          "
          class="menu-area-item"
          @click="
            toUrl('/pages/patient/medicalRecord/record?patientId=' + patientId)
          "
        >
          <view class="menu-area-item-icon menu-area-item-icon-color4">
            <text class="iconfont icon-dingdan-mian"></text>
          </view>
          <view class="menu-area-item-txt mt-24">
            病历记录
          </view>
        </view>
        <view class="menu-area-item" @click="callTel">
          <view class="menu-area-item-icon menu-area-item-icon-color5">
            <text class="iconfont icon-phone"></text>
          </view>
          <view class="menu-area-item-txt mt-24">
            打电话
          </view>
        </view>
        <view
          v-if="
            menu.pageElementsList.some((m) => m.enumValue === 'disposalRecord')
          "
          class="menu-area-item"
          @click="
            onDisposalRecord(
              '/pages/patient/disposalRecord/disposalRecord?patientId=' +
                patientId,
            )
          "
        >
          <view class="menu-area-item-icon menu-area-item-icon-color7">
            <text class="iconfont icon-disposal-fill"></text>
          </view>
          <view class="menu-area-item-txt mt-24">
            处置记录
          </view>
        </view>
        <view class="menu-area-item" @click="handleShowModal">
          <view class="menu-area-item-icon menu-area-item-icon-color7">
            <text class="iconfont icon-wechat-fill"></text>
          </view>
          <view class="menu-area-item-txt mt-24">
            微信聊天
          </view>
        </view>
      </view>
    </view>
    <view class="mask-pop" v-if="modalVisible">
      <view class="pop-content">
        <view class="friend-list">
          <view class="item" v-for="(item, index) in friendsList" :key="index">
            <view
              class="avatar"
              style="background-image: url({{item.receivePhotoUrl}})"
            ></view>
            <view class="nick-name-wrap">
              <view class="name">{{ item.receiveNick }}</view>
              <view class="belong-wechat"
                >所属微信：{{ item.receiveRemark || '' }}</view
              >
            </view>
            <view class="chat-btn" @click="handleCopy(item.receiveNick)"
              >聊天</view
            >
          </view>
        </view>
        <view class="bottom-close" @click="closeModal">关闭</view>
      </view>
    </view>
  </view>
</template>

<script>
import patientAPI from '@/APIS/patient/patient.api'
import card from '@/components/card/card.vue'
import { mapState, mapMutations } from 'vuex'

export default {
  data() {
    return {
      friendsList: [],
      patientId: '',
      customerId: '',
      patient: {},
      iconShow: {
        isChargeShow: false,
      },
      visType: {
        1: '初诊',
        2: '复诊',
      },
      modalVisible: false,
    }
  },
  computed: {
    ...mapState({
      menu: (state) => state.workbenchStore.menu,
    }),
  },
  onLoad(params) {
    this.patientId = params.patientId
    const { menuList, pageElementsList } = this.menu

    const findObj =
      menuList &&
      menuList.find((v) => {
        return v.enumValue === 'patient-center'
      })
    this.iconShow.isChargeShow =
      findObj &&
      findObj.children.findIndex((v) => {
        return v.enumValue === 'patient-manage'
      }) > -1

    const hasCharge =
      pageElementsList &&
      pageElementsList.find((v) => {
        return v.enumValue === 'billing-tab'
      })

    this.iconShow.isChargeShow = this.iconShow.isChargeShow && hasCharge
  },
  onShow() {
    this.getPatient()
  },
  methods: {
    ...mapMutations('patient', ['setPatientDetail']),
    getPatient() {
      this.$utils.showLoading()
      patientAPI
        .getPatientDetail({ patientId: this.patientId })
        .then((res) => {
          let { data } = res
          this.patient = data
          this.setPatientDetail(data)
          // if (this.patient.tagList.length > 3) {
          //   this.patient.tagList.splice(3, this.patient.tagList.length, {name: '...'})
          // }
          this.customerId = data.customerId
          this.patient.tagListTxt = this.patient.tagList
            .map((v) => v.name)
            .join('，')
          this.$utils.clearLoading()
        })
        .catch(() => {
          this.$utils.clearLoading()
        })
    },
    toUrl(url) {
      this.$utils.push({
        url,
      })
    },
    callTel() {
      uni.makePhoneCall({
        phoneNumber: this.patient?.mobile,
      })
    },
    onDisposalRecord(url) {
      console.log('url', url)
      this.$utils.push({
        url,
      })
    },
    handleCopy(data) {
      wx.setClipboardData({
        data: data,
        success(res) {
          wx.hideToast()
          wx.showToast({
            title:
              '当前客户微信昵称已复制，请打开企微/个微，在好友列表顶部搜索框中粘贴，可快捷查找到好友，并与其聊天。',
            icon: 'none',
          })
        },
      })
    },
    closeModal() {
      this.modalVisible = false
    },
    handleShowModal() {
      patientAPI
        .getConnectFriends({
          customerId: this.customerId,
        })
        .then((res) => {
          this.friendsList = res.data || []
          if (res.data && res.data.length === 0) {
            wx.showToast({
              title: '当前患者未关联企微/个微',
              icon: 'none',
            })
            return
          }
          this.modalVisible = true
        })
    },
  },
  components: {
    card,
  },
}
</script>

<style lang="scss" scoped>
.bg {
  position: absolute;
  width: 2500rpx;
  height: 2500rpx;
  border-radius: 1250rpx;
  top: -2300rpx;
  left: -875rpx;
  background-color: $common-color;
  z-index: 0;
}
.content {
  padding-top: 40rpx;
  .mask-pop {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    .pop-content {
      position: relative;
      width: 640rpx;
      height: 920rpx;
      opacity: 1;
      background: #ffffff;
      border-radius: 24rpx;
      box-shadow: 0rpx 18rpx 56rpx 16rpx rgba(0, 0, 0, 0.05),
        0rpx 12rpx 32rpx 0rpx rgba(0, 0, 0, 0.08),
        0rpx 6rpx 12rpx -8rpx rgba(0, 0, 0, 0.12);
      .friend-list {
        padding: 32rpx 0;
        width: 100%;
        height: 808rpx;
        overflow-y: auto;
        .item {
          width: 100%;
          padding: 0 32rpx;
          display: flex;
          align-items: center;
          height: 96rpx;
          box-sizing: border-box;
          margin-bottom: 66rpx;
          .avatar {
            width: 96rpx;
            height: 96rpx;
            background-position: center;
            background-size: 100%;
            background-repeat: no-repeat;
            border-radius: 50%;
          }
          .nick-name-wrap {
            margin-left: 16rpx;
            margin-right: auto;
            .name {
              font-size: 34rpx;
              font-family: PingFangSC, PingFangSC-Medium;
              font-weight: 500;
              color: #191919;
              width: 306rpx;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .belong-wechat {
              font-size: 28rpx;
              font-family: PingFangSC, PingFangSC-Regular;
              color: #7f7f7f;
              width: 306rpx;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          .chat-btn {
            color: #ffffff;
            width: 120rpx;
            height: 56rpx;
            background: #5cbb89;
            border-radius: 28rpx;
            text-align: center;
            line-height: 56rpx;
            font-size: 28rpx;
          }
        }
      }
      .bottom-close {
        background: #ffffff;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 111rpx;
        border-top: 2rpx solid #e5e5e5;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 34rpx;
        font-family: PingFangSC, PingFangSC-Regular;
        color: #5cbb89;
        border-radius: 0 0 24rpx 24rpx;
      }
    }
  }
}
.menu-area {
  padding: 0 32rpx;
  $width: 112rpx;
  @mixin colors($linearStartColor, $linearEndColor) {
    box-shadow: 0px 20px 20px -20px $linearEndColor;
    background: linear-gradient(
      323deg,
      $linearStartColor 10%,
      $linearEndColor 89%
    );
  }

  &-body {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .menu-area-item {
      width: $width;
      min-width: 33.33%;
      text-align: center;
      color: rgba(0, 0, 0, 0.9);
      margin-bottom: 64rpx;
      &-icon {
        width: $width;
        height: $width;
        line-height: $width;
        border-radius: 40rpx;
        text-align: center;
        color: #fff;
        margin: auto;
        .iconfont {
          font-size: 60rpx;
        }
      }
      &-icon-color1 {
        $values: rgba(57, 203, 240, 1), rgba(18, 148, 220, 1);
        @include colors($values...);
      }
      &-icon-color2 {
        $values: rgba(254, 178, 119, 1), rgba(251, 141, 81, 1);
        @include colors($values...);
      }
      &-icon-color3 {
        $values: rgba(179, 127, 235, 1), rgba(114, 46, 209, 1);
        @include colors($values...);
      }
      &-icon-color4 {
        $values: rgba(255, 133, 192, 1), rgba(235, 47, 150, 1);
        @include colors($values...);
      }
      &-icon-color5 {
        $values: rgba(110, 167, 252, 1), rgba(74, 147, 254, 1);
        @include colors($values...);
      }
      &-icon-color6 {
        $values: rgba(255, 132, 135, 1), rgba(255, 77, 79, 1);
        @include colors($values...);
      }
      &-icon-color7 {
        $values: rgba(91, 218, 153, 1), rgba(52, 197, 122, 1);
        @include colors($values...);
      }

      &-txt {
        font-size: 28rpx;
      }
    }
  }
}
</style>
