<template>
  <view class="content">
    <div class="bg"></div>
    <card
      :name="patient.patientName"
      :avatarUrl="patient.avatarUrl"
      :gender="patient.gender"
      :age="patient.age"
      :infos="[
        { label: '联系方式', value: patient.mobile },
        { label: '用户画像', value: patient.tagListTxt },
      ]"
    />
    <view class="menu-area">
      <view class="menu-area-body mt-48">
        <view
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
      </view>
    </view>
  </view>
</template>

<script>
import patientAPI from '@/APIS/patient/patient.api'
import card from '@/components/card/card.vue'

export default {
  data() {
    return {
      patientId: '',
      patient: {},
    }
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
    .menu-area-item {
      width: $width;
      margin-right: 80rpx;
      text-align: center;
      &-icon {
        width: $width;
        height: $width;
        line-height: $width;
        border-radius: 40rpx;
        text-align: center;
        color: #fff;
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

      &-txt {
        font-size: 28rpx;
      }
    }
  }
}
</style>
