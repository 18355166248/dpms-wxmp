<template>
  <view class="container-wrap">
    <merchandiseList :list="merchandiseList"></merchandiseList>
  </view>
</template>
<script>
import billAPI from '@/APIS/bill/bill.api'
import merchandiseList from './merchandiseList'
export default {
  name: '',
  data() {
    return {
      merchandiseList: [],
    }
  },
  created() {
    this.getMerchandiseList()
  },
  methods: {
    getMerchandiseList() {
      billAPI
        .getMerchandiseList()
        .then((res) => {
          if (res.code === 0 && res?.data?.length > 0) {
            this.merchandiseList = this.handleMerchandiseList(res.data)
          }
        })
        .catch((err) => {
          console.log(err)
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
  components: { merchandiseList },
}
</script>
<style lang="scss" scoped>
.container-wrap {
  display: flex;
  flex-grow: 20;
  flex-direction: column;
  width: 750rpx;
}
</style>
