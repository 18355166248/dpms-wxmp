<template>
  <view class="container-wrap">
    <!--选择项目-->
    <view class="projects-wrap" v-if="classifyList.length>0">
      <view class="list-wrap">
        <!--一级类目-->
        <view
          class="classify"
          v-for="item in classifyList"
          :key="item.settingsChargePackageTypeId"
        >
          <view class="header" @click="toggleClassify(item)">
            <view class="ellipsisChargeName">{{
              item.settingsChargePackageTypeName
            }}</view>
            <view class="icon-wrap">
              <view class="iconfont iconup1" v-if="item.open"></view>
              <view class="iconfont icondown1" v-else></view>
            </view>
          </view>
          <!--二级分类-->
          <view
            class="classify-second"
            v-if="item.children && item.children.length > 0 && item.open"
          >
            <view
              v-for="item2 in item.children"
              :key="item2.settingsChargePackageTypeId"
            >
              <view class="header" @click="toggleClassify(item2)">
                <view class="ellipsisChargeName">{{
                  item2.settingsChargePackageTypeName
                }}</view>
                <view class="icon-wrap">
                  <view class="iconfont iconup1" v-if="item2.open"></view>
                  <view class="iconfont icondown1" v-else></view>
                </view>
              </view>
              <view
                class="classify-third"
                v-if="item2.children && item2.children.length > 0 && item2.open"
              >
                <!--三级分类-->
                <view
                  class="header"
                  v-for="item3 in item2.children"
                  :key="item3.settingsChargePackageTypeId"
                >
                  {{ item3.settingsChargePackageTypeName }}
                  <view class="checkBox">
                    <dpmsCheckbox
                      shape="square"
                      v-model="item3.checked"
                      @change="onChargeChange(item3)"
                    ></dpmsCheckbox>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view v-else>
      <empty :disabled="true" text="暂无数据"></empty>
    </view>
  </view>
</template>
<script>
import billAPI from '@/APIS/bill/bill.api'
export default {
  name: '',
  data() {
    return {
      //分类列表
      classifyList: [],
    }
  },
  created() {
    this.getCategoryList()
  },
  methods: {
    getCategoryList() {
      billAPI.getCategoryList().then((res) => {
        if (res.code === 0 && res?.data) {
          this.handleClassifyList(res.data, 'children')
        }
      })
    },
    handleClassifyList(list, key) {
      list.forEach((item) => {
        item.open = false
        if (item[key] && item[key].length > 0) {
          this.handleClassifyList(item[key], key)
        } else {
          item.checked = false
        }
      })
      this.classifyList = list
    },
    toggleClassify(item) {
      item.open = !item.open
    },
    onChargeChange(item){
      if (item.checked&&(!item.chargeItemList)){
        this.getPackageChargeItems(item)
      }
    },
    getPackageChargeItems(item){
      billAPI.getPackageChargeItems({
        settingsChargePackageTypeId:item.settingsChargePackageTypeId
      }).then((res)=>{
        if (res.code===0&&res?.data){
          item.chargeItemList=res.data
        }
      }).catch((err)=>{
        console.log(err);
      })
    },
    //过滤数据  刷选没被选中的收费项目
    filterPackageChargeItemList(){
      let list=[]
      this.classifyList.forEach((item)=>{
        if (item?.children?.length>0){
          item.children.forEach((item2)=>{
            if (item2?.children?.length>0){
              item2.children.forEach((item3)=>{
                if (item3.checked){
                  item3?.chargeItemList?.forEach((item4)=>{
                      item4.settingsChargeItem.itemType=2
                      //这里要取外层的这个字段 不要取里面的 里面的是假的
                      item4.settingsChargeItem.parentItemCode=item4.settingsChargePackageTypeId
                      item4.settingsChargeItem.itemCode=item4.settingsChargePackageItemId
                      list.push(item4.settingsChargeItem)
                  })
                }
              })
            }
          })
        }
      })
      return list
    }
  },
  watch: {},
  components: {},
}
</script>
<style lang="scss" scoped>
.ellipsisChargeName {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.container-wrap {
  width: 750rpx;
  display: flex;
  flex-grow: 20;
  margin-top: 16rpx;
  .projects-wrap {
    display: flex;
    line-height: 30rpx;
    font-size: 30rpx;
    flex-grow: 2;
    overflow-y: scroll;
    .list-wrap {
      padding: 0 0 0 32rpx;
      background: #fff;
      width: 100%;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 32rpx 0;
      border-bottom: 2rpx solid #f5f5f5;
      .icon-wrap {
        width: 48rpx;
        height: 48rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 20rpx;
        .iconfont {
          color: #bfbfbf;
          width: 32rpx;
          height: 32rpx;
        }
      }
    }
    .classify {
      &:last-child {
        border-bottom: none;
      }
    }

    .classify-second,
    .classify-third {
      margin-left: 32rpx;
    }
    .checkBox {
      margin-right: 28rpx;
    }
  }
}
</style>
