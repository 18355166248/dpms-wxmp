<template>
  <view class="content">
    <view v-if="type === 'genderData'" class="tit">新增患者性别分布</view>
    <view v-else-if="type === 'registerData'" class="tit">到诊类型分布</view>
    <view v-else-if="type === 'doctorData'" class="tit">医生收款分布</view>
    <view v-else-if="type === 'projectData'" class="tit">诊疗项目收款</view>
    <view class="count">
      <view v-if="time === '1'">昨天</view>
      <view v-else-if="time === '7'">近七天</view>
      <view v-else-if="time === '30'">近30天</view>
      <view>
        <text>总计 </text>
        <text
          class="num"
          v-if="type === 'genderData' || type === 'registerData'"
          >{{ total }}人</text
        >
        <text v-else>{{ $utils.formatPrice(total) }}</text>
      </view>
    </view>
    <t-table>
      <t-tr class="t-tr" v-for="(item, i) in tableList" :key="i">
        <t-td>{{ item.name }}</t-td>
        <t-td v-if="type === 'genderData' || type === 'registerData'"
          >{{ item.data }}人</t-td
        >
        <t-td v-else>{{ $utils.formatPrice(item.data) }}</t-td>
        <t-td>{{ Math.round((item.data / total) * 100) }}%</t-td>
      </t-tr>
    </t-table>
  </view>
</template>

<script>
import tTable from '@/components/t-table/t-table.vue'
import tTr from '@/components/t-table/t-tr.vue'
import tTd from '@/components/t-table/t-td.vue'
import { getStorage } from '@/utils/storage'

export default {
  components: {
    tTable,
    tTr,
    tTd,
  },
  data() {
    return {
      type: '',
      time: '',
      tableList: [],
    }
  },
  onLoad(params) {
    this.type = params.type
    this.time = params.time
    this.tableList = getStorage('statistics_detail').map((v) =>
      _.pick(v, ['name', 'data']),
    )
    console.log(this.tableList)
  },
  computed: {
    total() {
      return this.tableList.reduce((acc, val) => acc + val.data, 0)
    },
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.content {
  padding: 32rpx;
  background-color: #fff;
  .tit {
    margin-bottom: 20rpx;
  }
  .count {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32rpx;
    font-size: 28rpx;
    color: rgba(0, 0, 0, 0.5);
    .num {
      font-size: 34rpx;
      color: rgba(0, 0, 0, 0.7);
    }
  }
  .t-tr {
    background: none !important;
  }
}
</style>
