<template>
  <div class="addPersonas">
    <view class="uni-form-item">
      <input
        placeholder="请输入标签名称"
        placeholder-style="font-size: 34rpx; color: rgba(0, 0, 0, 0.25);"
        v-model="name"
      />
    </view>
    <button class="ensurebutton" @click="onSave" :disabled="disabled">
      保&nbsp;&nbsp;存
    </button>
  </div>
</template>

<script>
import patientAPI from '@/APIS/patient/patient.api'

export default {
  data() {
    return {
      groupId: 0,
      name: '',
      disabled: false,
    }
  },
  onLoad({ groupId }) {
    this.groupId = Number(groupId)
  },
  methods: {
    onSave() {
      if (!this.name || !this.groupId) {
        return this.$dpmsUtils.show('请输入标签内容')
      }
      const _self = this
      _self.disabled = true
      patientAPI
        .addTag({
          groupId: _self.groupId,
          name: _self.name,
        })
        .then(() => {
          _self.$dpmsUtils.back()
          _self.disabled = false
        })
        .catch(() => {
          _self.disabled = false
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.addPersonas {
  width: 100vw;
  .uni-form-item {
    width: 686rpx;
    background: #ffffff;
    padding: 32rpx;
  }
  .ensurebutton {
    height: 80rpx;
    background: #5cbb89;
    border-radius: 40rpx;
    margin-top: 320rpx;
    width: 686rpx;
    color: #fff;
    line-height: 80rpx;
  }
}
</style>
