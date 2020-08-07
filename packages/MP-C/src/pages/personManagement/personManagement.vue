<template>
  <scroll-view style="height: 100%; background: rgba(0, 0, 0, 0.04);">
    <div v-show="personList.length < 10" class="add" @click="addPerson">
      <div class="iconfont icon-add"></div>
      <div>还可添加{{ 10 - personList.length }}人</div>
    </div>
    <div class="personList">
      <div
        class="item"
        v-for="(val,index) of personList"
        @click="personDetail(index)"
        :key="val.id"
      >
        <div class="name">
          {{ val.personnelName }}/{{ val.gender == 1 ? '男' : '女' }}
          <span
            class="self"
            v-if="val.contactLabel==1"
          >本人</span>
        </div>
        <div class="phone">手机：{{ val.mobile }}</div>
        <span class="iconfont icon-right"></span>
      </div>
    </div>
    <div class="empty" v-show="showEmpty">
      <image class="emptyImg" src="/static/empty.svg" />
      <div class="emptyTxt">未查询到任何信息</div>
    </div>
  </scroll-view>
</template>

<script>
import customerAPI from '@/APIS/customer/customer.api'
import { getStorage, setStorage, STORAGE_KEY } from '@/utils/storage'

export default {
  data() {
    return {
      personList: [],
      showEmpty: false,
      staff: getStorage(STORAGE_KEY.STAFF),
    }
  },
  mounted() {},
  onLoad() {
    this.getCustomer()
  },
  methods: {
    getCustomer() {
      let id = this.staff.id
      customerAPI
        .getCustomerList({ userId: id })
        .then((res) => {
          this.personList = res.data
          if (res.data.length == 0) {
            this.showEmpty = true
          } else {
            this.showEmpty = false
          }
        })
        .catch((error) => {
          console.log('error', error)
        })
    },
    del() {
      customerAPI.deleteCustomer({ personnelId: 10015 }).then(() => {})
    },
    addPerson() {
      this.$utils.push({ url: '/pages/personAdd/personAdd' })
    },
    personDetail(index) {
      let detail = JSON.stringify(this.personList[index])
      this.$utils.push({
        url: '/pages/personDetail/personDetail?personDetail=detail',
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.add {
  height: 148rpx;
  margin: 32rpx 24rpx;
  font-size: 28rpx;
  font-weight: 400;
  color: #5cbb89;
  background: #feffff;
  border: 1rpx solid rgba(0, 0, 0, 0.15);
  border-radius: 8rpx;
  text-align: center;
  box-sizing: border-box;
  padding-top: 37rpx;
}
.personList {
  .item {
    box-sizing: border-box;
    padding: 32rpx;
    background: white;
    border-top: 2rpx #dbdbdb solid;
    border-bottom: 2rpx #dbdbdb solid;
    margin-bottom: 20rpx;
    position: relative;
    .name {
      font-size: 34rpx;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.9);
    }
    .self {
      display: inline-block;
      border: 1rpx solid rgba(0, 0, 0, 0.9);
      border-radius: 2rpx;
      font-size: 28rpx;
      font-weight: 400;
      margin-left: 24rpx;
      margin-bottom: 16rpx;
      color: rgba(0, 0, 0, 0.9);
      padding: 4rpx 12rpx;
    }
    .phone {
      font-size: 28rpx;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.5);
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
