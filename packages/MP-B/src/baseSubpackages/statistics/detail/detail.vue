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
        <text v-else>{{ $dpmsUtils.formatPrice(total) }}</text>
      </view>
    </view>
    <t-table border-color="#d9d9d9">
      <t-tr class="t-tr" v-for="(item, i) in tableList" align="right" :key="i">
        <t-td align="left">{{ item.name }}</t-td>
        <t-td v-if="type === 'genderData' || type === 'registerData'"
          >{{ item.data }}人</t-td
        >
        <t-td v-else>{{ $dpmsUtils.formatPrice(item.data) }}</t-td>
        <t-td>{{ ((item.data / total) * 100) | numFilter }}</t-td>
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
  filters: {
    numFilter(txt) {
      if (Number.isInteger(txt)) {
        return txt.toFixed() + '%'
      }
      return txt.toFixed(2) + '%'
    },
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
    /deep/ .t-td {
      color: rgba(0, 0, 0, 0.9);
      padding: 32rpx 30rpx;
    }
  }
}
</style>
