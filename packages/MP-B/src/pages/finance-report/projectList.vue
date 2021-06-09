<template>
  <div class="ach_projectList">
    <dpmsCheckboxGroup v-model="checked" v-if="list && list.length">
      <div class="apptCollapse">
        <div
          v-for="item in list"
          :key="item.settingsChargeTypeId"
          style="margin-top: 24rpx;"
        >
          <dpmsCheckbox shape="square" :label="item.settingsChargeTypeId">
            {{ item.settingsChargeTypeName }}
          </dpmsCheckbox>
          <div class="line"></div>
        </div>
      </div>
    </dpmsCheckboxGroup>
    <empty :disabled="true" text="暂无项目" v-if="list.length === 0" />
    <fixed-footer bgColor="#F5F5F5">
      <div class="mt-56">
        <dpmsButton @click="onSave" v-if="list && list.length" />
      </div>
    </fixed-footer>
  </div>
</template>

<script>
import empty from '@/components/empty/empty.vue'
import { mapMutations, mapState } from 'vuex'
import billAPI from 'APIS/bill/bill.api'

export default {
  components: {
    empty,
  },
  data() {
    return {
      list: [],
      checked: [],
    }
  },
  onLoad() {
    uni.showLoading({
      title: '数据加载中',
      mask: true,
    })
    this.getProject()
      .then(() => {
        this.checked = this.parentChargeType.parentChargeTypeIds
          .split(',')
          .map((item) => Number(item))
      })
      .finally(() => {
        uni.hideLoading()
      })
  },
  computed: {
    ...mapState('finaceReport', ['parentChargeType']),
  },
  methods: {
    ...mapMutations('finaceReport', ['setParentChargeType']),
    onSave() {
      const value = {
        parentChargeTypeIds: this.checked.join(','),
        parentChargeTypeNames: this.list
          .filter((item) => this.checked.includes(item.settingsChargeTypeId))
          .map((item) => item.settingsChargeTypeName)
          .join(','),
      }
      this.setParentChargeType(value)
      this.$utils.back()
    },
    getProject() {
      return billAPI.chargeTypeParentList().then((res) => {
        const { data } = res
        this.list = data
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.ach_projectList {
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
