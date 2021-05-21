<template>
  <view class="container-wrap">
    <merchandiseList :list="merchandiseList" ref="merchandiseListRef"></merchandiseList>
  </view>
</template>
<script>
import billAPI from '@/APIS/bill/bill.api'
import merchandiseList from './merchandiseList'
import { mapState } from 'vuex';
export default {
  name: '',
  data() {
    return {
      merchandiseList: [],
    }
  },
  computed:{
    ...mapState('searchProjectStore', ['searchMerchandiseList']),
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
    //合并数据
    mergeMerchandiseList() {
      this.merchandiseList=this.$refs.merchandiseListRef.merchandiseList
      this.merchandiseList.length>0&&this.merchandiseList.forEach((merchandise) => {
        if (this.checkMerchandiseSelected(this.searchMerchandiseList,merchandise)){
          merchandise.checked=true
        }
      })
    },
    //判断是否选中
    checkMerchandiseSelected(list, merchandise) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].merchandiseId === merchandise.merchandiseId) {
          return true
        }
      }
    },
    filterMerchandiseList(){
      this.merchandiseList=this.$refs.merchandiseListRef.merchandiseList
      return this.merchandiseList.filter((item)=>{
        item.itemType=13
        return item.checked
      })
    }
  },
  watch: {
    searchMerchandiseList(val) {
      this.mergeMerchandiseList()
    },
  },
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
