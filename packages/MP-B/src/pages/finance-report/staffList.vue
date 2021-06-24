<template>
  <div class="ach_staffList">
    <dpmsCheckboxGroup v-model="checked" v-if="list && list.length">
      <div class="apptCollapse">
        <div
          v-for="item in list"
          :key="item.staffId"
          style="margin-top: 24rpx;"
        >
          <dpmsCheckbox shape="square" :label="item.staffId"
            >{{ item.staffName }}
          </dpmsCheckbox>
          <div class="line"></div>
        </div>
      </div>
    </dpmsCheckboxGroup>
    <empty :disabled="true" text="暂无数据" v-if="list.length === 0" />
    <fixed-footer bgColor="#F5F5F5">
      <div class="mt-56">
        <dpmsButton @click="onSave" v-if="list && list.length" />
      </div>
    </fixed-footer>
  </div>
</template>

<script>
import empty from '@/components/empty/empty.vue'
import institutionAPI from 'APIS/institution/institution.api'
import { mapMutations, mapState } from 'vuex'

export default {
  components: {
    empty,
  },
  data() {
    return {
      type: 'doctor',
      list: [],
      checked: [],
    }
  },
  onLoad({ name }) {
    this.type = name
    uni.showLoading({
      title: '数据加载中',
      mask: true,
    })
    this.loadData()
      .then(() => {
        if (name === 'doctor') {
          this.checked = this.doctor.doctorIds
            .split(',')
            .map((item) => Number(item))
            .filter((item) => item)
        } else if (name === 'consultant') {
          this.checked = this.consultant.consultantIds
            .split(',')
            .map((item) => Number(item))
            .filter((item) => item)
        }
      })
      .finally(() => {
        uni.hideLoading()
      })
  },
  computed: {
    ...mapState('finaceReport', ['doctor', 'consultant']),
  },
  methods: {
    ...mapMutations('finaceReport', ['setDoctor', 'setConsultant']),
    loadData() {
      const { type } = this
      let position
      if (type === 'doctor') {
        position = this.$dpmsUtils.getEnums('StaffPosition')?.DOCTOR?.value || 2
      } else if (type === 'consultant') {
        position = this.$dpmsUtils.getEnums('StaffPosition')?.CONSULTANT?.value || 4
      }
      return institutionAPI
        .getStaffListByPositionFromAllInstitution({
          workStatus:
            this.$dpmsUtils.getEnums('StaffStatus')?.STAFF_STATUS_AT_WORK_NAME
              ?.value || 1,
          position,
        })
        .then((res) => {
          console.log('res', res)
          this.list = res.data
        })
    },
    onSave() {
      const { type } = this
      const value = {}
      const ids = this.checked.join(',')
      const names = this.list
        .filter((item) => this.checked.includes(item.staffId))
        .map((item) => item.staffName)
        .join(',')
      if (type === 'doctor') {
        value.doctorIds = ids
        value.doctorNames = names
        this.setDoctor(value)
      } else if (type === 'consultant') {
        value.consultantIds = ids
        value.consultantNames = names
        this.setConsultant(value)
      }

      this.$dpmsUtils.back()
    },
  },
}
</script>

<style lang="scss" scoped>
.ach_staffList {
  height: 100%;

  .apptCollapse {
    padding-left: 32rpx;

    .appt {
      height: 112rpx;
      line-height: 112rpx;
      border-top: 1rpx solid rgba($color: #000000, $alpha: 0.15);
      color: rgba($color: #000000, $alpha: 0.9);
      font-size: 34rpx;

      &.first {
        border-top: none;
      }
    }
  }

  .line {
    width: 100%;
    height: 2rpx;
    background: #e5e5e5;
    margin-top: 24rpx;
    margin-bottom: 24rpx;
  }
}
</style>
