<template>
  <view class="apply">
    <view class="apply-head">
      <view class="apply-head-unit">
        <view class="flex_align_items_center">
          <text class="label">领用单位</text>
          <text class="redColor">*</text>
        </view>
        <view>
          <picker
            mode="selector"
            :value="deptTypeIndex"
            range-key="name"
            :range="receiveDeptTypeArray"
            @change="changeDeptType"
          >
            <text>{{ receiveDeptTypeArray[deptTypeIndex].name }}</text>
          </picker>
        </view>
        <view>
          <text class="iconfont icon-arrow-right"></text>
        </view>
      </view>
      <view class="apply-head-person">
        <view class="flex_align_items_center">
          <text class="label"
            >领用{{ receiveDeptTypeArray[deptTypeIndex].name }}</text
          >
          <text class="redColor">*</text>
        </view>
        <!-- 员工 诊室 科室-->
        <view>
          <picker
            mode="selector"
            :value="deptIndex"
            range-key="receiveDeptName"
            :range="deptList"
            @change="changeDeptData"
          >
            <text>{{ deptList[deptIndex].receiveDeptName }}</text>
          </picker>
        </view>
        <view>
          <text class="iconfont icon-arrow-right"></text>
        </view>
      </view>
      <view class="apply-head-desc">
        <view class="label">领用说明</view>
        <view class="apply-head-desc-input">
          <input v-model="description" placeholder="请输入领用说明" />
        </view>
      </view>
    </view>
    <view class="apply-add">
      <view>
        <text class="iconfont icon-codesandbox"></text>
        <text>领用物品</text>
      </view>
      <view
        ><text class="iconfont icon-plus-circle" @click="chooseGood"></text
      ></view>
    </view>
    <view class="apply-goods">
      <scroll-view
        scroll-y="true"
        style="height: 100%;"
        v-if="goodsList.length"
      >
        <view class="apply-goods-item">
          <applyGood
            v-for="(item, index) in goodsList"
            :key="index"
            :info="item"
            @on-clear="handleDelete(item)"
          >
            <view class="apply-goods-item-number">
              <view>领用数量：</view>
              <view>
                <inputNumber
                  :min="1"
                  :max="item.availableNum || item.inventoryNum"
                  v-model="item.receiveNum"
                  @on-change="changeApplyNumber(item)"
                />
              </view>
            </view>
          </applyGood>
        </view>
      </scroll-view>
      <empty v-else disabled text="尚未添加物品" textColor="#000000" />
    </view>
    <view class="apply-action">
      <view class="apply-action-info">
        <view>已选择{{ goodType | thousandFormatter(0, '') }}件物品</view>
        <view>合计{{ goodTotal | thousandFormatter(0, '') }}件</view>
      </view>
      <view class="apply-action-btn">
        <view @click="handleSubmit(5)">保存</view>
        <view @click="handleSubmit(1)">提交申请</view>
      </view>
    </view>
  </view>
</template>
<script>
import { receiveDeptTypeArray } from '../enum'
import { mapMutations, mapState } from 'vuex'
import checkBox from '@/components/checkbox/checkbox.vue'
import applyGood from './components/apply-good.vue'
import inputNumber from '@/components/input-number/input-number.vue'
import receiveAPI from '@/APIS/warehouse/receive.api.js'
import empty from '@/components/empty/empty.vue'

export default {
  components: { checkBox, applyGood, inputNumber, empty },
  computed: {
    ...mapState('warehouse', ['applyGoods']),
    ...mapState('workbenchStore', ['medicalInstitution', 'staff']),
    // 所选物品种类
    goodType() {
      let num = this.goodsList.length
      return num
    },
    // 所选物品件数
    goodTotal() {
      if (!this.applyGoods.length) {
        return 0
      } else {
        let num = 0
        this.applyGoods.forEach((element) => {
          num += element.receiveNum
        })
        // let num = this.applyGoods.reduce((a, b) => Number(a.receiveNum) + Number(b.receiveNum))
        // console.log(this.applyGoods)
        return num
      }
    },
  },
  data() {
    return {
      receiveDeptTypeArray: receiveDeptTypeArray(),
      deptTypeIndex: 0,
      deptIndex: 0,
      isShow: false,
      goodsList: [], // 已选物品
      deptList: [],
      description: '',
      merchandiseReceiveOrderId: null, // 领用id 存在 表示 修改  否则 新增
      addOrUpdate: false, // true 修改  false 新增
    }
  },
  watch: {
    applyGoods(val) {
      this.goodsList = val
    },
  },
  async onLoad({ merchandiseReceiveOrderId }) {
    this.merchandiseReceiveOrderId = merchandiseReceiveOrderId
    this.addOrUpdate = !!merchandiseReceiveOrderId
    if (merchandiseReceiveOrderId) {
      const res = await this.getReceiveDetail(merchandiseReceiveOrderId)
      await this.getReceiveDeptTypeList(res.receiveDeptType)
      this.setApplyGoods(res.receiveOrderItemVOList)
      this.description = res.description
      // 匹配对应的领用单位
      this.deptTypeIndex = this.receiveDeptTypeArray.findIndex(
        (e) => e.value === res.receiveDeptType,
      )
      // 匹配对应的领用单位的下拉数据
      this.deptIndex = this.deptList.findIndex(
        (e) => e.receiveDeptId === res.receiveDeptId,
      )
    } else {
      this.setApplyGoods([])
      await this.getReceiveDeptTypeList()
      // 新增时, 员工默认为当前登录者
      this.deptIndex = this.deptList.findIndex(
        (e) => e.receiveDeptId === this.staff.staffId,
      )
    }
  },
  created() {
    this.goodsList = this.applyGoods
    // 默认先获取员工对应的下拉数据
  },
  methods: {
    ...mapMutations('warehouse', [
      'updateGood',
      'selectGood',
      'deleteGood',
      'setApplyGoods',
    ]),
    async getReceiveDeptTypeList(receiveDeptType = 1) {
      const res = await receiveAPI.getReceiveDeptTypeList({ receiveDeptType })
      this.deptList = res.data
    },
    async getReceiveDetail(merchandiseReceiveOrderId) {
      const res = await receiveAPI.getReceiveDetail({
        merchandiseReceiveOrderId,
      })
      return res.data
    },
    changeApplyNumber(item) {
      console.log('领用数量变化后', item)
      this.updateGood(item)
    },
    // 删除已选项
    handleDelete(item) {
      this.deleteGood(item)
    },
    // 跳转物品选择页面
    chooseGood() {
      this.$dpmsUtils.push({ url: '/pages/warehouse/goods/index?mode=select' })
    },
    // 切换领用单位
    changeDeptType(event) {
      // 切换后 重置
      this.deptIndex = 0
      this.deptTypeIndex = +event.detail.value
      let receiveDeptType = this.receiveDeptTypeArray[this.deptTypeIndex].value
      this.getReceiveDeptTypeList(receiveDeptType)
    },
    // 切换领用员工, 诊室, 科室下拉数据
    changeDeptData(event) {
      this.deptIndex = +event.detail.value
    },
    // 提交数据
    async handleSubmit(receiveStatus) {
      if (!this.goodsList.length) {
        uni.showToast({
          icon: 'error',
          title: '请选择领用物品',
        })
        return
      }
      let { receiveDeptId, receiveDeptName } = this.deptList[this.deptIndex]
      let { medicalInstitutionId } = this.medicalInstitution
      let data = {
        medicalInstitutionId,
        receiveStatus,
        description: this.description,
        receiveDeptId,
        receiveDeptName,
        receiveDeptType: this.receiveDeptTypeArray[
          this.deptTypeIndex
        ].value.toString(),
        receiveOrderItemVOList: this.goodsList,
      }
      let res
      if (this.addOrUpdate) {
        res = await receiveAPI.updateReceiveApply({
          ...data,
          merchandiseReceiveOrderId: this.merchandiseReceiveOrderId,
        })
        res.data = this.merchandiseReceiveOrderId
      } else {
        res = await receiveAPI.addReceiveApply(data)
      }
      if (res.code == 0) {
        // 提交数据后,清空已选物品
        this.setApplyGoods([])
        uni.showToast({
          icon: 'none',
          title: receiveStatus == 1 ? '已提交' : '已保存',
        })
        this.$dpmsUtils.replace({
          url: `/pages/warehouse/receive/detail?merchandiseReceiveOrderId=${res.data}`,
        })
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.apply {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  > view {
    box-sizing: inherit;
  }
  &-head {
    padding-left: 32rpx;
    background-color: #ffffff;
    font-size: 30rpx;
    &-unit,
    &-person {
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
        input::placeholder {
          color: #bfbfbf;
        }
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
    background-color: #ffffff;
    overflow: hidden;
    &-item {
      padding-left: 32rpx;
      &-number {
        display: flex;
      }
    }
  }
  &-action {
    width: 100%;
    height: 176rpx;
    padding: 0 32rpx 68rpx 32rpx;
    background-color: #ffffff;
    border-top: 16rpx solid #f5f5f5;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-info {
      view:nth-child(1) {
        font-size: 28rpx;
        color: #191919;
      }
      view:nth-child(2) {
        font-size: 22rpx;
        color: #4c4c4c;
      }
    }
    &-btn {
      display: flex;
      font-size: 28rpx;
      view:nth-child(1) {
        width: 120rpx;
        height: 56rpx;
        margin-right: 16rpx;
        text-align: center;
        line-height: 56rpx;
        background: #ffffff;
        border: 2rpx solid #5cbb89;
        border-radius: 30rpx;
        color: #5cbb89;
      }
      view:nth-child(2) {
        width: 176rpx;
        height: 56rpx;
        text-align: center;
        line-height: 56rpx;
        background: #5cbb89;
        border-radius: 28rpx;
        color: #ffffff;
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
}
</style>
