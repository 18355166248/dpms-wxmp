<template>
  <view class="content">
    <view v-if="type === '1'" class="tit">新增患者性别分布</view>
    <view v-else-if="type === '2'" class="tit">到诊类型分布</view>
    <view v-else-if="type === '3'" class="tit">医生收款分布</view>
    <view v-else-if="type === '4'" class="tit">诊疗项目收款</view>
    <view class="count">
      <view v-if="time === '111'">昨天</view>
      <view v-else-if="time === '222'">近七天</view>
      <view v-else-if="time === '333'">近30天</view>
      <view>
        <text>总计 </text>
        <text class="num" v-if="type === '1' || type === '2'">{{ 20 }}人</text>
        <text v-else>{{ $utils.formatPrice(2000) }}</text>
      </view>
    </view>
    <t-table>
      <t-tr class="t-tr" v-for="(item, i) in tableList" :key="i">
        <t-td v-for="(v, k) in item" :key="k">{{ v }}</t-td>
      </t-tr>
    </t-table>
  </view>
</template>

<script>
import tTable from '@/components/t-table/t-table.vue'
import tTr from '@/components/t-table/t-tr.vue'
import tTd from '@/components/t-table/t-td.vue'

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
      tableList: [
        {
          name: '张三',
          age: '19',
          hobby: '游泳',
        },
        {
          name: '李四',
          age: '21',
          hobby: '绘画',
        },
        {
          name: '王二',
          age: '29',
          hobby: '滑板',
        },
      ],
    }
  },
  onLoad(params) {
    this.type = params.type
    this.time = params.time
    console.log('params', params)
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
