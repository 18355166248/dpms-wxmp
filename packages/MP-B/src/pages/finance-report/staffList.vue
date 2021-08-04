<template>
  <div class="ach_staffList">
    <dpmsCheckboxGroup v-model="checked" v-if="list && list.length">
      <div class="apptCollapse">
        <div
          v-for="(item, index) in list"
          :key="index"
          style="margin-top: 24rpx;"
        >
          <dpmsCheckbox shape="square" :label="item.staffId || item.value">
            {{ item.staffName || item.zh_CN }}
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
    if (name === 'billType') {
      this.list = Object.values(
        this.$dpmsUtils.getEnums('BillSupperType').properties,
      )
      this.checked = this.billTypeArr.billTypeIds
        .split(',')
        .map((item) => Number(item))
        .filter((item) => item)
      uni.hideLoading()
      return
    }
    if (name === 'billSettlement') {
      this.list = Object.values(
        this.$dpmsUtils.getEnums('BillSettlement').properties,
      )
      if (this.billSettlementArr.billSettlementIds !== '') {
        this.checked = this.billSettlementArr.billSettlementIds
          .split(',')
          .map((item) => Number(item))
      }
      uni.hideLoading()
      return
    }
    if (name === 'payTradeType') {
      this.list = Object.values(
        this.$dpmsUtils.getEnums('PayTradeType').properties,
      )?.filter((item) => item.value !== 1)
      //兼容PC端ID为7是修改枚举名字为卡券售卖
      this.list?.forEach((item) => {
        if (item.value === 7) {
          item.zh_CN = '卡券售卖'
        }
      })
      console.log(this.list, '9990')
      //与PC端同步不显示未知类型
      if (this.payTradeTypeArr.payTradeTypeIds !== '') {
        this.checked = this.payTradeTypeArr.payTradeTypeIds
          .split(',')
          .map((item) => Number(item))
      }
      uni.hideLoading()
      return
    }
    if (name === 'payOrderStatus') {
      this.list = Object.values(
        this.$dpmsUtils.getEnums('PayOrderStatus').properties,
      )?.filter((item) => [1, 3].includes(item.value))
      //其中[1,3]是PC端交易状态只显示正常和已作废
      if (this.payOrderStatusArr.payOrderStatusIds !== '') {
        this.checked = this.payOrderStatusArr.payOrderStatusIds
          .split(',')
          .map((item) => Number(item))
      }
      uni.hideLoading()
      return
    }
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
        } else if (name === 'cashierStaff') {
          this.checked = this.cashierStaff.cashierStaffIds
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
    ...mapState('finaceReport', [
      'doctor',
      'consultant',
      'billTypeArr',
      'billSettlementArr',
      'cashierStaff',
      'payTradeTypeArr',
      'payOrderStatusArr',
    ]),
  },
  methods: {
    ...mapMutations('finaceReport', [
      'setDoctor',
      'setConsultant',
      'setBillTypeArr',
      'setBillSettlementArr',
      'setCashierStaff',
      'setPayTradeTypeArr',
      'setPayOrderStatusArr',
    ]),
    loadData() {
      const { type } = this
      if (type === 'cashierStaff') {
        return institutionAPI.getWorkList().then((res) => {
          this.list = res.data
        })
      }
      let position
      if (type === 'doctor') {
        position = this.$dpmsUtils.getEnums('StaffPosition')?.DOCTOR?.value || 2
      } else if (type === 'consultant') {
        position =
          this.$dpmsUtils.getEnums('StaffPosition')?.CONSULTANT?.value || 4
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
        .filter((item) => this.checked.includes(item.staffId || item.value))
        .map((item) => item.staffName || item.zh_CN)
        .join(',')
      value[`${type}Ids`] = ids
      value[`${type}Names`] = names
      switch (type) {
        case 'doctor':
          this.setDoctor(value)
          break
        case 'consultant':
          this.setConsultant(value)
          break
        case 'billType':
          this.setBillTypeArr(value)
          break
        case 'billSettlement':
          this.setBillSettlementArr(value)
          break
        case 'cashierStaff':
          this.setCashierStaff(value)
          break
        case 'payTradeType':
          this.setPayTradeTypeArr(value)
          break
        case 'payOrderStatus':
          this.setPayOrderStatusArr(value)
          break
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
    padding-bottom: 55rpx;
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
