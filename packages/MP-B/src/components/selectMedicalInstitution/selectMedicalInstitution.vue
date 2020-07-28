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
              <view class="tki-tree-label" @tap="treeItemSelect(item, index)">
                <text v-if="item.source.type === 1" class="icon icon-zhi"
                  >直</text
                >
                <text v-else class="icon icon-jia">加</text>
                {{ item.name }}
              </view>
              <view
                v-if="!item.lastRank"
                @tap.stop="treeItemTap(item, index)"
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
export default {
  name: 'selectMedicalInstitution',
  props: {
    range: {
      type: Array,
      default: [],
    },
    idKey: {
      type: String,
      default: 'medicalInstitutionId',
    },
    rangeKey: {
      type: String,
      default: 'medicalInstitutionSimpleCode',
    },
    childrenKey: {
      type: String,
      default: 'childMedicalInstitutionList',
    },
    title: {
      type: String,
      default: '请选择诊所',
    },
    disList: {
      type: Array,
      default: [],
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
  },
  data() {
    return {
      showTree: false,
      treeList: [],
    }
  },
  computed: {},
  methods: {
    show() {
      this.showTree = true
    },
    hide() {
      this.showTree = false
    },
    //扁平化树结构
    renderTreeList(list = [], rank = 0, parentId = [], parents = []) {
      list.forEach((item) => {
        this.treeList.push({
          id: item[this.idKey],
          name: item[this.rangeKey],
          source: item,
          parentId, // 父级id数组
          parents, // 父级id数组
          rank, // 层级
          showChild: false, //子级是否显示
          open: false, //是否打开
          show: rank === 0, // 自身是否显示
          hideArr: [],
        })
        if (
          Array.isArray(item[this.childrenKey]) &&
          item[this.childrenKey].length > 0
        ) {
          let parentid = [...parentId],
            parentArr = [...parents]
          delete parentArr[this.childrenKey]
          parentid.push(item[this.idKey])
          parentArr.push({
            [this.idKey]: item[this.idKey],
            [this.rangeKey]: item[this.rangeKey],
          })
          this.renderTreeList(
            item[this.childrenKey],
            rank + 1,
            parentid,
            parentArr,
          )
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
      // 点击选项时触发
      this.$emit('confirm', item)
      this.hide()
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
  },
  mounted() {
    this.initTree()
  },
}
</script>

<style scoped>
@import './style.css';
</style>
