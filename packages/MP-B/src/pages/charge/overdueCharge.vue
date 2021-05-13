<template>
  <view class="overdue-charge-wrap">
    <view class="list-wrap">
      <view
        class="item"
        v-for="(item, index) in overdueChargeList"
        :key="item.billOrderId"
      >
        <view class="overdue-infos">
          <view class="info-left">
            <view>{{ billTypeDic[item.billType] }}</view>
            <view>{{ item.medicalInstitutionName }}</view>
            <view
            >{{ item.billFistPayTime | filterTime('YYYY-MM-DD HH:mm') }}
            </view>
          </view>
          <view class="info-right">
            <view class="labels">
              <view>应收金额：</view>
              <view>实收金额：</view>
              <view>欠费：</view>
            </view>
            <view class="values">
              <view
              >{{ item.receivableAmount | thousandFormatter(2, '￥') }}
              </view>
              <view class="red-color"
              >{{ item.receiptAmount | thousandFormatter(2, '￥') }}
              </view>
              <view class="green-color"
              >{{ item.debtAmount | thousandFormatter(2, '￥') }}
              </view>
            </view>
          </view>
        </view>
        <view class="checkbox">
          <dpmsCheckbox
            shape="square"
            :value="item.checked"
            @change="onCheckboxChange($event, item)"
          ></dpmsCheckbox>
        </view>
      </view>
    </view>
    <view class="bottom-wrap">
      <view class="btns">
        <view class="amount-wrap"
        ><span class="des">总计金额：</span
        ><span class="amount">{{
            totalAmount | thousandFormatter(2, '￥')
          }}</span></view
        >
        <chargeButton type="solid" :buttonStyle="buttonStyle" @click="nextStep"
        >下一步
        </chargeButton>
      </view>
    </view>
    <!--提示-->
    <u-toast ref="uToast" />
  </view>
</template>
<script>
import chargeButton from './common/chargeButton';
import billAPI from '@/APIS/bill/bill.api';
import { BigCalculate } from '@/utils/utils';
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'overdueCharge',
  data() {
    return {
      overdueChargeList: [],
      billTypeDic: {
        1: '普通收费',
        2: '普通收费',
        3: '储值卡交易',
        4: '卡券交易',
        5: '专享卡交易',
        6: '普通收费',
      },
      buttonStyle: { width: '332rpx' },
      check: true,
      totalAmount: 0,
    };
  },
  computed: {
    ...mapState('patient', ['patientDetail']),
  },
  onLoad(params) {
    let checkedId = params?.billOrderId || '';
    this.getPayDebtList(checkedId);
  },
  onShow() {
    // this.getPayDebtList()
  },
  onHide() {},
  onUnload() {},
  methods: {
    ...mapMutations('overdue', ['setOverdueList', 'setOverdueAmount']),
    onCheckboxChange(value, record) {
      record.checked = value;
      this.calculate();
    },
    calculate() {
      this.totalAmount = this.overdueChargeList.reduce((pre, next) => {
        const nextAmount = next.checked ? next.debtAmount : 0;
        return BigCalculate(pre, '+', nextAmount);
      }, 0);
    },
    hideActionSheet() {
      this.showActionSheet = false;
    },
    //获取欠费列表
    getPayDebtList(checkedId) {
      billAPI
      .getPayDebtList({
        patientId: this.patientDetail.patientId,
      })
      .then((res) => {
        if (res?.data) {
          this.overdueChargeList = res.data.map((item) => {
            if (checkedId) {
              if (checkedId === String(item.billOrderId)) {
                item.checked = true;
              } else {
                item.checked = false;
              }
            } else {
              item.checked = true;
            }
            return item;
          });
          this.calculate();
        }
      });
    },
    //
    nextStep() {
      const list = this.overdueChargeList.filter((item) => item.checked);
      if (list.length <= 0) {
        this.$refs.uToast.show({
          title: '请选择收欠费项目!',
          type: 'warning',
        });
        return;
      }
      this.setOverdueList(list);
      this.setOverdueAmount(this.totalAmount);

      uni.navigateTo({
        url: '/pages/charge/overdueCheckstand',
      });
    },
  },
  watch: {},
  components: { chargeButton },
};
</script>
<style lang="scss" scoped>
.overdue-charge-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 28rpx;
  color: #191919;
  line-height: 1;
  //padding-bottom: constant(safe-area-inset-bottom);
  //padding-bottom: env(safe-area-inset-bottom);
  box-sizing: border-box;

  .list-wrap {
    display: flex;
    flex-direction: column;
    flex-grow: 2;
    overflow-y: scroll;

    .item {
      background: #fff;
      margin-bottom: 16rpx;
      padding: 32rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .overdue-infos {
        flex-grow: 2;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .info-left {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 254rpx;
          margin-right: 12rpx;

          view {
            overflow-x: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: block;
            width: 100%;
          }
        }

        .info-right {
          display: flex;
          padding-right: 20rpx;

          .labels {
            display: flex;
            flex-direction: column;
            align-items: flex-end;

            view {
              flex-wrap: nowrap;
            }
          }

          .values {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
          }
        }
      }

      .checkbox {
        display: flex;
        align-items: center;
        flex-shrink: 0;
      }

      .red-color {
        color: #fa5151;
      }

      .green-color {
        color: #52c41a;
      }

      .info-left > view:nth-child(2),
      .labels > view:nth-child(2),
      .values > view:nth-child(2) {
        padding-bottom: 18rpx;
        padding-top: 18rpx;
      }
    }
  }

  .bottom-wrap {
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    background: #fff;

    .btns {
      display: flex;
      padding: 16rpx 32rpx;
      align-items: center;
      justify-content: space-between;

      .amount-wrap {
        display: flex;
      }

      .des {
        display: flex;
        flex-wrap: nowrap;
        flex-shrink: 0;
      }

      .amount {
        font-weight: 500;
        max-width: 220rpx;
        overflow-x: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: block;
      }
    }
  }
}
</style>
