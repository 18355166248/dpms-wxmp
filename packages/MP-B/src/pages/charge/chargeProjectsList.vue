<template>
  <div class="charge-projects-list-wrapper">
    <div class="content-wrapper">
      <div class="info flex-v-center">
        <span
          class="iconfont icon-warning-circle"
          style="margin-right: 10rpx;"
        />
        <span style="font-size: 26rpx;">如需使用折扣，可手动调整金额</span>
      </div>
      <div
        v-for="(item, index) in disposeList"
        :key="item.itemCode"
        @longtap="removeDisposeItem(item)"
        class="disposal-item flex-column"
      >
        <div class="row-1 flex-h-between">
          <div class="item-name ellipsis2">{{ item.itemName }}</div>
          <div class="action">
            <div class="flex">
              <div class="edit-price" style="flex: 1;">
                ¥{{ item.unitAmount }}
              </div>
              <div
                @click="onEditPirce(item)"
                v-if="btnPremisstion('changes_unit_price')"
                class="iconfont icon-edit edit-icon-style"
              />
            </div>
            <div class="flex-h-end">
              <div style="margin-top: 10rpx;">
                <uni-number-box
                  :max="9999"
                  v-model="item.itemNum"
                  @input="onChangeItem($event, item)"
                  @blur="onBlurItem($event, item)"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="row-2 flex-v-center">
          是否整单折扣: {{ item.allBillDiscount ? '是' : '否' }}
        </div>
      </div>
      <dpmsCellInput
        :disabledProps="
          !(btnPremisstion('modify_whole_order_discount') && hasDiscountItem)
        "
        title="整单折扣"
        :value="mainOrderDiscount"
        @input="onMainOrderDiscount"
        type="number"
      >
        <div slot="inputRight">
          %
        </div>
      </dpmsCellInput>
      <dpmsCellInput
        :disabledProps="
          !(btnPremisstion('modify_discount_amount') && hasDiscountItem)
        "
        title="折后金额(¥)"
        :value="receivableAmount"
        @input="onReceivableAmount"
        type="digit"
      />
    </div>
    <div class="footer-wrapper flex-center">
      <div class="btns">
        <button @click="onNextStep" class="submit-btn flex-center">
          下一步
        </button>
      </div>
    </div>
    <u-toast ref="uToast" />
    <u-modal v-model="showEditPrice" confirm-color='#5CBB89' @confirm="confirmPrice" title="请输入单价">
      <view class="slot-content">
        <dpmsCellInput
          title="单价(¥)"
          :value="activeRecord.unitAmount"
          @input="onEditAmount"
          type="digit"
        />
      </view>
    </u-modal>
  </div>
</template>
<script>
import { BigCalculate, changeTwoDecimal } from '@/utils/utils'
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'chargeProjectsList',
  data() {
    return {
      mainOrderDiscount: 100,
      showEditPrice: false,
      activeRecord: {},
    }
  },
  onShow() {
    if (!this.receivableAmount) {
      // 如果没有receivableAmount，需要计算
      this.calculateAmount()
    }
  },
  computed: {
    ...mapState('dispose', ['disposeList', 'receivableAmount']),
    hasDiscountItem() {
      return this.disposeList.some((item) => item.allBillDiscount)
    },
    maxPrice() {
      let result = 0
      this.disposeList.forEach((item) => {
        const value = BigCalculate(item.unitAmount, '*', item.itemNum)
        result = BigCalculate(result, '+', value)
      })
      return changeTwoDecimal(result)
    },
    minPrice() {
      let result = 0
      this.disposeList
        .filter((item) => !item.allBillDiscount)
        .forEach((item) => {
          const value = BigCalculate(item.unitAmount, '*', item.itemNum)
          result = BigCalculate(result, '+', value)
        })
      return changeTwoDecimal(result)
    },
    discountMaxValue() {
      const { maxPrice, minPrice } = this
      return BigCalculate(maxPrice, '-', minPrice)
    },
  },
  watch: {
    // 通过折扣计算优惠金额
    mainOrderDiscount(nv, ov) {
      let result = 0
      this.setRealMainOrderDiscount(nv)
      const { discountMaxValue, receivableAmount, maxPrice } = this
      const _discount = BigCalculate(nv, '/', 100)
      const discount = BigCalculate(1, '-', _discount)
      let val = BigCalculate(discountMaxValue, '*', discount)

      // 如果通过折扣计算与手动填写折后金额有误差（折扣精度较低产生的问题）取手动你填写的值来计算
      let cusVal = BigCalculate(maxPrice, '-', receivableAmount)
      result = cusVal !== val ? cusVal : val
      this.setRealDiscountPromotionAmount(result)
    },
  },
  methods: {
    ...mapMutations('dispose', [
      'setDisposeList',
      'setReceivableAmount',
      'setRealMainOrderDiscount',
      'setRealDiscountPromotionAmount',
    ]),
    onNextStep() {
      // 保存vuex并跳转
      if (this.disposeList.length === 0) {
        this.$refs.uToast.show({
          title: '账单明细不能为空',
          type: 'warning',
        })
        return
      }
      this.setDisposeList([...this.disposeList])
      this.setReceivableAmount(this.receivableAmount)
      uni.navigateTo({
        url: '/pages/charge/checkstand',
      })
    },
    onEditPirce(record) {
      this.showEditPrice = true
      this.activeRecord = record
      this.tempValue = record.unitAmount
    },
    onEditAmount(v) {
      if (v <= 0) {
        v = 0
      } else if (v > 9999999.99) {
        v = 9999999.99
      }
      this.tempValue = changeTwoDecimal(v)
    },
    confirmPrice() {
      // 修改单价，同时修改totalAmount
      let record = this.activeRecord
      record.unitAmount = this.tempValue
      record.totalAmount = BigCalculate(record.itemNum, '*', record.unitAmount)
      this.activeRecord = {}
      this.calculateAmount()
    },
    calculateAmount() {
      let result = 0
      this.disposeList.forEach((item) => {
        if (item.allBillDiscount) {
          const value = BigCalculate(item.unitAmount, '*', item.itemNum)
          const disCount = BigCalculate(this.mainOrderDiscount, '/', 100)
          const disCountValue = BigCalculate(value, '*', disCount)
          result = BigCalculate(result, '+', disCountValue)
        } else {
          const value = BigCalculate(item.unitAmount, '*', item.itemNum)
          result = BigCalculate(result, '+', value)
        }
      })

      this.setReceivableAmount(changeTwoDecimal(result))
    },
    calculateDiscount() {
      const { minPrice, discountMaxValue, receivableAmount } = this
      const discountValue = BigCalculate(receivableAmount, '-', minPrice)
      this.mainOrderDiscount = Math.ceil(
        (discountValue / discountMaxValue) * 100,
      )
    },
    removeDisposeItem(record) {
      uni.showModal({
        title: '确定删除该项目吗？',
        success: (res) => {
          if (res.confirm) {
            this.setDisposeList(
              this.disposeList.filter(
                (item) => item.itemCode !== record.itemCode,
              ),
            )
            this.calculateAmount()
          }
        },
      })
    },
    onBlurItem(v, record) {
      const value = v.target.value
      if (value === '') {
        record.itemNum = 0
        record.totalAmount = record.unitAmount
        this.$nextTick(() => {
          record.itemNum = 1
          record.totalAmount = record.unitAmount
          this.calculateAmount()
        })
      }
    },
    onChangeItem(v, record) {
      record.totalAmount = BigCalculate(v, '*', record.unitAmount)
      if (v === 0) {
        uni.showModal({
          title: '确定删除该项目吗?',
          success: (res) => {
            if (res.confirm) {
              this.setDisposeList(
                this.disposeList.filter(
                  (item) => item.itemCode !== record.itemCode,
                ),
              )
              this.calculateAmount()
            } else if (res.cancel) {
              record.itemNum = 1
              record.totalAmount = record.unitAmount
              this.calculateAmount()
            }
          },
        })
      } else {
        this.calculateAmount()
      }
    },

    filterDiscount(v) {
      if (!v) v = 0
      // 处理数字回显范围0~100
      let vStr = `${v}`
      vStr = vStr.replace(/\b(0+)/gi, '')
      const vNum = Math.ceil(Number(vStr))
      return vNum
    },

    onMainOrderDiscount(v) {
      const vNum = this.filterDiscount(v)
      if (vNum > 100) {
        // 不这么操作页面不更新
        this.mainOrderDiscount = ''
        this.$nextTick(() => {
          this.mainOrderDiscount = 100
          this.calculateAmount()
        })
      } else if (!vNum) {
        this.mainOrderDiscount = 100
        this.$nextTick(() => {
          this.mainOrderDiscount = 0
          this.calculateAmount()
        })
      } else {
        this.mainOrderDiscount = vNum
      }

      // 计算折后金额
      this.calculateAmount()
    },

    // onBlurDiscount(v) {
    //   const { minPrice } = this
    //   if (v === '') {
    //     this.setReceivableAmount('-')
    //     this.$nextTick(() => {
    //       this.setReceivableAmount(changeTwoDecimal(minPrice))
    //     })
    //   }
    // },

    onReceivableAmount(v) {
      const value = changeTwoDecimal(v)
      const { maxPrice, minPrice } = this
      // 判断范围,uniapp的坑所以必须这么写才能保证每次修改能正确的验证
      if (value < minPrice) {
        this.$refs.uToast.show({
          title: '不能小于折后最小值',
          type: 'warning',
        })
        this.setReceivableAmount('-')
        this.$nextTick(() => {
          this.setReceivableAmount(changeTwoDecimal(minPrice))
          this.calculateDiscount()
        })
      } else if (value > maxPrice) {
        this.$refs.uToast.show({
          title: '本次折后金额不可以超过总计原价',
          type: 'warning',
        })
        this.setReceivableAmount('-')
        this.$nextTick(() => {
          this.setReceivableAmount(changeTwoDecimal(maxPrice))
          this.calculateDiscount()
        })
      } else if(v === '' || v===undefined){
            this.setReceivableAmount('-')
            this.$nextTick(() => {
              this.setReceivableAmount(changeTwoDecimal(minPrice))
              this.calculateDiscount()
            })
      }else {
        if (v !== value) {
          this.setReceivableAmount(v)
          this.$nextTick(() => {
            // 删除多余小数位
            this.setReceivableAmount(Math.floor(v * 100) / 100)
            this.calculateDiscount()
          })
          this.calculateDiscount()
        } else {
          this.setReceivableAmount(value)
          this.calculateDiscount()
        }
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.charge-projects-list-wrapper {
  display: flex;
  flex-direction: column;
  width: 750rpx;
  height: 100vh;

  .content-wrapper {
    flex: 1;
    background: #f4f6f4;
    overflow-y: scroll;

    .info {
      width: 100%;
      height: 64rpx;
      background: #fefcec;
      color: #f86e21;
      padding: 0 26rpx;
      box-sizing: border-box;
    }

    .disposal-item {
      width: 750rpx;
      height: 240rpx;
      padding: 32rpx;
      box-sizing: border-box;
      background: #fff;
      margin-bottom: 14rpx;
      .row-1 {
        width: 100%;
        flex: 1;

        .item-name {
          flex: 0 0 420rpx;
          height: 96rpx;
          font-size: 34rpx;
          color: #191919;
        }

        .action {
          flex: 1;

          .edit-price {
            display: flex;
            justify-content: flex-end;
            color: #7f7f7f;
            font-size: 28rpx;
          }

          .edit-icon-style {
            color: #5cbb89;
            font-size: 36rpx;
            flex: 0 0 36rpx;
            margin-left: 20rpx;
          }
        }
      }

      .row-2 {
        width: 100%;
        flex: 0 0 32rpx;
        line-height: 32rpx;
        font-size: 28rpx;
        color: #595959;
      }
    }
  }

  .footer-wrapper {
    width: 750rpx;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    background: #fff;
    .btns {
      display: flex;
      justify-content: space-between;
      padding: 16rpx 32rpx;
    }
    .submit-btn {
      width: 686rpx;
      border-radius: 40rpx;
      height: 80rpx;
      color: #fff;
      background: #5cbb89;
    }
  }
}
</style>
