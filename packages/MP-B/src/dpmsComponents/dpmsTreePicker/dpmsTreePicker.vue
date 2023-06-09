<template>
  <view class="tki-tree" @tap="show">
    <dpmsCell
      :title="title"
      :required="required"
      :placeholder="placeholder"
      :value="pickerText"
      isLink
    />
    <view
      class="tki-tree-mask"
      :class="{ show: showTree }"
      @tap.stop="hide"
    ></view>
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
                :class="{ disabled: !enableList.includes(item.id) }"
                @tap.stop="treeItemSelect(item)"
              >
                {{ item.name }}
              </view>
              <view
                v-if="!item.lastRank"
                @tap.stop="treeItemTap(item)"
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
  props: {
    title: {
      type: String,
      required: true,
    },
    required: {
      type: Boolean,
      required: false,
    },
    placeholder: String,
    isLink: {
      type: Boolean,
      required: false,
    },
    list: {
      type: Array,
    },
    value: Number,
    childrenItemKeyName: String,
    labelId: String,
    labelName: String,
    dataKeyName: String,
    dataKeyLabelId: String,
    dataKeyLabelName: String,
    dataParentId: String,
    openAll: Boolean,
  },
  data() {
    return {
      showTree: false,
      treeList: [],
      enableList: [],
      pickerText: '',
    }
  },
  methods: {
    show() {
      this.showTree = true
    },
    hide() {
      this.showTree = false
    },
    //初始化
    initTree(list) {
      this.treeList = []
      this.renderTreeList(list)
      this.$nextTick(() => {
        this.defaultSelect(list)
      })
    },
    //扁平化树结构
    renderTreeList(list = [], rank = 0) {
      const {
        childrenItemKeyName,
        labelId,
        labelName,
        dataKeyName,
        dataKeyLabelId,
        dataKeyLabelName,
        dataParentId,
      } = this
      list.forEach((item) => {
        this.treeList.push({
          id: item[labelId],
          name: item[labelName],
          parentId: item.parentId, // 父级id
          rank, // 层级
          showChild: false, //子级是否显示
          open: false, //是否打开
          show: rank === 0, // 自身是否显示
          origin: item,
        })
        if (
          Array.isArray(item[childrenItemKeyName]) &&
          item[childrenItemKeyName].length > 0
        ) {
          this.renderTreeList(item[childrenItemKeyName], rank + 1)
        } else {
          //取值
          const lastData = item[dataKeyName]
          lastData &&
            lastData.forEach((element) => {
              this.treeList.push({
                id: element[dataKeyLabelId],
                name: element[dataKeyLabelName],
                parentId: item[dataParentId], // 父级id
                rank: rank + 1, // 层级
                showChild: false, //子级是否显示
                open: false, //是否打开
                show: rank === 0, // 自身是否显示
                lastRank: true,
                origin: element,
              })
              this.enableList.push(element[dataKeyLabelId])
            })
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
    treeItemTap(item) {
      const list = this.treeList
      item.showChild = !item.showChild
      item.open = item.showChild ? true : !item.open
      this.treeList = this.treeTap(list, item.id, item.showChild)
    },
    treeTap(list, id, isShow) {
      list.forEach((element) => {
        if (Number(element.parentId) === Number(id)) {
          element.open = isShow
          element.show = isShow
          element.showChild = isShow
          if (!element.lastRank) {
            this.treeTap(list, element.id, isShow)
          }
        }
      })
      return list
    },
    //选择
    treeItemSelect(item) {
      if (this.enableList.includes(item.id)) {
        this.$emit('confirm', item.origin)
        this.showTree = false
      }
    },
  },
  watch: {
    list: {
      handler(val) {
        if (val.length) {
          this.initTree(val)
        }
      },
      deep: true,
      immediate: true,
    },

    value(id) {
      this.pickerText = this.treeList.find((element) => element.id === id)?.name
    },
  },
}
</script>

<style scoped>
@import './style.css';
</style>
