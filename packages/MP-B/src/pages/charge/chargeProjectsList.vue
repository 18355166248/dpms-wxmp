<template>
  <div class="charge-projects-list-wrapper">
    <div class="content-wrapper">
      <div class="info flex-v-center">
        <span class="iconfont icon-warning-circle" style="margin-right: 10rpx" />
        <span style="font-size: 26rpx">如需使用折扣，可手动调整金额</span>
      </div>
      <div v-for="(item,index) in disposeList"
           :key="item.itemCode"
           class="disposal-item flex-column">
        <div class="row-1 flex-h-between">
          <div class="item-name ellipsis2">{{ item.itemName }}</div>
          <div class="action">
            <div class="flex">
              <div class="edit-price" style="flex: 1">
                ¥{{ item.unitAmount }}{{ item.unit }}
              </div>
              <div v-if="btnPremisstion('changes_unit_price')" class="iconfont icon-edit edit-icon-style" />
            </div>
            <div class="flex-h-end">
              <div style="margin-top: 10rpx">
                <uni-number-box :max="9999" v-model="item.itemNum"/>
              </div>
            </div>
          </div>
        </div>
        <div class="row-2 flex-v-center">
          是否整单折扣: 是
        </div>
      </div>
      <dpmsCellInput
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
        title="折后金额(¥)"

      />
    </div>
    <div class="footer-wrapper">
      <button class="submit-btn flex-center">下一步</button>
    </div>
  </div>
</template>
<script>

import { BigCalculate } from '@/utils/utils';
import { mockItems } from '@/pages/charge/json';

export default {
  name: 'chargeProjectsList',
  props: {
    fackList: {
      type: Array,
      default: mockItems,
    },
  },
  data() {
    return {
      disposeList: this.fackList,
      mainOrderDiscount: 100
    };
  },
  onShow() {
    console.log(BigCalculate(0.1, '+', 0.2));
    // 计算宽度
  },
  methods: {
    onEditPrice(v) {
      console.log(v);
    },
    onMainOrderDiscount(v) {
      console.log(v);
      let vStr = `${v}`
      vStr = vStr.replace(/\b(0+)/gi,"")
      const vNum = Number(vStr)
      if(vNum > 100) {
        this.$nextTick(() => {
          this.mainOrderDiscount = 100
          console.log(this.mainOrderDiscount);
        })

      } else {
        this.$nextTick(() => {
          this.mainOrderDiscount = vNum
          console.log(this.mainOrderDiscount);
        })

      }
    }
  },
};
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
      background: #FEFCEC;
      color: #F86E21;
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
            color: #7F7F7F;
            font-size: 28rpx;
          }

          .edit-icon-style {
            color: #5CBB89;
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
    flex: 0 0 112rpx;
    background: #fff;

    .submit-btn {
      width: 686rpx;
      height: 80rpx;
      padding: 16rpx 32rpx;
      border-radius: 40rpx;
      color: #fff;
      background: #73b689;
    }
  }
}
</style>
