<template>
  <div class="page-bg">
    <view class="uni-padding-wrap">
      <view class="category-title">分组1</view>
      <view class="uni-list">
        <checkbox-group @change="checkboxChange">
          <label class="uni-list-cell uni-list-cell-pd">
            <checkbox value="r1" />标签1
          </label>
          <label class="uni-list-cell uni-list-cell-pd">
            <checkbox value="r2" />标签2
          </label>
        </checkbox-group>
      </view>
    </view>
    <view class="uni-padding-wrap">
      <view class="category-title">分组2</view>
      <view class="uni-list">
        <checkbox-group @change="checkboxChange">
          <label class="uni-list-cell uni-list-cell-pd">
            <checkbox value="r4" />标签4
          </label>
          <label class="uni-list-cell uni-list-cell-pd">
            <checkbox value="r5" />标签5
          </label>
          <label class="uni-list-cell uni-list-cell-pd">
            <checkbox value="r6" />标签6
          </label>
        </checkbox-group>
      </view>
    </view>
    <view class="uni-padding-wrap">
      <view class="category-title">分组3</view>
      <view class="uni-list">
        <checkbox-group @change="checkboxChange">
          <label class="uni-list-cell uni-list-cell-pd">
            <checkbox value="r7" />标签7
          </label>
        </checkbox-group>
      </view>
    </view>

    <div class="mt-56 mb-82">
      <dpmsButton @click="savePersonas" text="保存" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checkedPersonas: [],
    }
  },
  onshow() {},
  methods: {
    checkboxChange: function (e) {
      this.checkedPersonas = [
        ...new Set([...this.checkedPersonas, ...e.detail.value]),
      ]
    },
    savePersonas: function () {
      uni.navigateTo({
        url:
          '/pages/createPatient/index?personas=' +
          JSON.stringify(this.checkedPersonas),
      })
    },
  },
  onLoad: function (option) {
    if (option.personas) {
      this.checkedPersonas = [
        ...this.checkedPersonas,
        ...JSON.parse(option.personas),
      ]
    } else {
      this.checkedPersonas = []
    }
  },
}
</script>

<style scoped>
.page-bg {
  height: 100%;
  background: rgba(0, 0, 0, 0.04);
}
.category-title {
  width: 750rpx;
  height: 82rpx;
  line-height: 82rpx;
  background: rgba(0, 0, 0, 0.04);
  text-indent: 32rpx;
  font-size: 28rpx;
  font-weight: 400;
  text-align: left;
  color: rgba(0, 0, 0, 0.5);
}

.uni-list-cell {
  justify-content: flex-start;
  display: block;
}
</style>
