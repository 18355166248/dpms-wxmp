import { BigCalculate } from '@/utils/utils';
import { mapState } from 'vuex';

const payTypeMixin = {
  data() {
    return {
      //支付方式
      payTypes: [],
      showActionSheet:false,
    }
  },
  computed: {
    ...mapState('dispose', [
      'receivableAmount',
    ]),
    changeAmount() {
      const { paidAmount, receivableAmount } = this
      return paidAmount > receivableAmount
        ? BigCalculate(paidAmount, '-', receivableAmount)
        : 0
    },
  },
  methods: {
    hideActionSheet() {
      // 重制payChannelList
      const selectKeys = this.form.payChannelList.map(
        (item) => item.transactionChannelId,
      )
      this.payTypes = this.payTypes.map((item) => {
        item.checked = selectKeys.includes(item.settingsPayTransactionChannelId)
        return item
      })
      this.showActionSheet = false
    },
    onSure() {
      // 更新payChannelList
      let payChannelAcount = new Map()
      this.form.payChannelList.forEach((item) => {
        payChannelAcount.set(item.transactionChannelId, item.paymentAmount)
      })
      this.form.payChannelList = this.payTypes
      .filter((item) => item.checked)
      .map((item) => ({
        paymentAmount:
          payChannelAcount.get(item.settingsPayTransactionChannelId) || 0,
        transactionChannelId: item.settingsPayTransactionChannelId,
        transactionChannelName: item.settingsPayTransactionChannelName,
        balance: item.balance,
      }))
      this.showActionSheet = false
    },
    changePayChannel(value, record) {
      if (!value) {
        value = 0
      } else if (value > 9999999.99) {
        value = 9999999.99
      }
      if (record.balance) {
        value = value - record.balance > 0 ? record.balance : value
      }
      record.paymentAmount = value
    },
  }
}

export {payTypeMixin}
