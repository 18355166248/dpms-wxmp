<template>
  <view class="apply">
    <view class="apply-head">
      <view class="apply-head-supplier">
        <view class="flex_align_items_center">
          <text>供应商</text>
          <text class="redColor">*</text>
        </view>
        <view>
          <picker
            mode="selector"
            :value="supplierIndex == -1 ? 0 : supplierIndex"
            range-key="merchandiseSupplierName"
            :range="supplierList"
            @change="changeSupplier"
          >
            <text v-if="supplierIndex >= 0">{{
              supplierList[supplierIndex].merchandiseSupplierName
            }}</text>
            <text v-else class="bf_color">请选择</text>
          </picker>
        </view>
        <view>
          <text class="iconfont icon-arrow-right"></text>
        </view>
      </view>
      <view class="apply-head-desc">
        <view class="label">备注</view>
        <view class="apply-head-desc-input">
          <input
            v-model="memo"
            placeholder="请输入备注"
            maxlength="50"
            placeholder-style="color:#bfbfbf;"
          />
        </view>
      </view>
    </view>
    <view class="apply-add">
      <view>
        <text class="iconfont icon-codesandbox"></text>
        <text>采购物品</text>
      </view>
      <view @click="selectGoods"
        ><text class="iconfont icon-plus-circle"></text
      ></view>
    </view>
    <view class="apply-goods">
      <scroll-view
        scroll-y="true"
        style="width: 100%; height: 100%;"
        v-if="purchaseGoods.length"
      >
        <view
          class="apply-goods-item"
          v-for="(item, index) in purchaseGoods"
          :key="index"
        >
          <!-- 物品名称 -->
          <view class="apply-goods-item-title">
            <view>
              <text>{{ item.commonName }}</text>
              <text v-if="item.merchandiseName"
                >/{{ item.merchandiseName }}</text
              >
              <text v-if="item.aliasName">/{{ item.aliasName }}</text>
            </view>
            <view>
              <text
                class="iconfont icon-delete"
                @click="handleDelete(item)"
              ></text>
            </view>
          </view>
          <view class="apply-goods-item-info">
            <text class="label">规格信息：</text>
            <text>{{ item.specificationsStr || '-' }}</text>
          </view>
          <view class="apply-goods-item-number">
            <view class="label">采购数量</view>
            <view>
              <inputNumber
                :value="item.purchaseNum"
                :min="1"
                :max="99999999"
                @on-change="changePurchaseNum($event, index)"
              >
                <text class="ml-12" slot="suffix">{{
                  item.inventoryUnitStr
                }}</text>
              </inputNumber>
            </view>
          </view>
          <view class="apply-goods-item-tips">
            <text>拆零：</text>
            <text>{{
              (item.purchaseNum * item.unitSystem)
                | inventoryToThousand(true, '')
            }}</text>
            <text>{{ item.inventoryUnitStr }}</text>
          </view>
          <view class="apply-goods-item-unit">
            <view class="label">采购单价</view>
            <totalInput
              :value="item.purchaseUnitAmount"
              @on-change="changePurchaseUnitAmount($event, index)"
            />
          </view>
          <view class="apply-goods-item-tips">
            <text>入库单价：</text>
            <text>{{
              item.purchaseUnitAmount / item.unitSystem ||
              0 | inventoryToThousand
            }}</text>
          </view>
          <view class="apply-goods-item-unit">
            <view class="label">采购金额</view>
            <totalInput
              :value="item.purchaseTotalAmount"
              @on-change="changePurchaseTotalAmount($event, index)"
            />
          </view>
        </view>
      </scroll-view>
      <empty v-else disabled text="尚未添加物品" textColor="#000000" />
    </view>
    <view class="apply-action">
      <view>
        <text>整单折扣：</text>
        <text>{{ discountAmount | inventoryToThousand }}</text>
        <text class="ml-16">整单运费：</text>
        <text>{{ freightAmount | inventoryToThousand }}</text>
        <text class="iconfont icon-edit ml-16" @click="openPopup"></text>
      </view>
      <view class="apply-action-bottom">
        <view class="apply-action-bottom-desc">
          <view>
            <text>采购总金额：</text>
            <text>{{ purchaseTotal | inventoryToThousand }}</text>
          </view>
          <view>
            <text>已选共</text>
            <text>{{
              purchaseGoods.length | inventoryToThousand(true, '')
            }}</text>
            <text>种物品，</text>
            <text>合计</text>
            <text>{{ goodTotal | inventoryToThousand(true, '') }}</text>
            <text>件</text>
          </view>
        </view>
        <view class="apply-action-bottom-btn" @click="handleSubmit">提交</view>
      </view>
    </view>
    <uni-popup ref="popup" :mask-click="false">
      <view class="popup-content">
        <view class="popup-content-main">
          <view class="popup-content-main-discount">
            <view class="label">整单折扣金额</view>
            <view>
              <totalInput
                :max="purchaseTotal"
                :value="fromPopup.discountAmount"
                @on-change="changeDiscountAmount"
                errorText="整单折扣金额不能大于采购总金额"
              />
            </view>
          </view>
          <view class="popup-content-main-freight">
            <view class="label">整单运费</view>
            <view>
              <totalInput
                name="freightAmount"
                :value="fromPopup.freightAmount"
                @on-change="changeFreightAmount"
              />
            </view>
          </view>
        </view>
        <view class="popup-content-action">
          <view @click="cancle">取消</view>
          <view @click="ok">确认</view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>
<script>
import purchaseAPI from '@/APIS/warehouse/purchase.api.js'
import inputNumber from '@/components/input-number/input-number.vue'
import totalInput from '../components/total-input.vue'
import { mapMutations, mapState } from 'vuex'
import empty from '@/components/empty/empty.vue'
import Big from 'big.js'
export default {
  components: { inputNumber, totalInput, empty },
  data() {
    return {
      testAmount: 100,
      supplierList: [],
      supplierIndex: -1,
      memo: '',
      purchaseGoods: [],
      discountAmount: 0,
      freightAmount: 0,
      fromPopup: {
        discountAmount: 0,
        freightAmount: 0,
      },
      addOrUpdate: false, // true 修改  false 新增
      merchandisePurchaseOrderId: null,
    }
  },
  computed: {
    ...mapState('warehouse', ['goodList', 'applyGoods']),
    ...mapState('workbenchStore', ['medicalInstitution', 'staff']),
    // 所选物品件数
    goodTotal() {
      if (!this.purchaseGoods.length) {
        return 0
      } else {
        let num = 0
        this.purchaseGoods.forEach((element) => {
          num += element.purchaseNum * element.unitSystem
        })
        return num
      }
    },
    // 采购总金额
    purchaseTotal() {
      let total = 0
      this.purchaseGoods.forEach((element) => {
        total = Number(
          Big(total).plus(Number(element.purchaseTotalAmount)).valueOf(),
        )
      })
      return Number(
        Big(total)
          .plus(this.freightAmount)
          .minus(this.discountAmount)
          .valueOf(),
      )
    },
  },
  watch: {
    goodList: {
      // immediate: true,
      deep: true,
      handler: function (val) {
        this.purchaseGoods = val.map((e) => {
          return {
            ...e,
            purchaseNum: e.purchaseNum || 1,
            purchaseUnitAmount: e.purchaseUnitAmount || 0,
            purchaseTotalAmount: e.purchaseTotalAmount || 0,
          }
        })
      },
    },
  },
  async onLoad({ merchandisePurchaseOrderId }) {
    await this.getSupplierList()
    this.merchandisePurchaseOrderId = merchandisePurchaseOrderId
    this.addOrUpdate = !!merchandisePurchaseOrderId
    if (this.addOrUpdate) {
      const res = await this.getPurchaseDetail(merchandisePurchaseOrderId)
      let {
        memo,
        merchandiseSupplierId,
        merchandisePurchaseOrderItemList,
        discountAmount,
        freightAmount,
      } = res.data
      this.setGoodList(merchandisePurchaseOrderItemList)
      this.setApplyGoods(merchandisePurchaseOrderItemList)
      this.memo = memo
      this.discountAmount = discountAmount
      this.freightAmount = freightAmount
      this.supplierIndex = this.supplierList.findIndex(
        (e) => e.merchandiseSupplierId == merchandiseSupplierId,
      )
    } else {
      this.setGoodList([])
      this.setApplyGoods([])
    }
  },
  created() {},
  methods: {
    ...mapMutations('warehouse', [
      'updateGood',
      'deleteGood',
      'setGoodList',
      'setApplyGoods',
    ]),
    // 获取采购详情
    async getPurchaseDetail(merchandisePurchaseOrderId) {
      const res = await purchaseAPI.getPurchaseDetail({
        merchandisePurchaseOrderId,
      })
      return res
    },
    openPopup() {
      this.fromPopup.discountAmount = this.discountAmount
      this.fromPopup.freightAmount = this.freightAmount
      this.$refs.popup.open()
    },
    // 选择供应商
    changeSupplier(event) {
      this.supplierIndex = +event.detail.value
      this.$nextTick(() => {
        this.setGoodList([])
      })
    },
    // 前往物品选择列表
    selectGoods() {
      if (this.supplierIndex == -1) {
        uni.showToast({
          icon: 'error',
          title: '请选择供应商',
        })
      } else {
        this.setApplyGoods(this.purchaseGoods)
        let { scopeSupplyList } = this.supplierList[this.supplierIndex]
        this.$dpmsUtils.push({
          url: `/pages/warehouse/goods/index?mode=select&isShow=2&type=purchase&scopeSupplyList=${scopeSupplyList.replaceAll(
            ';',
            '',
          )}`,
        })
      }
    },
    // 获取供应商数据
    async getSupplierList() {
      const res = await purchaseAPI.getSupplierList()
      this.supplierList = res.data
    },
    // 采购数量变化
    changePurchaseNum(value, index) {
      this.purchaseGoods[index].purchaseNum = value
      let purchaseUnitAmount = this.purchaseGoods[index].purchaseUnitAmount
      this.purchaseGoods[index].purchaseTotalAmount = Number(
        Big(purchaseUnitAmount).times(value).valueOf(),
      )
      this.updateGood(this.purchaseGoods[index])
    },
    // 采购单价变化
    changePurchaseUnitAmount(value, index) {
      this.purchaseGoods[index].purchaseUnitAmount = value
      let purchaseNum = this.purchaseGoods[index].purchaseNum
      this.purchaseGoods[index].purchaseTotalAmount = Number(
        Big(value).times(purchaseNum).valueOf(),
      )
      this.updateGood(this.purchaseGoods[index])
    },
    // 采购金额
    changePurchaseTotalAmount(value, index) {
      this.purchaseGoods[index].purchaseTotalAmount = Number(value)
      let purchaseNum = this.purchaseGoods[index].purchaseNum
      this.purchaseGoods[index].purchaseUnitAmount = Number(
        Big(Big(value).div(purchaseNum)).toFixed(4, 3),
      )
      this.updateGood(this.purchaseGoods[index])
    },
    // 整单折扣金额
    changeDiscountAmount(value) {
      this.fromPopup.discountAmount = value
    },
    changeFreightAmount(value) {
      this.fromPopup.freightAmount = value
    },
    handleDelete(item) {
      this.deleteGood(item)
    },
    // 提交采购
    async handleSubmit() {
      if (!this.purchaseGoods.length) {
        uni.showToast({
          icon: 'error',
          title: '请选择采购物品',
        })
        return
      }
      let { medicalInstitutionId } = this.medicalInstitution
      let data = {
        medicalInstitutionId,
        discountAmount: this.discountAmount,
        freightAmount: this.freightAmount,
        merchandisePurchaseOrderItemList: this.purchaseGoods,
        purchaseTotalAmount: this.purchaseTotal,
        memo: this.memo,
        merchandiseSupplierId: this.supplierList[this.supplierIndex]
          .merchandiseSupplierId,
      }
      let res
      if (this.addOrUpdate) {
        res = await purchaseAPI.updatePurchase({
          ...data,
          merchandisePurchaseOrderId: this.merchandisePurchaseOrderId,
        })
        res.data = this.merchandisePurchaseOrderId
      } else {
        res = await purchaseAPI.createPurchase(data)
      }
      // 提交数据后,清空已选物品
      this.setGoodList([])
      uni.showToast({
        icon: 'none',
        title: '提交成功',
      })
      this.$dpmsUtils.replace({
        url: `/pages/warehouse/purchase/detail?merchandisePurchaseOrderId=${res.data}`,
      })
    },
    cancle() {
      this.$refs.popup.close()
    },
    ok() {
      if (this.fromPopup.discountAmount > this.purchaseTotal) {
        uni.showToast({
          icon: 'none',
          title: '折扣金额不能大于采购总金额',
        })
      } else {
        this.discountAmount = this.fromPopup.discountAmount
        this.freightAmount = this.fromPopup.freightAmount
        this.$refs.popup.close()
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.apply {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  > view {
    box-sizing: inherit;
  }
  &-head {
    width: 100%;
    padding-left: 32rpx;
    background-color: #ffffff;
    font-size: 30rpx;
    &-supplier {
      height: 104rpx;
      padding-right: 32rpx;
      display: flex;
      align-items: center;
      border-bottom: 1rpx solid rgba(0, 0, 0, 0.15);
      view:nth-child(2) {
        flex: 1;
        text-align: right;
        padding-right: 17rpx;
      }
      .bf_color {
        color: #bfbfbf;
      }
    }
    &-desc {
      height: 104rpx;
      padding-right: 32rpx;
      display: flex;
      justify-content: space-between;
      > view {
        height: 104rpx;
        line-height: 104rpx;
      }
      view:last-child {
        flex: 1;
        text-align: right;
        padding-left: 32rpx;
        input {
          width: 100%;
          height: 100%;
          color: rgba(25, 25, 25, 0.9);
          padding-right: 16rpx;
        }
        // input:placeholder {
        //   color: #bfbfbf;
        // }
      }
    }
  }
  &-add {
    width: 100%;
    height: 64rpx;
    padding: 0 32rpx;
    background-color: #eef8f3;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: $common-color;
    font-size: 30rpx;
    .icon-codesandbox {
      font-size: 28rpxrpx;
      margin-right: 14rpx;
    }
    .icon-plus-circle {
      font-size: 35rpx;
    }
  }
  &-goods {
    flex: 1;
    padding-bottom: 16rpx;
    overflow: hidden;
    &-item {
      width: 100%;
      box-sizing: border-box;
      padding-left: 32rpx;
      background-color: #ffffff;
      margin-bottom: 16rpx;
      &-title {
        padding-top: 32rpx;
        padding-right: 32rpx;
        display: flex;
        justify-content: space-between;
        font-size: 28rpx;
        view:first-child {
          font-weight: 500;
          color: #191919;
        }
        .icon-delete {
          color: rgba(0, 0, 0, 0.5);
        }
      }
      &-tips {
        height: 52rpx;
        line-height: 52rpx;
        text-align: right;
        padding-right: 32rpx;
        font-size: 28rpx;
        color: #7f7f7f;
      }
      &-number,
      &-unit {
        height: 104rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-right: 32rpx;
        border-bottom: 1rpx solid #e5e5e5;
      }
    }
  }
  &-action {
    width: 100%;
    height: 214rpx;
    padding: 32rpx 32rpx 0 32rpx;
    color: #191919;
    font-size: 28rpx;
    background-color: #ffffff;
    .icon-edit {
      color: $common-color;
    }
    &-bottom {
      display: flex;
      justify-content: space-between;
      &-desc {
        view:last-child {
          font-size: 28rpx;
          color: #4c4c4c;
        }
      }
      &-btn {
        width: 176rpx;
        height: 56rpx;
        text-align: center;
        line-height: 56rpx;
        font-size: 28rpx;
        color: #ffffff;
        background: #5cbb89;
        border-radius: 28rpx;
      }
    }
  }
  .label {
    color: #4c4c4c;
  }
  .value {
    color: #191919;
  }
  .flex_align_items_center {
    display: inline-flex;
    align-items: center;
  }
  .redColor {
    margin-left: 10rpx;
    color: #ff4d4f;
  }
  .popup-content {
    width: 620rpx;
    height: 320rpx;
    border-radius: 24rpx;
    box-sizing: border-box;
    background-color: #ffffff;
    > view {
      box-sizing: inherit;
    }
    &-main {
      height: 210rpx;
      padding: 0 32rpx;
      &-discount,
      &-freight {
        font-size: 30rpx;
        height: 105rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        view:first-child {
          flex-shrink: 0;
        }
        view:last-child {
          text-align: right;
        }
      }
      &-discount {
        border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
      }
    }
    &-action {
      height: 110rpx;
      display: flex;
      align-items: center;
      border-top: 1rpx solid rgba(0, 0, 0, 0.1);
      view {
        height: 110rpx;
        flex: 1;
        text-align: center;
        font-size: 34rpx;
        line-height: 110rpx;
      }
      view:first-child {
        color: #000000;
        font-weight: 500;
      }
      view:last-child {
        border-left: 1rpx solid rgba(0, 0, 0, 0.1);
        color: $common-color;
        font-weight: 500;
      }
    }
  }
}
</style>
