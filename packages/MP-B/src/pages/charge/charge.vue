<template>
  <view class="page-wrap">
    <view class="charge-wrap">
      <view class="list-wrap">
        <!---->
        <view class="item-wrap">
          <view class="item0">
            <itemType :iconData="icon0" />
            <view class="flex">
              <chargeItem
                class="charge-item dashed"
                :amountData="receivableData"
              />
              <chargeItem
                class="charge-item dashed"
                :amountData="receiptData"
              />
              <chargeItem class="charge-item" :amountData="arrearageData" />
            </view>
          </view>
        </view>
        <!---->
        <view class="item-wrap">
          <view class="item1">
            <view class="box">
              <itemType :iconData="icon1" />
              <chargeItem
                class="charge-item dashed"
                :amountData="advancePaymentsData"
              />
            </view>
          </view>
          <view class="item2">
            <itemType :iconData="icon2" />
            <view class="flex">
              <chargeItem
                class="charge-item dashed"
                :amountData="capitalBalanceData"
              />
              <chargeItem class="charge-item" :amountData="giftBalanceData" />
            </view>
          </view>
        </view>
        <!---->
        <view class="item-wrap card-integral-wrap">
          <view class="item">
            <itemType :iconData="icon3" />
            <chargeItem class="charge-item" :amountData="integralData">
              <div
                class="iconfont icon-edit edit-icon-style"
                @click="editIntegral"
              />
            </chargeItem>
          </view>
        </view>
      </view>
      <view
        class="bottom-wrap"
        v-if="canOperation && (isOverdue || isCreateOrder)"
      >
        <view class="btns">
          <chargeButton
            type="solid"
            @click="createOrder"
            :buttonStyle="{ width: isOverdue ? '336rpx' : '686rpx' }"
            v-if="isCreateOrder"
            >新建账单</chargeButton
          >
          <chargeButton type="border" @click="overdueCharge" v-if="isOverdue"
            >收欠费</chargeButton
          >
        </view>
      </view>
    </view>

    <actionSheet
      @close="hideActionSheet"
      v-if="showActionSheet"
      :background="'#fff'"
    >
      <view
        class="action-item"
        v-for="(item, index) in list"
        :key="index"
        @click="selectType(item)"
      >
        {{ item.text }}
      </view>
    </actionSheet>
    <!--编辑积分弹框-->
    <u-modal
      width="620"
      title="调整积分"
      :title-style="{ fontWeight: 'bold' }"
      v-model="showEditIntegral"
      confirm-color="#5cbb89"
      show-cancel-button
      @confirm="confirm"
      async-close="true"
      negative-top="300"
      :cancel-style="{ borderTop: '2rpx solid rgba(0,0,0,0.10)' }"
      :confirm-style="{
        borderTop: '2rpx solid rgba(0,0,0,0.10)',
        borderLeft: '2rpx solid rgba(0,0,0,0.10)',
      }"
      ref="uModal"
    >
      <view class="slot-content">
        <div>当前积分：{{ integralData.amount }}</div>
        <div class="input-wrap">
          <div>调整为：</div>
          <label>
            <input
              type="number"
              placeholder-style="font-size: 30rpx; font-weight: 400; color: rgba(0, 0, 0, 0.25);"
              placeholder="请输入积分"
              @input="onEditIntegralChange"
              :value="inputIntegral"
            />
          </label>
        </div>
      </view>
    </u-modal>
    <!--提示-->
    <u-toast ref="uToast" />
  </view>
  <!--  <view >-->
  <!--    <empty :disabled="true" text="暂无数据"></empty>-->
  <!--  </view>-->
</template>
<script>
import itemType from './common/itemType'
import chargeItem from './common/chargeItem'
import bottomWrap from './common/bottomWrap'
import chargeButton from './common/chargeButton'
import { mapMutations, mapState } from 'vuex'
import billAPI from '@/APIS/bill/bill.api'
import patientAPI from '@/APIS/patient/patient.api'
export default {
  name: 'charge',
  data() {
    return {
      icon0: {
        iconClass: 'iconconsumption-profile',
        typeName: '消费预览',
        color: '#faad14',
      },
      icon1: {
        iconClass: `icondiagnosis-treatment`,
        typeName: '诊疗项目',
        color: '#75a8f0',
      },
      icon2: {
        iconClass: `icon-stored-value-card`,
        typeName: '储值卡余额',
        color: '#fa5151',
      },
      icon3: {
        iconClass: `icon-card-integral`,
        typeName: '卡券积分',
        color: '#fa8c16',
      },
      list: [
        {
          text: '简易收费',
          type: 1,
        },
        {
          text: '明细收费',
          type: 2,
        },
        {
          text: '处置收费',
          type: 3,
        },
      ],
      showActionSheet: false,
      receivableData: {
        name: '开单应收',
        amount: 0,
        format: true,
      },
      receiptData: {
        name: '消费总额',
        amount: 0,
        format: true,
      },
      arrearageData: {
        name: '总欠费',
        amount: 0,
        format: true,
      },
      advancePaymentsData: {
        name: '预收款',
        amount: 0,
        format: true,
      },
      capitalBalanceData: {
        name: '本金余额',
        amount: 0,
        format: true,
      },
      giftBalanceData: {
        name: '赠金余额',
        amount: 0,
        format: true,
      },
      integralData: {
        amount: 0,
        name: '积分',
        format: false,
      },
      //是否获取到接口数据
      isGetResult: false,
      showEditIntegral: false,
      // 是否是共享会员
      isShareMember: false,
      inputIntegral: undefined,
    }
  },
  computed: {
    ...mapState('searchProjectStore', ['searchProjectList']),
    ...mapState('patient', ['patientDetail', 'memberDetail']),
    ...mapState('workbenchStore', ['medicalInstitution']),
    isOverdue() {
      return (
        this.btnPremisstion('arrears_of_fees') &&
        this.arrearageData.amount > 0 &&
        this.isGetResult
      )
    },
    isCreateOrder() {
      return this.btnPremisstion('patient_new_bill') && this.isGetResult
    },
    canOperation() {
      const { institutionChainType, topParentId } = this.medicalInstitution
      // 1，单店，2，直营(如果topParentId===0则为总部，总部也是直营)，3，大区，4，加盟
      // 注意：web端与小程序的判断不一样！！！
      if (
        institutionChainType === 3 ||
        (institutionChainType === 2 && topParentId === 0)
      ) {
        return false
      }
      return true
    },
    //是否能够修改积分
    canChangeMemberIntegral() {
      return !!(this.isShareMember || this.patientDetail?.memberCardNo)
    },
  },
  mounted() {
    this.initData()
  },
  methods: {
    ...mapMutations('checkstand', ['setChargeType']),
    ...mapMutations('dispose', [
      'setDisposeList',
      'setSelectedDisposeList',
      'setReceivableAmount',
    ]),
    ...mapMutations('patient', ['setMemberDetail']),
    initData() {
      //获取消费预览和诊疗项目数据
      let promise1 = billAPI
        .getStatistical({
          patientId: this.patientDetail?.patientId,
        })
        .then((res) => {
          if (res.data) {
            this.receivableData.amount = res.data.receivableAmount
            this.receiptData.amount = res.data.receiptAmount
            this.arrearageData.amount = res.data.arrearageAmount
            this.advancePaymentsData.amount = res.data.advancePaymentsAmount
          }
        })
      //获取储值卡余额数据
      let promise2 = billAPI
        .getSoredCardDetail({
          memberId: this.patientDetail?.memberId,
          customerId: this.patientDetail?.customerId,
          patientId: this.patientDetail?.patientId,
        })
        .then((res) => {
          if (res.data) {
            this.capitalBalanceData.amount = res.data.capitalBalance
            this.giftBalanceData.amount = res.data.giftBalance
          }
        })

      Promise.all([promise1, promise2])
        .then(() => {
          this.isGetResult = true
        })
        .catch((err) => {
          this.isGetResult = true
        })

      if (this.patientDetail?.customerId) {
        this.getMemberDetail()
      }
      this.getUserShare()
    },
    getUserShare() {
      patientAPI
        .getUserShare({
          customerId: this.patientDetail?.customerId || 0,
        })
        .then((res) => {
          if (res.code === 0 && res?.data) {
            this.isShareMember = res.data.shareIntegration
          }
        })
    },
    //获取会员详情
    getMemberDetail() {
      patientAPI
        .getMemberDetail({
          memberId: this.patientDetail?.memberId,
          customerId: this.patientDetail?.customerId,
        })
        .then((res) => {
          if (res.code === 0 && res?.data) {
            this.setMemberDetail(res.data)
            this.integralData.amount =
              this.memberDetail?.memberDetailResponse?.currentPoints || 0
          }
        })
    },
    //编辑积分
    editIntegral() {
      if (!this.canChangeMemberIntegral) {
        this.$refs.uToast.show({
          title: `当前客户不是会员，不支持修改积分`,
          type: 'warning',
        })

        return
      }

      this.inputIntegral = null
      this.showEditIntegral = true
    },
    onEditIntegralChange(e) {
      this.inputIntegral = Number(e.detail.value.trim())
    },

    // 确认修改积分
    confirm() {
      let value = this.inputIntegral
      if (value === '' || value === undefined) {
        this.$refs.uToast.show({
          title: `请输入积分`,
          type: 'warning',
        })
        this.$refs.uModal.clearLoading()
        return
      }
      if (value > 99999999 || value < 0) {
        this.$refs.uToast.show({
          title: `请输入0-99999999以内的整数`,
          type: 'warning',
        })
        this.$refs.uModal.clearLoading()
        return
      }
      if (value === this.integralData.amount) {
        this.$refs.uToast.show({
          title: `您输入的积分与当前积分一样`,
          type: 'warning',
        })
        this.$refs.uModal.clearLoading()
        return
      }
      this.updatePoints()
    },
    updatePoints() {
      patientAPI
        .updatePoints({
          memberId: this.patientDetail?.memberId,
          customerId: this.patientDetail?.customerId,
          point: Number(this.inputIntegral),
          prePoint: Number(
            this.memberDetail?.memberDetailResponse?.currentPoints || 0,
          ),
        })
        .then((res) => {
          if (res.code === 0) {
            this.$refs.uToast.show({
              title: `积分修改成功`,
              type: 'success',
            })
            this.showEditIntegral = false
            this.getMemberDetail()
          }
        })
        .catch((err) => {
          console.log(err)
          this.showEditIntegral = false
        })
    },
    //新建订单
    createOrder() {
      this.showActionSheet = true
    },
    hideActionSheet() {
      this.showActionSheet = false
    },
    //选择收费方式 跳转到对应的选择收费项目页面
    selectType(item) {
      this.setSelectedDisposeList([])
      this.setDisposeList([])
      this.setChargeType(item.type)
      let url = '/pages/charge/selectChargeTypes'
      if (item.type !== 1) {
        url = '/pages/charge/chargeProjectsTabs'
      }
      uni.navigateTo({
        url: url,
      })
    },
    //收欠费
    overdueCharge() {
      uni.navigateTo({
        url: '/pages/charge/overdueCharge',
      })
    },
  },
  watch: {
    watchData: {
      handler(newVal, oldVal) {},
      deep: true,
      immediate: true,
    },
  },
  components: { chargeItem, itemType, bottomWrap, chargeButton },
}
</script>
<style lang="scss" scoped>
.page-wrap {
  display: flex;
  flex-grow: 2;
  .charge-wrap {
    display: flex;
    flex-grow: 2;
    flex-direction: column;
    justify-content: space-between;
  }
  .list-wrap {
    display: flex;
    flex-direction: column;
    padding: 24rpx 24rpx 0;
  }
}

.item-wrap {
  display: flex;
  padding: 32rpx 0;
  background: #feffff;
  border-radius: 8rpx;
  box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(0, 0, 0, 0.06);
  margin-bottom: 24rpx;

  .dashed {
    &::after {
      position: absolute;
      content: '';
      right: 0;
      top: 0;
      height: 100%;
      width: 0;
      border: 2rpx dashed rgba(0, 0, 0, 0.15);
      transform-origin: 50% 0;
      transform: scale(0.5, 1);
    }
  }

  .item0 {
    width: 100%;

    .charge-item {
      width: 33.33%;
      position: relative;
    }
  }

  .item1 {
    width: 33.33%;
    position: relative;
    display: flex;
    .box {
      width: 100%;
    }
    .charge-item {
      width: 100%;
      position: relative;
    }

    &::after {
      position: absolute;
      content: '';
      right: 0;
      top: 0;
      height: 100%;
      width: 0;
      border: 1rpx solid rgba(0, 0, 0, 0.15);
    }
  }

  .item2 {
    width: 66.66%;

    .charge-item {
      width: 50%;
      position: relative;
    }
  }
}
.card-integral-wrap {
  width: 240rpx;
  box-sizing: border-box;
  .item {
    width: 100%;
  }
  .edit-icon-style {
    color: #5cbb89;
    font-size: 40rpx;
    flex: 0 0 36rpx;
    margin-left: 8rpx;
  }
}

.bottom-wrap {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  background: #fff;
  .btns {
    padding: 16rpx 32rpx;
    display: flex;
    justify-content: space-between;
  }
}

.action-item {
  height: 112rpx;
  width: 100%;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1rpx solid #e5e5e5;
}

.action-item:first-child {
  border-top: none;
  border-radius: 24rpx 24rpx 0 0;
}
.slot-content {
  padding: 48rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .input-wrap {
    display: flex;
    align-items: center;
    padding-top: 48rpx;
  }
}
//background: rgba(0,0,0,0.10);
.u-model__footer {
  border: 10px solid #000;
}
</style>
