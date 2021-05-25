<template>
  <view class="container-wrap">
    <merchandiseList class="merchandise-list" :list="merchandiseList" @onScrollToLower="onScrollToLower" ref="merchandiseListRef" v-if="merchandiseList.length>0"></merchandiseList>
    <view v-else>
      <empty :disabled="true" text="暂无数据"></empty>
    </view>
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
      startMerchandiseId:0,
      isLoading:false,
      noMoreData:false
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
      if (this.isLoading){
        return false
      }
      this.isLoading=true
      billAPI
        .getMerchandiseList({
          startMerchandiseId:this.startMerchandiseId
        })
        .then((res) => {
          if (res.code === 0 && res?.data?.length > 0) {
            const concatList=this.merchandiseList.concat(this.handleMerchandiseList(res.data))
            this.merchandiseList =this.filterRepeatData(concatList)
            this.startMerchandiseId=this.merchandiseList[this.merchandiseList.length-1].merchandiseId
            if (res.data.length<20){
              this.noMoreData=true;
            }
          }
        })
        .catch((err) => {
          console.log(err)
        }).finally(()=>{
        this.isLoading=false
      })
    },
    //去掉重复数据
    filterRepeatData(list){
      let obj = {};
      let filterList = list.reduce((cur,next) => {
        obj[next.merchandiseId] ? "" : obj[next.merchandiseId] = true && cur.push(next);
        return cur;
      },[]) //设置cur默认类型为数组，并且初始值为空的数组
      console.log(filterList);
      return filterList
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
      this.searchMerchandiseList.forEach((item)=>{
        let finded=false
        this.merchandiseList.forEach((target)=>{
          if (item.merchandiseId===target.merchandiseId){
            target.checked=true
            finded=true
          }
        })
        if (!finded){
          item.checked=true
          this.merchandiseList.unshift(item)
        }
      })
    },
    //判断是否选中
    checkMerchandiseSelected(list, merchandise,targetList) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].merchandiseId === merchandise.merchandiseId) {
          return true
        }else{
          targetList.unshift()
        }
      }
    },
    filterMerchandiseList(){
      this.merchandiseList=this.$refs.merchandiseListRef.merchandiseList
      return this.merchandiseList.filter((item)=>{
        item.itemType=13
        return item.checked
      })
    },
    onScrollToLower(){
      console.log('onScrollToLower');
      if (this.noMoreData&&this.isLoading){
        return
      }
      this.getMerchandiseList()
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
  .merchandise-list{
    display: flex;
    flex-grow: 22;
    height: 100%;
  }
}
</style>
