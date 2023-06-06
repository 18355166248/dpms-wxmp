<template>
  <div class="ach_filter">
    <dpmsCell
      :title="title"
      :value="staffName"
      isLink
      @click.native="onStaffClick"
      :placeholder="placeholder"
    />
    <dpmsCell
      v-if="name === 'nurse' || name === 'doctor'"
      title="项目"
      :value="chargeTypeName"
      isLink
      @click.native="onProjectClick"
      placeholder="请选择项目"
    />
    <button class="ensurebutton" @click="onSave">
      查询
    </button>
    <button class="cancelbutton" @click="onReset">
      重置
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      staffIds: 0,
      staffName: '',
      chargeTypeIds: [],
      chargeTypeName: '',
      staffList: [],
      title: '',
      placeholder: '',
      name: '',
      achFilterDisabled: false,
    }
  },
  onLoad({ name }) {
    const achFilter = uni.getStorageSync('achFilter')
    this.achFilterDisabled = uni.getStorageSync('achFilterDisabled') || false
    const { staffIds, staffName, chargeTypeIds, chargeTypeName } = achFilter
    switch (name) {
      case 'nurse':
        this.title = '护士'
        this.placeholder = '请选择护士'
        break
      case 'doctor':
        this.title = '医生'
        this.placeholder = '请选择医生'
        break
      case 'assistant':
        this.title = '医生助理'
        this.placeholder = '请选择医生助理'
        break
      case 'consultant':
        this.title = '咨询师'
        this.placeholder = '请选择咨询师'
        break
      default:
        break
    }
    this.staffIds = staffIds ? staffIds.split(',') : []
    this.staffName = staffName || ''
    this.chargeTypeIds = chargeTypeIds ? chargeTypeIds.split(',') : []
    this.chargeTypeName = chargeTypeName || ''
    this.name = name
  },
  mounted() {
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
    uni.$on('achStaffList', (checked, list) => {
      this.staffIds = checked
      const arr = []
      checked &&
        checked.forEach((ele) => {
          list.forEach((ele2) => {
            if (ele === ele2.staffId) {
              arr.push(ele2.staffName)
            }
          })
        })
      this.staffName = arr.join(',')
    })
  },
  beforeDestroy() {
    uni.$off('achProjectList')
    uni.$off('achStaffList')
  },
  methods: {
    onSave() {
      uni.$emit('achFilter', {
        staffIds: this.staffIds.join(','),
        staffName: this.staffName,
        chargeTypeIds: this.chargeTypeIds.join(','),
        chargeTypeName: this.chargeTypeName,
      })
      this.setStore()
      this.$dpmsUtils.back()
    },
    onReset() {
      if (!this.achFilterDisabled) {
        this.staffIds = []
        this.staffName = ''
      }
      this.chargeTypeIds = []
      this.chargeTypeName = ''
      this.setStore()
      uni.$emit('achReset', this.achFilterDisabled)
    },
    setStore() {
      uni.setStorageSync('achFilter', {
        staffIds: this.staffIds.join(','),
        staffName: this.staffName,
        chargeTypeIds: this.chargeTypeIds.join(','),
        chargeTypeName: this.chargeTypeName,
      })
    },
    onProjectClick() {
      this.$dpmsUtils.push({
        url:
          '/pages/achievement/projectList?checked=' +
          this.chargeTypeIds.join(','),
      })
    },
    onStaffClick() {
      this.$dpmsUtils.push({
        url:
          '/pages/achievement/staffList?checked=' +
          this.staffIds.join(',') +
          '&name=' +
          this.name,
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
