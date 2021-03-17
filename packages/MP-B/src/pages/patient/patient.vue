<template>
  <view class="content">
    <div class="bg"></div>
    <card
      :patient="patient"
      :name="patient.patientName"
      :avatarUrl="patient.avatarUrl"
      :gender="patient.gender"
      :age="patient.age"
      :infos="[
        { label: '联系方式', value: patient.mobile },
        { label: '患者标签', value: patient.tagListTxt },
      ]"
    />
    <view class="menu-area">
      <view class="menu-area-body mt-48">
        <view
          v-if="menu.pageElementsList.some(m => m.enumValue === 'detailed-infos')"
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
          v-if="menu.pageElementsList.some(m => m.enumValue === 'treatment-record')"
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
          v-if="menu.pageElementsList.some(m => m.enumValue === 'image')"
          class="menu-area-item"
          @click="
            toUrl('/pages/patient/image/record?patientId=' + patientId)
          "
        >
          <view class="menu-area-item-icon menu-area-item-icon-color3">
            <text class="iconfont icon-yingxiang"></text>
          </view>
          <view class="menu-area-item-txt mt-24">
            影像记录
          </view>
        </view>
        <view
          v-if="menu.pageElementsList.some(m => m.enumValue === 'electronic-medical-record')"
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
        <view
          class="menu-area-item"
          @click="callTel"
        >
          <view class="menu-area-item-icon menu-area-item-icon-color5">
            <text class="iconfont icon-phone"></text>
          </view>
          <view class="menu-area-item-txt mt-24">
            打电话
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import patientAPI from '@/APIS/patient/patient.api'
import card from '@/components/card/card.vue'
import {mapState} from 'vuex'
export default {
  data() {
    return {
      patientId: '',
      patient: {},
    }
  },
  computed: {
    ...mapState({
      menu: state => state.workbenchStore.menu
    })
  },
  onLoad(params) {
    this.patientId = params.patientId
  },
  onShow() {
    this.getPatient()
  },
  methods: {
    getPatient() {
      this.$utils.showLoading()
      patientAPI
        .getPatientDetail({ patientId: this.patientId })
        .then((res) => {
          let { data } = res
          this.patient = data
          // if (this.patient.tagList.length > 3) {
          //   this.patient.tagList.splice(3, this.patient.tagList.length, {name: '...'})
          // }
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
        phoneNumber: this.patient?.mobile
      })
    }
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
      color: rgba(0,0,0,0.9);
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
        $values: rgba(179,127,235,1), rgba(114,46,209,1);
        @include colors($values...);
      }
      &-icon-color4 {
        $values: rgba(255,133,192,1), rgba(235,47,150,1);
        @include colors($values...);
      }
      &-icon-color5 {
        $values: rgba(110, 167, 252, 1), rgba(74, 147, 254, 1);
        @include colors($values...);
      }

      &-txt {
        font-size: 28rpx;
      }
    }
  }
}
</style>
