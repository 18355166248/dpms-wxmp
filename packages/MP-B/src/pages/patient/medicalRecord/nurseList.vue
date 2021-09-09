<template>
  <div class="staffList pt-56">
    <dpmsCheckboxGroup v-model="checked">
      <div
        v-for="staff in computedNurseList"
        :key="staff.id"
        class="checkedLabel"
        @click="onCheckStaff(staff.id)"
      >
        <dpmsCheckbox shape="square" :key="staff.id" :label="staff.id">
          {{ staff.name }}
        </dpmsCheckbox>
      </div>
    </dpmsCheckboxGroup>
    <div class="mt-56 tc">
      <button class="submit" @click="onSave">保存</button>
    </div>
  </div>
</template>

<script>
import institutionAPI from 'APIS/institution/institution.api'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      nurseList: [], // 后台返回的护士列表
      checkedList: [], // 从其他页面选择的列表
      checked: [], // 选中的id列表
    }
  },
  onLoad: function ({ title, checkedList }) {
    if (title) {
      uni.setNavigationBarTitle({
        title: title,
      })
    }
    this.init()
    console.log(checkedList)
    if (checkedList === 'undefined' || !checkedList) {
      this.checked = [-1]
    } else {
      this.checkedList = JSON.parse(checkedList)
      this.checked = this.checkedList.map((e) => e.id)
    }
  },
  computed: {
    ...mapState('workbenchStore', {
      medicalInstitution: (state) => state.medicalInstitution,
    }),
    computedNurseList() {
      let obj = {}
      return [...this.nurseList, ...this.checkedList].reduce((item, next) => {
        obj[next.id] ? '' : (obj[next.id] = true && item.push(next))
        return item
      }, [])
    },
  },
  methods: {
    async init() {
      const { code, data } = await institutionAPI.getStaffListByPosition({
        position: 6,
        workStatus: 1,
        medicalInstitutionId: this.medicalInstitution.medicalInstitutionId,
      })
      if (code === 0) {
        this.nurseList = [
          { id: -1, name: '未指定护士' },
          ...data.map((e) => ({ id: e.staffId, name: e.staffName })),
        ]
      }
    },
    onSave() {
      let params = ''
      if (this.checked.indexOf(-1) === -1) {
        params = {
          nurseList: this.checked.map((e) => ({
            id: e,
            name: this.computedNurseList.find((v) => v.id === e).name,
          })),
        }
      }
      uni.$emit('updateNurseList', params)
      this.$dpmsUtils.back()
    },
    // 保证未指定医生和其他选项互斥
    onCheckStaff(id) {
      if (this.checked.length === 0) {
        this.checked = [-1]
        return
      }

      if (id === -1) {
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
