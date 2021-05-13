<template>
  <view class="checkstand-wrap">
    <div class="content-wrapper">
      <!--总计金额-->
      <chargestand-title>
        <div slot="content" class="flex">
          <div
            class="iconfont icon-savings"
            style="font-size: 36rpx; margin-right: 11rpx;"
          ></div>
          <div class="ellipsis" style="width: 550rpx;">
            总计金额：
            <span>{{ overdueAmount | thousandFormatter(2, '￥') }}</span>
          </div>
        </div>
      </chargestand-title>

      <dpmsCellInput
        title="欠费折扣"
        :value="form.debtDiscount"
        type="number"
        @input="onDebtDiscountChange($event)"
      >
        <template v-slot:inputRight>
          <span class="inputRightIcon">%</span>
        </template>
      </dpmsCellInput>

      <dpmsCellInput
        title="总计应收(￥)"
        type="digit"
        :value="form.receivableAmount"
        :max="12"
        @input="onReceivableAmountChange($event)"
      />
      <!--支付方式-->
      <chargestand-title>
        <div slot="content" class="flex">
          <div
            class="iconfont icon-savings"
            style="font-size: 36rpx; margin-right: 11rpx;"
          ></div>
          <div class="ellipsis" style="width: 550rpx;">
            支付方式
          </div>
        </div>
        <div slot="extra">
          <div style="padding-left: 36rpx;" @click="showActionSheet = true">
            <span class="iconfont icon-right" style="font-size: 36rpx;"></span>
          </div>
        </div>
      </chargestand-title>
      <dpmsCellInput
        v-for="(item, index) in form.payChannelList"
        :key="item.transactionChannelId"
        type="digit"
        :title="`${item.transactionChannelName}(￥)`"
        :value="item.paymentAmount"
        @input="onPayTypeInputChange($event, item)"
        :max="12"
      />
      <!--支付金额大于应收金额的验证-->
      <div v-if="errTipText" class="validateCount">
        {{ errTipText }}
      </div>
      <!-- 开单信息-->
      <chargestand-title>
        <div slot="content" class="flex">
          <div
            class="iconfont icon-customer-management"
            style="font-size: 36rpx; margin-right: 11rpx;"
          ></div>
          <div class="ellipsis" style="width: 550rpx;">开单信息</div>
        </div>
        <div slot="extra">
          <div
            style="padding-left: 36rpx;"
            @click="toggleInfomation = !toggleInfomation"
          >
            <template v-if="toggleInfomation">
              <span class="iconfont icon-closed" style="font-size: 22rpx;" />
            </template>
            <template v-else>
              <span class="iconfont icon-open" style="font-size: 22rpx;" />
            </template>
          </div>
        </div>
      </chargestand-title>
      <!--展开部分-->
      <template v-if="toggleInfomation">
        <dpmsCell title="收费时间" :value="form.cashierTime" />
        <dpmsCell title="收费人" :value="form.staffName" />
        <dpmsCell title="备注" hideBorderBottom />
        <view class="memo">
          <textarea
            v-model="form.memo"
            auto-height
            placeholder="请输入备注"
            placeholder-style="font-size: 34rpx; font-weight: 400; color: rgba(0, 0, 0, 0.25);"
            :maxlength="150"
            @focus="bindFocus"
            @blur="closeBlur"
          />
        </view>
      </template>
    </div>
    <div class="footer-wrapper flexBt">
      <div class="bottom-content-wrap">
        <div class="left-wrap">
          <div class="amount-wrap">
            <span class="black-big-font padding-r">实收:</span
            ><span class="red-color">{{
              paidAmount | thousandFormatter(2, '￥')
            }}</span>
          </div>
          <div class="amount-wrap">
            <view class="margin-r">
              <span class="gray-font padding-r">欠费:</span>
              <span class="black-font">{{
                oweAmount | thousandFormatter(2, '￥')
              }}</span>
            </view>
            <view class="margin-r">
              <span class="gray-font padding-r">找零:</span>
              <span class="black-font">{{
                changeAmount | thousandFormatter(2, '￥')
              }}</span>
            </view>
          </div>
        </div>
        <div class="btn-wrapper">
          <button class="save-btn" @click="sureCharge('free')">欠费免单</button>
          <button class="charge-btn" @click="sureCharge">确定</button>
        </div>
      </div>
    </div>
    <!--支付方式-->
    <actionSheet
      @close="hideActionSheet"
      @sure="onSure"
      sure-text="确定"
      v-if="showActionSheet"
    >
      <view
        class="action-item"
        v-for="item in payTypes"
        :key="item.settingsPayTransactionChannelId"
      >
        {{ item.settingsPayTransactionChannelName }}
        <template v-if="item.balance"
          >&nbsp;&nbsp;(余额{{ item.balance | thousandFormatter }})
        </template>
        <dpmsCheckbox
          :disabled="checkDisableFn(item.checked)"
          shape="square"
          :value="item.checked"
          @change="payTypeChange($event, item)"
        >
        </dpmsCheckbox>
      </view>
    </actionSheet>
    <!--提示-->
    <u-toast ref="uToast" />
    <payResult ref="payResultRef" @confirm="payResultConfirm"></payResult>
  </view>
</template>
<script>
import ChargestandTitle from '@/pages/charge/common/checkstandstandTitle'
import inputMixins from 'mpcommon/mixins/inputMixins'
import billAPI from '@/APIS/bill/bill.api'
import moment from 'moment'
import actionSheet from './common/actionSheet'
import { mapMutations, mapState } from 'vuex'
import { BigCalculate, changeTwoDecimal } from '@/utils/utils'
import payResult from './common/payResult'

export default {
  name: 'checkstand',
  mixins: [inputMixins],
  data() {
    return {
      form: {
        payChannelList: [],
        cashierTime: moment(new Date().getTime()).format('YYYY-MM-DD HH:mm'),
        staffName: '',
        memo: '',
        debtDiscount: 100,
        receivableAmount: 0.0,
      },
      toggleInfomation: true,
      otherList: [],
      visitTimeList: [],
      //支付方式
      payTypes: [],
      // 操作菜单
      showActionSheet: false,
      //登录人信息
      staffData: {},
      // 实收金额
      paidAmount: 0,
      // 欠费金额
      oweAmount: 0,
      // 找零金额
      changeAmount: 0,
      //提示实付金额大于应付金额
      errTipText: '',
      //提交代码的锁
      submitLock: false,
    }
  },
  components: {
    ChargestandTitle,
    actionSheet,
    payResult,
  },
  computed: {
    ...mapState('workbenchStore', ['menu']),
    ...mapState('overdue', ['overdueList', 'overdueAmount']),
    ...mapState('patient', ['patientDetail']),
    ...mapState('checkstand', ['billType']),
  },
  onLoad() {
    this.staffData = uni.getStorageSync('staff')
    this.form.staffName = this.staffData.staffName
    this.form.receivableAmount = this.overdueAmount
    this.paidAmount = this.overdueAmount
    this.loadListData()
  },
  onShow() {},
  onHide() {},
  onUnload() {},
  methods: {
    ...mapMutations('overdue', ['setOverdueList', 'setOverdueAmount']),
    //---------------------------支付方式控制面板
    checkDisableFn(checked) {
      const hasCheck = this.payTypes.filter((item) => item.checked)
      return (
        (hasCheck.length === 1 && checked) ||
        (hasCheck.length === 3 && !checked)
      )
    },
    payTypeChange(value, record) {
      record.checked = value
    },
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
      // 更新payChannelList
      this.form.payChannelList = this.payTypes
        .filter((item) => item.checked)
        .map((item) => ({
          paymentAmount:
            payChannelAcount.get(item.settingsPayTransactionChannelId) || 0.0,
          transactionChannelId: item.settingsPayTransactionChannelId,
          transactionChannelName: item.settingsPayTransactionChannelName,
          balance: item.balance,
        }))
      this.form.payChannelList[0].paymentAmount = this.form.receivableAmount
      this.showActionSheet = false
    },
    //支付方式监听
    onPayTypeInputChange(value, item) {
      if (value === '' || value === undefined) {
        item.paymentAmount='-'
      }
      if (item.balance) {
        item.paymentAmount = value > item.balance ? item.balance + '' : Number(value)
      }else {
        item.paymentAmount=Number(value)
      }
      this.$nextTick(() => {
        item.paymentAmount = changeTwoDecimal(value,2)
        this.errTipText = ''
        this.checkPaidAmount()
      })
    },
    changePayChannel(value, record) {
      if (record.balance) {
        value = value - record.balance > 0 ? record.balance : value
      }
      record.paymentAmount = value
    },
    //校验实付金额是否大于应付金额
    checkPaidAmount() {
      this.paidAmount = this.form.payChannelList.reduce((pre, next) => {
        return BigCalculate(pre, '+', next.paymentAmount)
      }, 0)
      if (this.paidAmount > this.form.receivableAmount) {
        this.errTipText = '支付总额不能大于应收金额！'
        this.changeAmount = BigCalculate(
          this.paidAmount,
          '-',
          this.form.receivableAmount,
        )
        this.oweAmount = 0
        return false
      } else {
        this.errTipText = ''
        this.oweAmount = BigCalculate(
          this.form.receivableAmount,
          '-',
          this.paidAmount,
        )
        this.changeAmount = 0
        return true
      }
    },

    checkInputValue(value) {
      // let vStr = `${value}`
      // vStr = vStr.replace(/\b(0+)/gi, '')
      value = Number(value)
      if (isNaN(value)) {
        this.$refs.uToast.show({
          title: '请输入数字!',
          type: 'error',
        })
        return ''
      }
      const maxNumber = 999999
      if (value > maxNumber) {
        value = maxNumber + ''
      }
      return value
    },
    //------------------------支付方式控制面板
    //-----------------------总计金额、折扣、应收
    onDebtDiscountChange(value) {
      if (value === '' || value === undefined) {
        this.form.debtDiscount='-'
      }
      if (value > 100) {
        this.form.debtDiscount = '100'
      } else {
        this.form.debtDiscount = value
      }
      this.$nextTick(() => {
        this.form.debtDiscount = changeTwoDecimal(this.form.debtDiscount, 0)
        let receivableAmount = BigCalculate(
          this.overdueAmount,
          '*',
          BigCalculate(this.form.debtDiscount, '/', 100),
        )
        this.form.receivableAmount = changeTwoDecimal(receivableAmount)
        this.initPayTypes()
        this.checkPaidAmount()
      })
    },
    //应收金额
    onReceivableAmountChange(value) {
      if (value === '' || value === undefined) {
        this.form.receivableAmount='-'
      }
      if (value > this.overdueAmount) {
        this.form.receivableAmount = this.overdueAmount + ''
      } else {
        this.form.receivableAmount = Number(value)
      }
      this.$nextTick(() => {
        this.form.receivableAmount = changeTwoDecimal(this.form.receivableAmount,2)
        const debtDiscount = BigCalculate(
          BigCalculate(this.form.receivableAmount, '/', this.overdueAmount),
          '*',
          100,
        )
        this.form.debtDiscount = Math.ceil(debtDiscount)
        this.initPayTypes()
        this.checkPaidAmount()
      })
    },
    //-----------------------总计金额、折扣、应收
    //获取数据
    loadListData() {
      billAPI
        .getPayTransactionChannel({
          memberId: this.patientDetail.memberId,
          enabled: true,
        })
        .then((res) => {
          if (res?.data.length > 0) {
            if(this.billType === 3) {
              res.data = res.data.filter(item => (item.payStyle !== 8 && item.payStyle !== 9))
            }
            res.data.forEach((item, index) => {
              item.checked = false
              if (index === 0) {
                item.checked = true
                this.form.payChannelList = [
                  {
                    paymentAmount: this.form.receivableAmount,
                    transactionChannelId: item.settingsPayTransactionChannelId,
                    transactionChannelName:
                      item.settingsPayTransactionChannelName,
                    balance: item.balance,
                  },
                ]
              }
            })
            this.payTypes = res.data
          }
        })
        .catch((err) => {
          console.log(err.message)
        })
    },
    initPayTypes() {
      this.payTypes.forEach((item, index) => {
        item.checked = false
        if (index === 0) {
          item.checked = true
          this.form.payChannelList = [
            {
              paymentAmount: this.form.receivableAmount,
              transactionChannelId: item.settingsPayTransactionChannelId,
              transactionChannelName: item.settingsPayTransactionChannelName,
              balance: item.balance,
            },
          ]
        }
      })
    },
    //确认收费
    sureCharge(type) {
      if (!this.checkPaidAmount()) {
        return false
      }
      if (this.submitLock) {
        return
      }
      this.submitLock = true
      const _data = {}
      _data.billOrderVOList = this.overdueList
      _data.cashierStaffId = this.staffData.staffId
      _data.cashierStaffName = this.form.staffName
      _data.cashierTime = this.form.cashierTime
      _data.customerId = this.patientDetail.customerId
      _data.patientId = this.patientDetail.patientId
      _data.debtDiscount = this.form.debtDiscount
      _data.memo = this.form.memo
      _data.receivableAmount =this.form.receivableAmount
      _data.payChannelList = this.form.payChannelList
      _data.salesVOList = []

      if (type === 'free') {
        _data.debtDiscount = 0
        _data.receivableAmount = 0
        _data.payChannelList.forEach((item) => {
          item.paymentAmount = 0
        })
      }
      billAPI
        .payDebt(_data)
        .then((res) => {
          if (res.code === 0 && res.data) {
            this.$refs.payResultRef.open(res.data)
          }
        })
        .catch((err) => {
          console.log(err.message)
        })
    },
    //点击我知道
    payResultConfirm() {
      this.submitLock = false
      this.setOverdueList([])
      this.setOverdueAmount(0)
      uni.reLaunch({
        url: `/pages/charge/chargeForm?tab=2&patientId=${this.patientDetail.patientId}`,
      })
    },
  },
  watch: {},
}
</script>
<style lang="scss" scoped>
.action-item {
  height: 112rpx;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1rpx solid #f2f2f2;
  flex-shrink: 0;
  padding: 0 32rpx;
}

.action-item:first-child {
  border-top: none;
  border-radius: 24rpx 24rpx 0 0;
}

.checkstand-wrap {
  width: 750rpx;
  height: 100vh;
  display: flex;
  flex-direction: column;

  .content-wrapper {
    flex: 1;
    width: 100%;
    background: #f5f5f5;
    overflow-y: scroll;

    .inputRightIcon {
      color: #191919;
      margin-left: -8rpx;
    }

    .validateCount {
      width: 100%;
      height: 68rpx;
      background: #fff;
      padding: 0 32rpx;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      flex-direction: row-reverse;
      color: #fa5151;
    }

    .memo {
      width: 100%;
      padding: 0 32px 32rpx 32rpx;
      margin-top: -20rpx;
      background-color: #fff;
      color: #191919;
      font-size: 30rpx;
      box-sizing: border-box;

      textarea {
        width: 100%;
      }
    }
  }

  .footer-wrapper {
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    display: flex;
    background: #fff;

    .bottom-content-wrap {
      padding: 0 32rpx;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }
    .left-wrap {
      padding: 10rpx 0;

      .margin-r {
        margin-right: 32rpx;
      }

      .padding-r {
        padding-right: 10rpx;
      }

      .amount-wrap {
        color: #191919;
        display: flex;
        font-size: 22rpx;

        .black-big-font {
          font-size: 28rpx;
          color: #191919;
        }

        .gray-font {
          color: #4c4c4c;
        }

        .black-font {
          color: #191919;
        }

        .red-color {
          color: #fa5151;
          font-size: 28rpx;
          font-weight: 500;
        }
      }
    }

    .btn-wrapper {
      box-sizing: border-box;
      display: flex;
      padding: 16rpx 0;

      button {
        width: 120rpx;
        height: 56rpx;
        line-height: 56rpx;
        font-size: 28rpx;
        border-radius: 30rpx;
        box-sizing: border-box;
      }

      .save-btn {
        color: #5cbb89;
        border: 2rpx solid #5cbb89;
        width: 176rpx;
      }

      .charge-btn {
        color: #fff;
        background: #5cbb89;
        margin-left: 16rpx;
      }
    }
  }
}
</style>
