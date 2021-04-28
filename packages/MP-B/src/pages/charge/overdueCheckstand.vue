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
            总计金额： <span>¥4,038.00</span>
          </div>
        </div>
      </chargestand-title>

      <dpmsCellInput title="欠费折扣" v-model="form.debtDiscount">
        <template v-slot:inputRight>
          <span class="inputRightIcon">%</span>
        </template>
      </dpmsCellInput>

      <dpmsCellInput title="总计应收" v-model="form.receivableAmount" />
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
        type="number"
        :title="item.transactionChannelName"
        v-model="item.paymentAmount"
      />
      <!--支付金额大于应收金额的验证-->
      <div v-if="true" class="validateCount">
        支付总金额不能大于应收金额
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
            :maxlength="500"
            @focus="bindFocus"
            @blur="closeBlur"
          />
        </view>
      </template>
    </div>
    <div class="footer-wrapper flexBt">
      <div class="left-wrap">
        <div class="amount-wrap">
          <span class="black-big-font padding-r">实收:</span
          ><span class="red-color">200,950.00</span>
        </div>
        <div class="amount-wrap">
          <view class="margin-r">
            <span class="gray-font padding-r">欠费:</span>
            <span class="black-font">20.00</span>
          </view>
          <view class="margin-r">
            <span class="gray-font padding-r">找零:</span>
            <span class="black-font">0.00</span>
          </view>
        </div>
      </div>
      <div class="btn-wrapper">
        <button class="save-btn">欠费免单</button>
        <button class="charge-btn">确定</button>
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
        <dpmsCheckbox
          :disabled="checkDisableFn() && item.checked"
          shape="square"
          :value="item.checked"
          @change="payTypeChange($event, item)"
        >
        </dpmsCheckbox>
      </view>
    </actionSheet>
  </view>
</template>
<script>
import ChargestandTitle from '@/pages/charge/common/checkstandstandTitle'
import inputMixins from 'mpcommon/mixins/inputMixins'
import billAPI from '@/APIS/bill/bill.api'
import moment from 'moment'
import actionSheet from './common/actionSheet'
import { mapState } from 'vuex'
import { mockItems, mockPayTypes } from '@/pages/charge/json'
export default {
  name: 'checkstand',
  mixins: [inputMixins],
  props: {
    disposeList: {
      type: Array,
      default: mockItems,
    },
  },
  data() {
    return {
      form: {
        payChannelList: [],
        cashierTime: moment(new Date().getTime()).format('YYYY-MM-DD HH:mm'),
        staffName: '',
        memo: '',
        debtDiscount: 100,
        receivableAmount: 0,
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
    }
  },
  components: {
    ChargestandTitle,
    actionSheet,
  },
  computed: {
    ...mapState('workbenchStore', ['menu']),
    ...mapState('overdue', ['overdueList', 'overdueAmount']),
  },
  onLoad() {
    console.log(this.overdueList)
    this.staffData = uni.getStorageSync('staff')
    this.form.staffName = this.staffData.staffName
    this.form.receivableAmount = this.overdueAmount
    this.loadListData()
  },
  onShow() {},
  onHide() {},
  onUnload() {},
  methods: {
    //------------支付方式控制面板
    checkDisableFn() {
      const hasCheck = this.payTypes.filter((item) => item.checked)
      return hasCheck.length === 1
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
      this.form.payChannelList = this.payTypes
        .filter((item) => item.checked)
        .map((item) => ({
          paymentAmount: 0,
          transactionChannelId: item.settingsPayTransactionChannelId,
          transactionChannelName: item.settingsPayTransactionChannelName,
        }))
      this.form.payChannelList[0].paymentAmount = this.form.receivableAmount
      this.showActionSheet = false
    },
    //------------支付方式控制面板
    //获取数据
    loadListData() {
      billAPI.getPayTypes().then((res) => {
        // todo换接口
        const mockRes = mockPayTypes
        if (mockRes?.data.length > 0) {
          mockRes.data.forEach((item, index) => {
            item.checked = false
            if (index === 0) {
              item.checked = true
              this.form.payChannelList = [
                {
                  paymentAmount: this.form.receivableAmount,
                  transactionChannelId: item.settingsPayTransactionChannelId,
                  transactionChannelName:
                    item.settingsPayTransactionChannelName,
                },
              ]
            }
          })
          this.payTypes = mockRes.data
        }
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
    background: #fff;
    padding: 0 32rpx;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;

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
