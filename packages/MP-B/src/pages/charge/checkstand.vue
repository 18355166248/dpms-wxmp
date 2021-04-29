<template>
  <view class="checkstand-wrap">
    <div class="content-wrapper">
      <chargestand-title>
        <div slot="content" class="flex">
          <div
            class="iconfont icon-savings"
            style="font-size: 36rpx; margin-right: 11rpx;"
          ></div>
          <div class="ellipsis" style="width: 550rpx;">
            支付方式（应收金额{{ receivableAmount }}）
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
        @input="changePayChannel($event, item)"
      />
      <div v-if="changeAmount>0" class="validateCount">
        支付总金额不能大于应收金额
      </div>
      <chargestand-title>
        <div slot="content" class="flex">
          <div
            class="iconfont icon-customer-management"
            style="font-size: 36rpx; margin-right: 11rpx;"
          ></div>
          <div class="ellipsis" style="width: 550rpx;">开单时间</div>
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
      <dpmsCell title="收费时间" :value="nowDate" />
      <dpmsCell title="收费人" :value="patientDetail.patientName" />
      <template v-if="toggleInfomation">
        <dpmsCellPicker
          title="就诊时间"
          placeholder="请选择就诊时间"
          :list="visitTimeList"
          :defaultProps="{ label: 'labelStr', value: 'registerTime' }"
          defaultType="registerTime"
          v-model="form.registerTime"
          @input="onRegisterTime"
        />
        <dpmsCellPicker
          title="医生"
          placeholder="请选择医生"
          :list="doctorList"
          :defaultProps="{ label: 'staffName', value: 'staffId' }"
          defaultType="staffId"
          v-model="form.doctorStaffId"
        />
        <dpmsCellPicker
          title="护士"
          placeholder="请选择护士"
          :list="nurseList"
          :defaultProps="{ label: 'staffName', value: 'staffId' }"
          defaultType="staffId"
          v-model="form.nurseStaffId"
        />
        <dpmsCellPicker
          title="咨询师"
          placeholder="请选择咨询师"
          :list="consultantList"
          :defaultProps="{ label: 'staffName', value: 'staffId' }"
          defaultType="staffId"
          v-model="form.consultedStaffId"
        />
        <dpmsCellPicker
          title="销售人员"
          placeholder="请选择销售人员"
          :list="salesManList"
          :defaultProps="{ label: 'staffName', value: 'staffId' }"
          defaultType="staffId"
          v-model="form.salesManStaffId"
        />
        <dpmsCellPicker
          title="其他人员"
          placeholder="请选择其他人员"
          :list="otherList"
          :defaultProps="{ label: 'staffName', value: 'staffId' }"
          defaultType="staffId"
          v-model="form.otherStaffId"
        />
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
      <chargestand-title>
        <div slot="content" class="flex">
          <div
            class="iconfont icon-detail"
            style="font-size: 36rpx; margin-right: 11rpx;"
          />
          <div class="ellipsis" style="width: 550rpx;">项目明细</div>
        </div>
      </chargestand-title>
      <dpmsCell
        v-for="(item, index) in disposeList"
        :key="item.itemCode"
        :title="item.itemName"
        :value="formatDisposeItem(item)"
      />
      <div class="empty-wrapper"></div>
    </div>
    <div class="footer-wrapper flexBt">
      <div>
        <div style="height: 36rpx;" class="flexAlign">
          <span style="font-size: 28rpx; color: #191919;">
            实收:
          </span>
          <span style="font-size: 28rpx; color: #fa5151;">
            {{ paidAmount | thousandFormatter(2, '￥') }}
          </span>
        </div>
        <div style="height: 32rpx;" class="flexAlign">
          <span style="font-size: 22rpx; color: #4c4c4c;">欠费:</span>
          <span style="font-size: 22rpx; color: #191919;">{{ oweAmount }}</span>
          <span style="font-size: 22rpx; color: #4c4c4c;">找零:</span>
          <span style="font-size: 22rpx; color: #191919;">{{ changeAmount }}</span>
        </div>
      </div>
      <div class="btn-wrapper flexBt">
        <button class="save-btn">保存</button>
        <button class="charge-btn">收费</button>
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
        <template v-if="item.balance">&nbsp;&nbsp;(余额{{item.balance|thousandFormatter}})</template>
        <dpmsCheckbox
          :disabled="checkDisableFn(item.checked)"
          shape="square"
          :value="item.checked"
          @input="payTypeChange($event, item)"
        >
        </dpmsCheckbox>
      </view>
    </actionSheet>
  </view>
</template>
<script>
import ChargestandTitle from '@/pages/charge/common/checkstandstandTitle'
import patientAPI from '@/APIS/patient/patient.api'
import inputMixins from 'mpcommon/mixins/inputMixins'
import billAPI from '@/APIS/bill/bill.api';
import moment from 'moment';
import actionSheet from './common/actionSheet';
import { mapMutations, mapState } from 'vuex';
import { BigCalculate, numberUtils } from '@/utils/utils';

export default {
  name: 'checkstand',
  mixins: [inputMixins],
  data() {
    return {
      form: {
        payChannelList: [],
        doctorStaffId: '',
        nurseStaffId: '',
        consultedStaffId: '',
        salesManStaffId: '',
        otherStaffId: '',
        memo: '',
        registerTime: '',
      },
      toggleInfomation: false,
      otherList: [],
      visitTimeList: [],
      //支付方式
      payTypes: [],
      // 操作菜单
      showActionSheet: false,
      nowDate: moment(new Date().valueOf()).format("YYYY-MM-DD HH:mm")
    }
  },
  components: {
    ChargestandTitle,
    actionSheet,
  },
  computed: {
    ...mapState('workbenchStore', ['menu']),
    ...mapState('patient', ['patientDetail']),
    ...mapState('dispose', ['disposeList','receivableAmount']),
    paidAmount() {
      return this.form.payChannelList.reduce((pre,item)=>BigCalculate(item.paymentAmount,'+',pre),0)
    },
    oweAmount() {
      const {paidAmount, receivableAmount} = this
      return paidAmount < receivableAmount ? BigCalculate(receivableAmount,'-',paidAmount) : 0
    },
    changeAmount() {
      const {paidAmount, receivableAmount} = this
      return paidAmount > receivableAmount ? BigCalculate(paidAmount,'-',receivableAmount) : 0
    },
    doctorList() {
      return this.otherList.filter((item) => item.position === 2)
    },
    nurseList() {
      return this.otherList.filter((item) => item.position === 6)
    },
    consultantList() {
      return this.otherList.filter((item) => item.position === 4)
    },
    salesManList() {
      return this.otherList.filter((item) => item.position === 16)
    },
  },
  onLoad(query) {
    this.loadListData().then(() => {
      if(query) this.backData(query)
    })
  },
  onShow() {
    this.btnPremisstion();
  },
  onHide() {},
  onUnload() {},
  methods: {
    ...mapMutations('dispose', ['setDisposeList', 'setReceivableAmount']),
    backData(query) {
      if(query.billSerialNo) {
        // 走编辑账单逻辑,通过接口获取值
        billAPI.getOrderDetail({
          billSerialNo: query.billSerialNo
        }).then(res => {
          const {orderPayItemList,payChannelList,receivableAmount} = res.data
          // 设置应收金额
          this.setReceivableAmount(receivableAmount)
          this.setDisposeList(orderPayItemList)
          // 设置payChannelList
          this.setPayChannelList(payChannelList)
        })
      }
    },
    setPayChannelList(backChannelList) {
      // 回显this.form.payChannelList
      const balanceMap = new Map()
      this.payTypes.forEach(item => {
        if(item.balance) {
          balanceMap.set(item.settingsPayTransactionChannelId, item.balance)
        }
      })
      this.form.payChannelList = backChannelList.map(item => {
        let balance = balanceMap.get(item.transactionChannelId) || 0

        return {
          paymentAmount: item.paymentAmount,
          transactionChannelId: item.transactionChannelId,
          transactionChannelName: item.transactionChannelName,
          balance
        }
      })
      // todo 处理paytypes checked

    },
    changePayChannel(value, record) {
      if(record.balance) {
        value = (value - record.balance) > 0 ? record.balance : value
      }
      record.paymentAmount = value
    },
    formatDisposeItem(item) {
      return numberUtils.thousandFormatter(item.unitAmount) + (item.unit || '') + 'x' + item.itemNum;
    },
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
      this.form.payChannelList = this.payTypes.filter(item => item.checked).map(item => ({
        paymentAmount: 0,
        transactionChannelId: item.settingsPayTransactionChannelId,
        transactionChannelName: item.settingsPayTransactionChannelName,
        balance: item.balance,
      }));
      this.showActionSheet = false;
    },
    loadListData() {
      patientAPI.getStaffList().then((res) => {
        this.otherList = res.data;
      });

      billAPI
      .getRegisterList({
        patientId: this.patientDetail.patientId,
      })
      .then((res) => {
        this.visitTimeList = this.formatRegister(res.data);
        if (this.visitTimeList.length) {
          // 如果有值第一次做回显
          this.backVisitTimeDate(this.visitTimeList[0]);
        }
      });
      return billAPI.getPayTransactionChannel({
        memberId:this.patientDetail.memberId
      }).then((res) => {
        if (res?.data.length > 0) {
          res.data.forEach((item, index) => {
            item.checked = false;
            if (index === 0) {
              item.checked = true;
              this.form.payChannelList = [{
                paymentAmount: 0,
                transactionChannelId: item.settingsPayTransactionChannelId,
                transactionChannelName: item.settingsPayTransactionChannelName,
                balance: item.balance,
              }];
            }
          });
          this.payTypes = res.data;
        }
      })
    },
    formatRegister(list) {
      return list.map((item) => {
        item.labelStr =
          moment(item.registerTime).format('YYYY-MM-DD HH:mm') +
          ' ' +
          item.medicalInstitutionSimpleCode
        return item
      })
    },
    backVisitTimeDate(data) {
      const { form } = this
      const updateObj = {
        registerTime: data.registerTime,
      }
      // 如果已经有值则不联动
      // 回显医生
      if (!form.doctorStaffId && data.doctorStaffId) {
        updateObj.doctorStaffId = data.doctorStaffId
      }
      // 回显其他
      if (!form.otherStaffId && data.otherStaffId) {
        updateObj.otherStaffId = data.otherStaffId
      }
      // 回显咨询师
      if (!form.consultedStaffId && data.consultedStaffId) {
        updateObj.consultedStaffId = data.consultedStaffId
      }
      this.form = Object.assign(this.form, updateObj)
    },
    onRegisterTime(v, record) {
      this.backVisitTimeDate(record);
    },
  },
  watch: {
    watchData: {
      handler(newVal, oldVal) {},
      deep: true,
      immediate: true,
    },
  },
}
</script>
<style lang="scss" scoped>
.action-item {
  height: 112rpx;
  //width: 100%;
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

    .empty-wrapper {
      height: 244rpx;
    }
  }

  .footer-wrapper {
    flex: 0 0 92rpx;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    background: #fff;
    padding: 0 32rpx;
    box-sizing: border-box;

    .btn-wrapper {
      box-sizing: border-box;

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
        margin-right: 16rpx;
      }

      .charge-btn {
        color: #fff;
        background: #5cbb89;
      }
    }
  }
}
</style>
