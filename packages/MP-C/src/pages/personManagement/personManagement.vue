<template>
  <movable-area>
    <view style="width: 100%; display: flex; flex-direction: column;">
      <div v-if="personList.length < 10" class="add" @click="addPerson">
        <div
          class="iconfont icon-add"
          style="font-size: 40rpx; height: 40rpx; margin-bottom: 8rpx;"
        ></div>
        <div>还可添加{{ 10 - personList.length }}人</div>
      </div>
      <div class="personList">
        <div
          class="item"
          v-for="val of personList"
          @click="personDetail(val.id)"
          :key="val.id"
        >
          <div class="name">
            <text
              >{{ val.personnelName }}/{{ val.gender == 1 ? '男' : '女' }}</text
            >
            <span class="space"></span>
            <div class="self">
              {{ CONTACT_LABEL.properties[val.contactLabel].zh_CN }}
            </div>
          </div>
          <div class="phone">手机：{{ val.mobile }}</div>
          <span class="iconfont icon-right"></span>
        </div>
      </div>
    </view>
    <div class="empty" v-show="showEmpty">
      <image class="emptyImg" src="/static/empty.svg" />
      <div class="emptyTxt">未查询到任何信息</div>
    </div>
  </movable-area>
</template>

<script>
import customerAPI from '@/APIS/customer/customer.api'
import { getStorage, setStorage, STORAGE_KEY } from '@/utils/storage'
import { globalEventKeys } from '@/config/global.eventKeys'

export default {
  data() {
    return {
      personList: [],
      showEmpty: false,
      staff: getStorage(STORAGE_KEY.STAFF),
      CONTACT_LABEL: this.$utils.getEnums('ContactLabel'),
    }
  },
  mounted() {},
  onLoad() {
    this.getCustomer()
    uni.$on(
      globalEventKeys.updatePersonFormWithSaveSuccess,
      ({ isSuccess }) => {
        console.log('isSuccess', isSuccess)
        this.getCustomer()
      },
    )
  },
  onUnload() {
    uni.$off(globalEventKeys.updatePersonFormWithSaveSuccess)
  },
  onPullDownRefresh() {
    this.getCustomer()
  },
  onShow() {
    this.getCustomer()
  },
  methods: {
    getCustomer() {
      let id = this.staff.id
      uni.showLoading({
        title: '加载中...',
      })
      customerAPI
        .getCustomerList({ userId: id })
        .then((res) => {
          this.personList = res.data
          if (res.data.length == 0) {
            this.showEmpty = true
          } else {
            this.showEmpty = false
          }
          uni.stopPullDownRefresh()
          uni.hideLoading()
        })
        .catch((error) => {
          uni.hideLoading()
        })
    },
    addPerson() {
      let personList = JSON.stringify(this.personList)
      this.$utils.push({
        url:
          '/pages/personAdd/personAdd?param=' +
          this.personList.length +
          '&personList=' +
          personList,
      })
    },
    personDetail(id) {
      let detail
      for (let i of this.personList) {
        if (i.id == id) {
          detail = JSON.stringify(i)
        }
      }
      console.log('detail', detail)
      this.$utils.push({
        url: '/pages/personDetail/personDetail?personDetail=' + detail,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
movable-area {
  display: block;
  height: 100%;
  width: 100%;
}
.add {
  height: 148rpx;
  margin: 32rpx 24rpx;
  font-size: 28rpx;
  font-weight: 400;
  color: #5cbb89;
  background: #feffff;
  border-radius: 8rpx;
  text-align: center;
  box-sizing: border-box;
  padding-top: 37rpx;
  padding-bottom: 32rpx;
}
.personList {
  .item {
    box-sizing: border-box;
    padding: 32rpx;
    background: white;
    margin-bottom: 20rpx;
    position: relative;
    .name {
      font-size: 34rpx;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.9);
      display: flex;
      .space {
        display: inline-block;
        width: 1rpx;
      }
    }
    .self {
      border: 1rpx solid rgba(0, 0, 0, 0.9);
      height: 40rpx;
      line-height: 40rpx;
      border-radius: 2rpx;
      font-size: 28rpx;
      font-weight: 400;
      margin-left: 24rpx;
      color: rgba(0, 0, 0, 0.9);
      padding: 4rpx 12rpx;
    }
    .phone {
      font-size: 28rpx;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.5);
      margin-top: 16rpx;
    }
    .icon-right {
      color: rgba(0, 0, 0, 0.25);
      position: absolute;
      top: 68rpx;
      right: 30rpx;
    }
  }
}

.empty {
  width: 406rpx;
  height: 374rpx;
  position: absolute;
  top: -304rpx;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  text-align: center;
  .emptyImg {
    display: inline-block;
    width: 406rpx;
    height: 290rpx;
    margin-bottom: 40rpx;
  }
  .emptyTxt {
    font-size: 34rpx;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
  }
}
</style>
