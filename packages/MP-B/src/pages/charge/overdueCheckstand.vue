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
        @blur="onReceivableAmountChange($event)"
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
        v-for="item in form.payChannelList"
        :key="item.transactionChannelId"
        type="digit"
        :title="`${item.transactionChannelName}(￥)`"
        v-model="item.paymentAmount"
        @blur="onPayTypeInputChange($event, item)"
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
      </chargestand-title>
      <!--展开部分-->
      <template>
        <dpmsCell title="收费时间" :value="form.cashierTime" disabled />
        <dpmsCell title="收费人" :value="form.staffName" disabled />
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
          <div class="amount-wrap">
            <span class="black-big-font padding-r">实收:</span
            ><span class="red-color">{{
              paidAmount | thousandFormatter(2, '￥')
            }}</span>
          </div>
        </div>
        <div class="btn-wrapper">
          <button class="ghost-save-btn" @click="sureCharge('save')">
            保存
          </button>
          <button class="save-btn" @click="sureCharge('free')">欠费免单</button>
          <button class="charge-btn" @click="sureCharge('submit')">确定</button>
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
        <!-- 积分-->
        <template v-if="item.payStyle === 12 && integralToAmount >= 0"
          >&nbsp; &nbsp;(可抵现{{ integralToAmount | thousandFormatter }})
        </template>
        <!-- 储值卡和馈赠金相关 -->
        <template v-if="item.balance >= 0 && item.payStyle !== 12"
          >&nbsp; &nbsp;(余额{{ item.balance | thousandFormatter }})
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
    <!-- 审批弹框-->
    <approveModal
      @confirm="approveConfirm"
      ref="approveModalRef"
    ></approveModal>
  </view>
</template>
<script>
import ChargestandTitle from '@/pages/charge/common/checkstandstandTitle'
import inputMixins from 'mpcommon/mixins/inputMixins'
import billAPI from '@/APIS/bill/bill.api'
import moment from 'moment'
import { mapMutations, mapState } from 'vuex'
import { BigCalculate, changeTwoDecimal } from '@/utils/utils'
import payResult from './common/payResult'
import approveModal from './common/approveModal'

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
    payResult,
    approveModal,
  },
  computed: {
    ...mapState('workbenchStore', ['menu']),
    ...mapState('overdue', ['overdueList', 'overdueAmount']),
    ...mapState('patient', [
      'patientDetail',
      'memberDetail',
      'mainDiscountLimit',
    ]),
    ...mapState('checkstand', ['billType']),
    //积分转金额
    integralToAmount() {
      const currentPoints =
        this.memberDetail?.memberDetailResponse?.currentPoints || 0
      const perForCash = this.memberDetail?.perForCash || 1

      return BigCalculate(currentPoints, '/', perForCash)
    },
  },
  /**
   * 通过判断option中是否含有billOrderId这个参数
   * 来区分是从待处理页面跳转还是收欠费列表页面跳转过来的
   * 待处理页面跳转则会携带billOrderId参数
   */
  onLoad(option) {
    this.staffData = uni.getStorageSync('staff')
    this.form.staffName = this.staffData.staffName
    if (option.billOrderId) {
      // 待处理账单页面跳转携带的参数进行回显
      this.pendingBill(option, () => {
        this.paidAmount = this.overdueAmount
        this.loadListData(option.billOrderId)
      })
    } else {
      this.form.receivableAmount = this.overdueAmount
      this.paidAmount = this.overdueAmount
      this.loadListData()
    }
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
    /**
     * 待处理页面数据获取并回显
     */
    pendingBill(option, callback) {
      billAPI
        .getPendingOverdueBills({
          billDebtId: option.billOrderId,
        })
        .then((res) => {
          const data = res.data
          this.setOverdueAmount(data?.billOrderVOList[0]?.debtAmount)
          this.setOverdueList(data?.billOrderVOList)
          this.form.payChannelList = data?.payChannelList
          this.form.memo = data?.memo
          this.form.debtDiscount = data.debtDiscount
          this.form.receivableAmount = data.receivableAmount
          callback && callback()
        })
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
          payStyle: item.payStyle,
        }))
      this.form.payChannelList[0].paymentAmount = this.form.receivableAmount
      this.showActionSheet = false
    },
    //支付方式监听
    onPayTypeInputChange(value, record) {
      if (!value) {
        value = 0
      } else if (value > 9999999.99) {
        value = 9999999.99
      }
      if (record.balance >= 0) {
        if (value > record.balance) {
          value = record.balance
          this.$refs.uToast.show({
            title: `不能超过${record.transactionChannelName}余额`,
            type: 'warning',
          })
        }
      }
      if (record.payStyle === 12) {
        if (value > this.integralToAmount) {
          value = this.integralToAmount
          this.$refs.uToast.show({
            title: `不能超过当前积分可抵现金额`,
            type: 'warning',
          })
        }
      }

      record.paymentAmount = Number(value)
      this.errTipText = ''
      this.checkPaidAmount()
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
        this.form.debtDiscount = '-'
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
        this.form.receivableAmount = '-'
      }
      if (value > this.overdueAmount) {
        this.form.receivableAmount = this.overdueAmount + ''
      } else {
        this.form.receivableAmount = Number(value)
      }
      this.$nextTick(() => {
        this.form.receivableAmount = changeTwoDecimal(
          this.form.receivableAmount,
          2,
        )
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
    loadListData(option) {
      billAPI
        .getPayTransactionChannel({
          memberId: this.patientDetail?.memberId,
          enabled: true,
          customerId: this.patientDetail?.customerId,
        })
        .then((res) => {
          if (res?.data.length > 0) {
            if (this.billType === 3) {
              res.data = res.data.filter(
                (item) => item.payStyle !== 8 && item.payStyle !== 9,
              )
            }
            res.data.forEach((item, index) => {
              item.checked = false
              if (index === 0) {
                item.checked = true
                // 若是待处理页面跳转来则不用进行支付列表初始化
                !option &&
                  (this.form.payChannelList = [
                    {
                      paymentAmount: this.form.receivableAmount,
                      transactionChannelId:
                        item.settingsPayTransactionChannelId,
                      transactionChannelName:
                        item.settingsPayTransactionChannelName,
                      balance: item.balance,
                    },
                  ])
              }
            })

            this.payTypes = res.data.filter((payItem) => {
              return payItem.isShow && payItem.payStyle !== 13
            })
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
              payStyle: item.payStyle,
            },
          ]
        }
      })
    },
    //确认收费
    sureCharge(type) {
      if (type !== 'free' && this.form.debtDiscount < this.mainDiscountLimit) {
        this.$refs.uToast.show({
          title: `您能设置的整单折扣不能低于${this.mainDiscountLimit}%`,
          type: 'warning',
        })
        this.form.debtDiscount = this.mainDiscountLimit
        this.onDebtDiscountChange(this.mainDiscountLimit)
        return
      }
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
      _data.receivableAmount = this.form.receivableAmount
      _data.payChannelList = this.form.payChannelList
      _data.salesVOList = []
      _data.isDebtFreeOrder = type === 'free'
      // 用于PC端医生、护士反显
      if (this.overdueList.length > 0) {
        this.overdueList.forEach((val) => {
          if (val.orderItemVOList && val.orderItemVOList.length > 0) {
            val.orderItemVOList.forEach((valA) => {
              if (valA.salesVOList && valA.salesVOList.length > 0) {
                const temp = valA.salesVOList.map((valB) => {
                  return {
                    billOrderItemId: valB.billOrderItemId,
                    salesId: valB.salesId,
                    salesType: valB.salesType,
                  }
                })
                _data.salesVOList = _data.salesVOList.concat(temp)
              }
            })
          }
        })
      }

      if (type === 'free') {
        _data.debtDiscount = 0
        _data.receivableAmount = 0
        _data.payChannelList.forEach((item) => {
          item.paymentAmount = 0
        })
      }
      if (type === 'free' || type === 'submit') {
        billAPI
          .payDebt(_data)
          .then((res) => {
            this.submitLock = false
            if (res.code === 0 && res.data) {
              this.$refs.payResultRef.open(res.data)
            } else if ([1000373, 1000377].includes(code)) {
              try {
                const errData = JSON.parse(message)
                // 发起审核
                if (code === 1000373) {
                  //  打开审批弹框
                  this.$refs.approveModalRef.open(errData, params)
                } else {
                  //发起失败  给出错误提示
                  this.$refs.uToast.show({
                    title: errData?.approveReason || '审批发起失败',
                    type: 'error',
                  })
                }
              } catch (err) {
                console.log(123, err)
              }
            }
          })
          .catch((err) => {
            this.submitLock = false
            console.log(err.message)
          })
      }
      if (type === 'save') {
        billAPI
          .saveOrUpdateOverdue(_data)
          .then((res) => {
            this.submitLock = false
            if (res.code === 0) {
              uni.reLaunch({
                url: `/pages/charge/chargeForm?tab=1&patientId=${this.patientDetail.patientId}`,
              })
              uni.showToast({
                icon: 'none',
                title: '保存成功',
              })
            } else {
              if (code === 1001190) {
                this.form.debtDiscount = this.mainDiscountLimit
                this.onDebtDiscountChange(this.mainDiscountLimit)
              }
              this.$refs.uToast.show({
                title: res.message,
                type: 'error',
              })
            }
          })
          .catch((err) => {
            this.submitLock = false
            console.log(err.message)
          })
      }
    },

    approveConfirm() {
      uni.reLaunch({
        url: `/pages/charge/chargeForm?tab=1&patientId=${this.patientDetail.patientId}`,
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
      flex-direction: column;
      align-content: space-between;
      width: 100%;
    }
    .left-wrap {
      padding: 22rpx 0;
      display: flex;
      justify-content: space-between;

      .margin-r {
        margin-right: 24rpx;
        height: 32rpx;
        line-height: 32rpx;
        font-size: 24rpx;
      }

      .padding-r {
        padding-right: 10rpx;
      }

      .amount-wrap {
        color: #191919;
        display: flex;

        .black-big-font {
          height: 36rpx;
          line-height: 36rpx;
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
          height: 36rpx;
          line-height: 36rpx;
          font-size: 28rpx;
          font-weight: 500;
        }
      }
    }

    .btn-wrapper {
      box-sizing: border-box;
      display: flex;
      justify-content: flex-end;
      margin-bottom: 20rpx;

      button {
        width: 120rpx;
        height: 56rpx;
        line-height: 56rpx;
        font-size: 28rpx;
        border-radius: 30rpx;
        box-sizing: border-box;
        margin: 0 0 0 16rpx;
      }

      .ghost-save-btn {
        color: #4c4c4c;
        background: #ffffff;
        border: 2rpx solid #d9d9d9;
      }

      .save-btn {
        color: #5cbb89;
        border: 2rpx solid #5cbb89;
        width: 176rpx;
        background: #fff;
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
