<template>
  <div class="ach_filter">
    <dpmsCellPicker
      :title="title"
      :placeholder="placeholder"
      v-model="staffId"
      :list="staffList"
      defaultType="staffId"
      :defaultProps="{ label: 'staffName', value: 'staffId' }"
      isLink
    />
    <dpmsCell
      title="项目"
      :value="chargeTypeName"
      isLink
      @click.native="onProjectClick"
      placeholder="请选择项目"
    />
    <button class="ensurebutton" @click="onSave" :disabled="disabled">
      查询
    </button>
    <button class="cancelbutton" @click="onReset" :disabled="disabled">
      重置
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      staffId: 0,
      chargeTypeIds: [],
      chargeTypeName: '',
      staffList: [],
      disabled: false,
      title: '',
      placeholder: '',
    }
  },
  onLoad({ name, staffId, chargeTypeIds, chargeTypeName }) {
    switch (name) {
      case 'nurse':
        this.title = '护士'
        this.placeholder = '请选择护士'
        this.staffList = uni.getStorageSync('allNurseList')
        break
      default:
        break
    }
    this.staffId = Number(staffId)
    this.chargeTypeIds = chargeTypeIds ? chargeTypeIds.split(',') : []
    this.chargeTypeName = chargeTypeName
  },
  mounted() {
    //更新主诉
    uni.$on('achProjectList', (checked, list) => {
      this.chargeTypeIds = checked
      const arr = []
      checked &&
        checked.forEach((ele) => {
          list.forEach((ele2) => {
            if (ele === ele2.settingsChargeTypeId) {
              arr.push(ele2.settingsChargeTypeName)
            }
          })
        })
      this.chargeTypeName = arr.join(',')
    })
  },
  beforeDestroy() {
    uni.$off('achProjectList')
  },
  methods: {
    onSave() {
      uni.$emit('achFilter', {
        staffId: this.staffId,
        chargeTypeIds: this.chargeTypeIds.join(','),
        chargeTypeName: this.chargeTypeName,
      })
      this.$utils.back()
    },
    onReset() {
      this.staffId = 0
      this.chargeTypeIds = []
      this.chargeTypeName = ''
    },
    onProjectClick() {
      this.$utils.push({
        url:
          '/pages/achievement/projectList?checked=' +
          this.chargeTypeIds.join(','),
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.ach_filter {
  width: 100vw;
  .ensurebutton {
    height: 80rpx;
    background: #5cbb89;
    border-radius: 40rpx;
    margin-top: 320rpx;
    width: 686rpx;
    color: #fff;
    line-height: 80rpx;
  }
  .cancelbutton {
    margin-top: 32rpx;
    height: 80rpx;
    color: #5cbb89;
    border-radius: 40rpx;
    width: 686rpx;
    background: #fff;
    line-height: 80rpx;
    border: 2rpx solid #5cbb89;
  }
}
</style>
