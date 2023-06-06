<template>
  <div class="apptComplaintList">
    <dpmsCheckboxGroup v-model="checked" v-if="list && list.length">
      <div class="apptCollapse">
        <div v-for="item in list" :key="item.id" style="margin-top: 24rpx;">
          <dpmsCheckbox shape="square" :label="item.id">{{
            item.content
          }}</dpmsCheckbox>
          <div class="line"></div>
        </div>
      </div>
    </dpmsCheckboxGroup>
    <empty :disabled="true" text="暂无主诉" v-if="list.length === 0" />
    <fixed-footer bgColor="#F5F5F5">
      <div class="mt-56">
        <dpmsButton @click="onSave" v-if="list && list.length" />
      </div>
    </fixed-footer>
  </div>
</template>

<script>
import empty from '@/components/empty/empty.vue'
import diagnosisAPI from 'APIS/diagnosis/diagnosis.api'

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
  onLoad({ checked }) {
    if (checked) {
      this.checked = checked.split(',').map((v) => Number(v))
    }
  },
  created() {
    this.getMainComplaint()
  },
  methods: {
    onSave() {
      uni.$emit(
        'patientMainComplaintIds',
        this.checked.map((ele) => Number(ele)),
        this.list,
      )
      this.$dpmsUtils.back()
    },
    async getMainComplaint() {
      uni.showLoading({
        title: '数据加载中',
        mask: true,
      })
      const res = await diagnosisAPI.getMainComplaint()
      this.list = res.data || []
      uni.hideLoading()
    },
  },
}
</script>

<style lang="scss" scoped>
.apptComplaintList {
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
