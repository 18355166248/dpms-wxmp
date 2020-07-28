<template>
  <scroll-view class="content" scroll-y>
    <view class="banner">
      <swiper class="swiper banner" indicator-dots autoplay>
        <swiper-item class="alignCenter">
          <image
            class="bannerImg"
            src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1595843250493&di=ae2861d58b2bd6ad784fe9e4caa4bab1&imgtype=0&src=http%3A%2F%2Fi0.hdslb.com%2Fbfs%2Fface%2Fe93c24dc4a4cfdd228524ce87ab8117406fe0c97.jpg"
          />
        </swiper-item>
        <swiper-item class="alignCenter">
          <image
            class="bannerImg"
            src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1595844294412&di=d53e27dc81240a496500bb20f0189bb6&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fq_mini%2Cc_zoom%2Cw_640%2Fimages%2F20171106%2F8e9d50ae61f14a8983c9400c1db6d59f.jpeg"
          />
        </swiper-item>
        <swiper-item class="alignCenter">
          <image
            class="bannerImg"
            src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1595844395668&di=6c473d00bf3a03f6d6a9e11c901816a6&imgtype=0&src=http%3A%2F%2Fimg.bqatj.com%2Fimg%2Fb6b2d754a722aa35.jpg"
          />
        </swiper-item>
      </swiper>
    </view>
    <view class="logo alignCenter">
      <img
        src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1595846007191&di=49f7640038b79adbb562fc0ad1e4ab9d&imgtype=0&src=http%3A%2F%2Fimage.suning.cn%2Fuimg%2Fsop%2Fcommodity%2F117970640468680470958160_x.jpg"
      />
    </view>
    <view class="storeCard">
      <view class="card">
        <view class="cardImg">
          <img
            src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1595847895031&di=8aee312e80d2f572504d33fc18072511&imgtype=0&src=http%3A%2F%2Fimg2.xitongzhijia.net%2F170413%2F76-1F413114454146.png"
          />
        </view>
        <view class="cardContent">
          <text class="cardTitle">口腔预约</text>
          <text class="cardDesc">描述描述描述描述描述</text>
          <button class="cardBtn" type="primary" size="mini">预约</button>
        </view>
      </view>
      <view class="cardMore">
        <text>查看更多</text>
      </view>
    </view>
    <view class="projCard"> </view>
  </scroll-view>
</template>

<script>
export default {
  data() {
    return {
      title: 'Hello',
    }
  },
  onLoad() {},
  methods: {},
  components: {},
}
</script>

<style>
.content {
  margin: 0 auto;
  height: 100%;
}
.alignCenter {
  text-align: center;
}
.banner {
  height: 320rpx;
}
.bannerImg {
  height: 100%;
}
.card {
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  height: 270rpx;
  border: 1px solid #f0f0f0;
}
.cardImg {
  width: 40%;
}
.cardImg > img {
  width: 100%;
  height: 100%;
}
.cardContent {
  width: 60%;
  padding-left: 4%;
  display: flex;
  flex-direction: column;
  border: 1px solid #f0f0f0;
}
.cardTitle {
  font-size: 36rpx;
  margin-top: 8%;
}
.cardDesc {
  font-size: 32rpx;
  margin-top: 8%;
}
.cardBtn {
  margin-top: 8%;
  margin-left: 65%;
}
.cardMore {
  padding: 2%;
  font-size: 30rpx;
  text-align: center;
  border: 1px solid #f0f0f0;
}
</style>
