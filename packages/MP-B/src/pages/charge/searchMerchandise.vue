<template>
  <view class="search-wrap">
    <!--搜索-->
    <searchInput @onSearch="getMerchandiseList"></searchInput>
    <view class="merchandise-wrap">
      <merchandiseList
        :list="merchandiseList"
        v-if="merchandiseList.length > 0"
      ></merchandiseList>
      <!--无数据-->
      <view v-else>
        <empty :disabled="true" text="暂无数据"></empty>
      </view>
    </view>
    <view class="bottom-wrap">
      <view class="btns">
        <chargeButton type="solid" :buttonStyle="buttonStyle" @click="complete"
          >完成
        </chargeButton>
      </view>
    </view>
  </view>
</template>
<script>
import billAPI from '@/APIS/bill/bill.api'
import { mapMutations } from 'vuex'
import searchInput from './common/searchInput'
import merchandiseList from './common/merchandiseList'
import chargeButton from './common/chargeButton'
export default {
  name: '',
  data() {
    return {
      merchandiseList: [],
      buttonStyle: { width: '686rpx' },
    }
  },
  computed: {},
  created() {
    this.getMerchandiseList('')
  },
  methods: {
    getMerchandiseList(value) {
      billAPI
        .getMerchandiseList({
          merchandiseInfo: value,
        })
        .then((res) => {
          if (res.code === 0 && res?.data?.length > 0) {
            this.merchandiseList = this.handleMerchandiseList(res.data)
          } else {
            this.merchandiseList = []
          }
        })
        .catch((err) => {
          console.log(err)
          this.merchandiseList = []
        })
    },
    handleMerchandiseList(list) {
      list.forEach((item) => {
        item.checked = false
      })
      return list
    },
  },
  watch: {},
  components: { searchInput, merchandiseList, chargeButton },
}
</script>
<style lang="scss" scoped>
.search-wrap {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  .merchandise-wrap {
    flex-grow: 2;
    overflow-y: scroll;
    width: 100%;
  }
  .bottom-wrap {
    background: #fff;
    border-top: 1rpx solid #e5e5e5;
    padding-bottom: env(safe-area-inset-bottom);
    padding-bottom: constant(safe-area-inset-bottom);
    .btns {
      padding: 16rpx 32rpx;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
