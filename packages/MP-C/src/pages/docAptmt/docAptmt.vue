<template>
  <scroll-view class="content" scroll-y>
    <view class="nav">
      <navigator
        class="navigator"
        url="navigate/navigate?title=navigate"
        hover-class="navigator-hover"
      >
        <button type="default">按预约项目</button>
      </navigator>
      <navigator
        class="navigator"
        url="navigate/navigate?title=navigate"
        hover-class="navigator-hover"
      >
        <button type="default">按医生预约</button>
      </navigator>
    </view>
    <view class="filter">
      <picker
        mode="selector"
        range-key="key"
        :range="list"
        :value="selectedValue"
        @change="onFilterOption"
      >
        <dpmsCell :value="pickerText" />
      </picker>
      <dpmsCellInput v-model="keyWord" />
      <button class="mini-btn" type="primary">搜索</button>
    </view>
    <view class="aptmtList">
      <view class="aptmtCard">
        <image
          src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1596454148382&di=2e33fe17edce69e9bfd4885318602677&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201901%2F14%2F20190114220449_Y4FMZ.thumb.700_0.jpeg"
        />
        <view>
          <view class="cardTile">张医生</view>
          <view class="cardDesc"
            >擅长: 整形，美容整形，美容整，美容整形，美容整形，美容整…</view
          >
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script>
export default {
  data() {
    return {
      selectedValue: 0,
      list: [
        {
          key: 'cn',
          value: '中国',
        },
        {
          key: 'usa',
          value: '美国',
        },
        {
          key: 'brazil',
          value: '巴西',
        },
        {
          key: 'jp',
          value: '日本',
        },
      ],
      keyWord: '',
    }
  },
  onLoad() {},
  methods: {
    onFilterOption: function (e) {
      // console.log('picker发送选择改变，携带值为', e.target.value)
      this.selectedValue = e.target.value
    },
  },
  computed: {
    pickerText() {
      return this.list[this.selectedValue].key
    },
  },
  components: {},
}
</script>

<style>
.content {
  margin: 0 auto;
  height: 100%;
}
.nav {
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-top: 20rpx;
}
.navigator {
  width: 50%;
}
.filter {
  display: flex;
}
.aptmtCard {
  width: 702rpx;
  height: 212rpx;
  margin-left: 24rpx;
  background: #feffff;
  border-radius: 8px;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.09);
  display: flex;
  margin-bottom: 16rpx;
}
.aptmtCard > image {
  margin-top: 32rpx;
  margin-left: 24rpx;
  width: 120rpx;
  height: 120rpx;
  border-radius: 80rpx;
}
.cardTile {
  width: 136rpx;
  height: 44rpx;
  font-size: 34rpx;
  font-family: PingFangSC, PingFangSC-Regular;
  text-align: left;
  color: rgba(0, 0, 0, 0.9);
  line-height: 44rpx;
  margin-top: 32rpx;
  margin-left: 24rpx;
}
.cardDesc {
  width: 446rpx;
  height: 88rpx;
  font-size: 28rpx;
  font-family: PingFangSC, PingFangSC-Regular;
  text-align: left;
  color: rgba(0, 0, 0, 0.5);
  line-height: 44rpx;
  margin-left: 24rpx;
  margin-top: 16rpx;
}
</style>
