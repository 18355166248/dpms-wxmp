<template>
  <div class="staffList pt-56">
    <checkbox-group @change="checkboxChange">
      <label
        v-for="staff in staffList"
        :key="staff.staffId"
        class="checkedLabel"
      >
        <checkbox :value="staff.staffId" :checked="staff.checked" />
        <span class="staffName">{{ staff.staffName }}</span>
      </label>
    </checkbox-group>
    <div class="mt-56 tc">
      <button class="submit" @click="onSave">保存</button>
    </div>
  </div>
</template>

<script>
const staffTitle = {
  5: { title: '选择助理', key: 'ASSISTANT_MANAGER', formKey: 'help' },
  6: { title: '选择护士', key: 'NURSE', formKey: 'nurse' },
}
export default {
  data() {
    return {
      staffList: [],
      checkedList: [], // 选中列表
      checked: [], // 选中值
      key: '', // 后台数据接收key值
      formKey: '', // 表单接收值
    }
  },
  created() {},
  onLoad: function ({ option, checked }) {
    if (option && staffTitle[option]) {
      uni.setNavigationBarTitle({
        title: staffTitle[option].title,
      })

      this.key = staffTitle[option].key
      this.formKey = staffTitle[option].formKey
      const staffListInfo = uni.getStorageSync('staffListInfo')
      const staffList = staffListInfo[this.key + '_LIST'] || []

      staffList.forEach((staff) => {
        staff.checked = checked.includes(staff.staffId)
      })

      this.staffList = staffList
    }
  },
  methods: {
    checkboxChange(e) {
      this.checked = e.detail.value
      this.checkedList = this.staffList.filter((staff) =>
        e.detail.value.includes(String(staff.staffId)),
      )
    },
    onSave() {
      uni.$emit('apptFormWithUpdateStaffList', {
        key: this.formKey,
        value: this.checked,
        list: this.checkedList,
      })

      this.$utils.back()
    },
  },
}
</script>

<style lang="scss" scoped>
.staffList {
  .checkedLabel {
    display: flex;
    align-items: center;
    padding: 24rpx;
    .staffName {
      margin-left: 20rpx;
    }
  }
  .submit {
    width: 620rpx;
    border: none;
    background-color: $common-color;
    border-radius: 8rpx;
    font-size: 36rpx;
    color: #fff;
    letter-spacing: 10rpx;
  }
}
</style>
