<template>
  <u-modal
    v-model="show"
    :show-title="false"
    confirm-text="我知道了"
    confirm-color="#5CBB89"
    @confirm="onConfirm"
  >
    <view class="slot-content" v-if="payResult.length > 0">
      <view class="item" v-for="(item, index) in payResult" :key="index">
        <view class="amount-wrap">
          <view class="type-name">{{ item.transactionChannelName }}</view>
          <view class="amount"
            >{{ item.paymentAmount | thousandFormatter(2, '￥') }}
          </view>
        </view>
        <view :style="{ color: payStatusDic[`${item.payStatus}`].color }">
          {{ payStatusDic[`${item.payStatus}`].text }}
        </view>
      </view>
    </view>
  </u-modal>
</template>
<script>
import billAPI from '@/APIS/bill/bill.api'
function checkAllStatus(list) {
  return list.some((item) => {
    return item.payStatus === 1 || item.payStatus === 2
  })
}
export default {
  name: '',
  data() {
    return {
      show: false,
      payResult: [],
      payStatusDic: {
        '0': {
          text: '未支付',
          color: '#FAAD14',
        },
        '1': {
          text: '支付中',
          color: '#FAAD14',
        },
        '2': {
          text: '部分支付',
          color: '#5CBB89',
        },
        '3': {
          text: '支付完成',
          color: '#5CBB89',
        },
        '4': {
          text: '作废',
          color: '#FA5151',
        },
        '5': {
          text: '支付失败',
          color: '#FA5151',
        },
        '-1': {
          text: '未知',
          color: '#FA5151',
        },
      },
    }
  },
  methods: {
    open(orderNo) {
      billAPI
        .getPayChannelResult({ payBatchNo: orderNo })
        .then((res) => {
          const paySerialNos = res?.data?.map((item) => item.paySerialNo).join()
          this.getResult(paySerialNos, res.data)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getResult(paySerialNos, list) {
      billAPI
        .getResultBySerialNoList({ paySerialNos: paySerialNos })
        .then((res) => {
          console.log(res)
          if (res.data) {
            if (checkAllStatus(res.data)) {
              this.getResult(paySerialNos, list)
            } else {
              this.payResult = list
              this.show = true
            }
          }
        })
    },
    onConfirm() {
      this.$emit('confirm')
    },
  },
  components: {},
}
</script>
<style lang="scss" scoped>
//
.slot-content {
  padding: 48rpx;
  border-bottom: 1rpx solid #e5e5e5;

  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 32rpx;

    .amount-wrap {
      display: flex;
      font-size: 34rpx;
      color: #191919;

      .type-name {
        color: #595959;
        width: 150rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        padding-right: 60rpx;
      }

      .amount {
        color: #191919;
        font-weight: 500;
      }
    }
  }

  .item:last-child {
    padding-bottom: 0;
  }
}
</style>
