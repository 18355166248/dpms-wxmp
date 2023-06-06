<template xlang="wxml">
  <view class="tki-tree">
    <view class="tki-tree-mask" :class="{ show: showTree }" @tap="hide"></view>
    <view class="tki-tree-cnt" :class="{ show: showTree }">
      <view class="tki-tree-bar">
        {{ title }}
      </view>
      <view class="tki-tree-view">
        <scroll-view class="tki-tree-view-sc" :scroll-y="true">
          <block v-for="(item, index) in treeList" :key="index">
            <view
              class="tki-tree-item"
              :style="[
                {
                  marginLeft: item.rank * 15 + 'px',
                  zIndex: item.rank * -1 + 50,
                },
              ]"
              :class="{
                show: item.show,
                last: item.lastRank,
                showchild: item.showChild,
                open: item.open,
              }"
            >
              <view
                class="tki-tree-label"
                :class="{ disabled: !disList.includes(item.id) }"
                @tap="treeItemSelect(item, index)"
              >
                <text
                  v-if="item.source.institutionChainType === 4"
                  class="icon icon-jia"
                  >加</text
                >
                <text v-else class="icon icon-zhi">直</text>
                {{ item.name }}
              </view>
              <view
                v-if="!item.lastRank"
                @tap="treeItemTap(item, index)"
                class="tki-tree-icon"
              >
                <text
                  class="iconfont"
                  :class="[
                    item.showChild ? 'icon-arrow-down' : 'icon-arrow-up',
                  ]"
                />
              </view>
            </view>
          </block>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
import systemAPI from '@/APIS/system.api'
import { mapState } from 'vuex'

export default {
  name: 'selectMedicalInstitution',
  props: {
    // memberCode为机构名称，不是机构code
    memberCode: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    list: {
      type: Array,
    },
    workList: {
      type: Array,
    },
    title: {
      type: String,
      default: '请选择诊所',
    },
    openAll: {
      //默认展开
      type: Boolean,
      default: true,
    },
    foldAll: {
      //折叠时关闭所有已经打开的子集，再次打开时需要一级一级打开
      type: Boolean,
      default: false,
    },
    medicalInstitutionType: {
      //只显示直营
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      showTree: false,
      treeList: [],
      range: [],
      disList: [],
    }
  },
  computed: {
    ...mapState('workbenchStore', ['staff', 'medicalInstitution']),
    isJoinAlone() {
      const loginMedicalInstitution = uni.getStorageSync('medicalInstitution')
      const scheme = loginMedicalInstitution.institutionChainSchema
      if (scheme === 1 || scheme === 2) {
        return true
      }
      return false
    },
  },
  methods: {
    show() {
      systemAPI
        .getInstitutionListScrm({
          memberName: this.memberCode || this.medicalInstitution.memberCode,
          username: this.username || this.staff.username,
        })
        .then((res) => {
          this.range = this.list.length ? this.list : res.data
          const types = this.isJoinAlone ? [2] : [2, 4]
          const disList = []
          JSON.stringify(res.data, (k, v) => {
            if (typeof v === 'undefined' || (!v && v !== 0)) return v
            v.medicalInstitutionId &&
              v.parentId !== 0 &&
              types.includes(v.medicalInstitutionType) &&
              disList.push(v.medicalInstitutionId)
            return v
          })
          this.disList = this.workList.length ? this.workList : disList
          this.showTree = true
          this.$emit('onDisList', true)
        })
        .catch((res) => {
          console.log('err', res)
          this.$emit('onDisList', true)
        })
    },
    hide(option) {
      this.showTree = false
      this.$emit('onHide', option)
    },
    //扁平化树结构
    renderTreeList(list = [], rank = 0, parentId = [], parents = []) {
      list.forEach((item) => {
        this.treeList.push({
          id: item['medicalInstitutionId'],
          name: item['medicalInstitutionSimpleCode'],
          source: item,
          parentId, // 父级id数组
          parents, // 父级id数组
          rank, // 层级
          showChild: false, //子级是否显示
          open: false, //是否打开
          show: rank === 0, // 自身是否显示
          hideArr: [],
        })
        if (Array.isArray(item['children']) && item['children'].length > 0) {
          let parentid = [...parentId],
            parentArr = [...parents]
          delete parentArr['children']
          parentid.push(item['medicalInstitutionId'])
          parentArr.push({
            medicalInstitutionId: item['medicalInstitutionId'],
            medicalInstitutionSimpleCode: item['medicalInstitutionSimpleCode'],
          })
          this.renderTreeList(item['children'], rank + 1, parentid, parentArr)
        } else {
          this.treeList[this.treeList.length - 1].lastRank = true
        }
      })
    },
    // 默认展开
    defaultSelect() {
      if (this.openAll) {
        this.treeList.forEach((v) => {
          v.show = true
          v.showChild = true
          v.open = true
        })
      }
    },
    // 点击
    treeItemTap(item, index) {
      let list = this.treeList
      let id = item.id
      item.showChild = !item.showChild
      item.open = item.showChild ? true : !item.open
      list.forEach((childItem, i) => {
        if (item.showChild === false) {
          //隐藏所有子级
          if (!childItem.parentId.includes(id)) {
            return
          }
          if (!this.foldAll) {
            if (childItem.lastRank !== true && !childItem.open) {
              childItem.showChild = false
            }
            // 为隐藏的内容添加一个标记
            if (childItem.show) {
              childItem.hideArr[item.rank] = id
            }
          } else {
            if (childItem.lastRank !== true) {
              childItem.showChild = false
            }
          }
          childItem.show = false
        } else {
          // 打开子集
          if (childItem.parentId[childItem.parentId.length - 1] === id) {
            childItem.show = true
          }
          // 打开被隐藏的子集
          if (childItem.parentId.includes(id) && !this.foldAll) {
            if (childItem.hideArr[item.rank] === id) {
              childItem.show = true
              if (childItem.open && childItem.showChild) {
                childItem.showChild = true
              } else {
                childItem.showChild = false
              }
              childItem.hideArr[item.rank] = null
            }
          }
        }
      })
    },
    treeItemSelect(item, index) {
      if (this.disList.includes(item.id)) {
        this.$emit('confirm', item)
        this.hide({ type: 'select' })
      }
    },
    initTree(range = this.range) {
      this.treeList = []
      this.renderTreeList(range)
      this.$nextTick(() => {
        this.defaultSelect(range)
      })
    },
  },
  watch: {
    range(list) {
      this.initTree(list)
    },
    list(list) {
      if (list.length) {
        this.range = list
        this.initTree(list)
      }
    },
    workList(list) {
      if (list.length) {
        this.disList = list
        this.initTree(this.list)
      }
    },
  },
  mounted() {
    this.initTree()
  },
}
</script>

<style scoped>
.tki-tree-mask {
  position: fixed;
  top: 0rpx;
  right: 0rpx;
  bottom: 0rpx;
  left: 0rpx;
  z-index: 9998;
  background-color: rgba(0, 0, 0, 0.6);
  opacity: 0;
  transition: all 0.3s ease;
  visibility: hidden;
}
.tki-tree-mask.show {
  visibility: visible;
  opacity: 1;
}
.tki-tree-cnt {
  background-color: #fff;
  border-radius: 24rpx 24rpx 0rpx 0rpx;
  position: fixed;
  top: 0rpx;
  right: 0rpx;
  bottom: 0rpx;
  left: 0rpx;
  z-index: 9999;
  top: 260rpx;
  transition: all 0.3s ease;
  transform: translateY(100%);
}
.tki-tree-cnt.show {
  transform: translateY(0);
}
.tki-tree-bar {
  border-bottom-width: 1rpx;
  border-bottom-style: solid;
  border-bottom-color: rgba(0, 0, 0, 0.15);
  font-size: 36rpx;
  color: rgba(0, 0, 0, 0.9);
  line-height: 112rpx;
  text-align: center;
}
.tki-tree-view {
  position: absolute;
  top: 0rpx;
  right: 0rpx;
  bottom: 0rpx;
  left: 0rpx;
  top: 114rpx;
  padding-left: 32rpx;
}
.tki-tree-view-sc {
  height: 100%;
  overflow: hidden;
}
.tki-tree-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 34rpx;
  color: rgba(0, 0, 0, 0.9);
  line-height: 1;
  height: 0;
  opacity: 0;
  transition: 0.2s;
  position: relative;
  overflow: hidden;
  border-bottom-width: 1rpx;
  border-bottom-style: solid;
  border-bottom-color: rgba(0, 0, 0, 0.15);
}
.tki-tree-item.show {
  height: 112rpx;
  opacity: 1;
}
.tki-tree-item.showchild:before {
  transform: rotate(90deg);
}
.tki-tree-item.last:before {
  opacity: 0;
}
.tki-tree-icon {
  color: #bfbfbf;
  width: 72rpx;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.tki-tree-label {
  flex: 1;
  display: flex;
  align-items: center;
  height: 100%;
  line-height: 1.2;
}
.tki-tree-label.disabled {
  color: rgba(0, 0, 0, 0.25);
}

.tki-tree-label .icon {
  border-radius: 50%;
  width: 32rpx;
  height: 32rpx;
  line-height: 32rpx;
  text-align: center;
  font-size: 20rpx;
  color: #fff;
  margin-right: 8rpx;
}
.tki-tree-label .icon-zhi {
  background-color: #8ad27d;
}
.tki-tree-label .icon-jia {
  background-color: #f7c629;
}
</style>
