<template>
<!--  <div>-->
    <div class="swiperContent">
      <div v-if="electronicImageSwiperData.length > 0" class="swiperBody">
        <div class="dots">
          <div v-if="electronicImageSwiperData.length > 1">
            <span>{{ topSwiperIndex + 1 }}</span
            ><span style="color: rgba(255, 255, 255, 0.65);"
              >/{{ electronicImageSwiperData.length }}</span
            >
          </div>
        </div>
  
        <swiper
          class="swiperList"
          :indicator-dots="false"
          :current="topSwiperIndex"
          @change="topSwiperTab"
        >
          <swiper-item
            v-for="(item, index) in electronicImageSwiperData"
            :key="index"
          >
            <div class="swiper-item">
              <img class="itemImg" :src="item.imageUrl" alt="" />
              <div class="itemPic">
                {{ imageTypeFormat(item.imageType) || '-' }}
              </div>
            </div>
          </swiper-item>
       
        </swiper>
        <div v-if="electronicImageSwiperData.length > 0" class="saveBtn" @click="onSavePicture">保存到手机</div>
      </div>
     
      <div v-if="electronicImageSwiperData.length === 0" class="emptyContentImage">
        <image class="imgContent" src="../../static/empty-icon@2x.png" />
        <div class="emptyText">暂无影像数据</div>
      </div>
    </div>

</template>

<script>
import customerAPI from '@/APIS/customer/customer.api'
export default {
  name: 'electronicImage',
  data() {
    return {
      topSwiperIndex: 0,
      electronicImageSwiperData: [],
      urlContent: '',
    }
  },
  onLoad(params) {
    const { patientId, registerId } = params
    this.getElectronicImageList(patientId, registerId)
  },
  methods: {
    imageTypeFormat(imageType) {
      let billTypeStr = ''
      if (imageType === 1) {
        return (billTypeStr = 'X射线检查')
      } else if (imageType === 2) {
        return (billTypeStr = '全景')
      } else if (imageType === 3) {
        return (billTypeStr = '小牙片')
      } else if (imageType === 4) {
        return (billTypeStr = 'CBCT')
      } else if (imageType === 5) {
        return (billTypeStr = '照片')
      } else if (imageType === 6) {
        return (billTypeStr = '内窥镜')
      } else if (imageType === 7) {
        return (billTypeStr = '正畸面部照')
      } else if (imageType === 8) {
        return (billTypeStr = 'STL数据')
      } else if (imageType === 9) {
        return (billTypeStr = '其他')
      }
    },
    getElectronicImageList(patientId, registerId) {
      customerAPI
        .healthRecordsImageList({
          patientId: patientId,
          registerId: registerId,
        })
        .then((res) => {
          this.electronicImageSwiperData = res.data
          console.log(
            'this.electronicImageSwiperData',
            this.electronicImageSwiperData,
          )
        })
    },
    topSwiperTab(e) {
      let that = this
      that.topSwiperIndex = Number(e.target.current)
    },
    onSavePicture() {
      let thumbs = this.electronicImageSwiperData
      console.log(
        'thumbs[this.topSwiperIndex].url',
        thumbs[this.topSwiperIndex].imageUrl,
      )
      wx.getImageInfo({
        src: thumbs[this.topSwiperIndex].imageUrl,
        success: (res) => {
          console.log('res.path', res.path)
          this.saveImageToPhotosAlbum(res.path)
        },
      })
    },
    //保存相册
    saveImageToPhotosAlbum: function (imgUrl) {
      console.log('imgUrl', imgUrl)
      if (imgUrl) {
        wx.saveImageToPhotosAlbum({
          filePath: imgUrl,
          success: (res) => {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000,
            })
          },
          fail: (err) => {
            wx.showToast({
              title: '保存失败',
              icon: 'none',
              duration: 2000,
            })
          },
        })
      } else {
        wx.showToast({
          title: '下载中……',
          icon: 'loading',
          duration: 3000,
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.swiperContent {
  width: 100%;
  height: 100%;
  background: #000000;
  .swiperBody {
    width: 100%;
    height: 100%;
    /*background-color: red;*/
    .dots {
      padding-top: 6%;
      width: 100%;
      height: 30%;
      text-align: center;
      color: #ffffff;
      box-sizing: border-box;
    }
    .swiperList {
      position: relative;
      width: 100%;
      height: 70%;
      .swiper-item {
        .itemImg {
          margin-top: 6%;
          width: 100%;
          height: 332rpx;
          display: block;
        }
        .itemPic {
          position: absolute;
          bottom: 138rpx;
          width: 100%;
          height: 36rpx;
          font-size: 28rpx;
          font-family: PingFangSC, PingFangSC-Regular, sans-serif;
          font-weight: 400;
          text-align: center;
          color: #ffffff;
          line-height: 36rpx;
        }
      }
    }
    
  }
  .saveBtn {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 90rpx;
    font-size: 36rpx;
    font-family: PingFangSC, PingFangSC-Regular, sans-serif;
    font-weight: 400;
    text-align: center;
    color: #ffffff;
    line-height: 90rpx;
    background: #5cbb89;
    /*z-index: 99999;*/
  }
}

.emptyContentImage {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #fff;
  .imgContent {
    margin-top: 176rpx;
    margin-bottom: 20rpx;
    width: 320rpx;
    height: 320rpx;
    /*background: yellow;*/
  }
  .emptyText {
    width: 100%;
    font-size: 34rpx;
    font-family: PingFangSC, PingFangSC-Regular, sans-serif;
    text-align: center;
    color: rgba(0, 0, 0, 0.65);
  }
}
</style>
