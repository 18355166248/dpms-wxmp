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
import { getStorage, STORAGE_KEY } from '@/utils/storage'

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
  },
  data() {
    return {
      showTree: false,
      treeList: [],
      range: [],
      disList: [],
    }
  },
  computed: {},
  methods: {
    show() {
      let institutionListPromise = systemAPI.getInstitutionList({
        memberCode:
          this.memberCode ||
          getStorage(STORAGE_KEY.MEDICALINSTITUTION).memberCode,
      })
      let loginInstitutionListPromise = systemAPI.getLoginInstitutionList({
        memberCode:
          this.memberCode ||
          getStorage(STORAGE_KEY.MEDICALINSTITUTION).memberCode,
        username: this.username || getStorage(STORAGE_KEY.STAFF).username,
      })
      Promise.all([institutionListPromise, loginInstitutionListPromise]).then(
        (res) => {
          this.range = [res[0].data]
          this.disList = res[1].data.workMedicalInstitutionIds
          this.showTree = true
          this.$emit('onDisList', true)
        },
      )
    },
    hide() {
      this.showTree = false
      this.$emit('onHide')
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
        if (
          Array.isArray(item['childMedicalInstitutionList']) &&
          item['childMedicalInstitutionList'].length > 0
        ) {
          let parentid = [...parentId],
            parentArr = [...parents]
          delete parentArr['childMedicalInstitutionList']
          parentid.push(item['medicalInstitutionId'])
          parentArr.push({
            medicalInstitutionId: item['medicalInstitutionId'],
            medicalInstitutionSimpleCode: item['medicalInstitutionSimpleCode'],
          })
          this.renderTreeList(
            item['childMedicalInstitutionList'],
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
      if (this.disList.includes(item.id)) {
        // 点击选项时触发
        this.$emit('confirm', item)
        this.hide()
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
  },
  mounted() {
    this.initTree()
  },
}
</script>

<style scoped>
@import './style.css';
</style>
