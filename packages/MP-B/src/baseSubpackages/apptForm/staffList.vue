<template>
  <div class="staffList pt-56">
    <dpmsCheckboxGroup v-model="checked">
      <div
        v-for="staff in staffList"
        :key="staff.staffId"
        class="checkedLabel"
        @click="onCheckStaff(staff.staffId)"
      >
        <dpmsCheckbox
          shape="square"
          :key="staff.staffId"
          :label="staff.staffId"
        >
          {{ staff.staffName }}
        </dpmsCheckbox>
      </div>
    </dpmsCheckboxGroup>
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

      this.staffList = staffList
      this.checked = checked.split(',').map((v) => Number(v))
    }
  },
  methods: {
    onSave() {
      const checkedList = this.staffList.filter((staff) =>
        this.checked.includes(staff.staffId),
      )

      uni.$emit('apptFormWithUpdateStaffList', {
        key: this.formKey,
        value: this.checked,
        list: checkedList,
      })

      this.$utils.back()
    },
    onCheckStaff(staffId) {
      if (staffId === -1) {
        this.checked = [-1]
      } else {
        if (this.checked.includes(-1)) {
          this.checked.splice(0, 1)
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.staffList {
  .checkedLabel {
    // display: flex;
    align-items: center;
    padding: 24rpx;
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
