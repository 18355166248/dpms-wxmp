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
                disabled: item.disabled,
              }"
            >
              <view
                class="tki-tree-label"
                :class="{ disabled: !disList.includes(item.id) }"
                @tap="treeItemSelect(item, index)"
              >
                <text
                  v-if="item.source.medicalInstitutionType === 1"
                  :class="['icon', 'icon-dan', { iconDisabled: item.disabled }]"
                  >单</text
                >
                <text
                  v-if="item.source.medicalInstitutionType === 2"
                  :class="['icon', 'icon-zhi', { iconDisabled: item.disabled }]"
                  >直</text
                >
                <text
                  v-if="item.source.medicalInstitutionType === 3"
                  :class="['icon', 'icon-da', { iconDisabled: item.disabled }]"
                  >大</text
                >
                <text
                  v-if="item.source.medicalInstitutionType === 4"
                  :class="['icon', 'icon-jia', { iconDisabled: item.disabled }]"
                  >加</text
                >
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
      type: Number,
      default: 0,
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
  },
  methods: {
    show() {
      // 后台返回的机构信息memberCode可能为空 ，需要从登陆信息中获取
      const loginInfo = getStorage(STORAGE_KEY.LOGIN_INFO)
      systemAPI
        .getInstitutionListScrm({
          memberName:
            this.memberCode ||
            this.medicalInstitution.memberCode ||
            loginInfo.memberCode,
          username: this.username || this.staff.username,
        })
        .then((res) => {
          this.range = this.list.length ? this.list : res.data
          const disList = []
          if (this.medicalInstitutionType > 0) {
            JSON.stringify(res.data, (k, v) => {
              if (typeof v === 'undefined' || (!v && v !== 0)) return v
              v.medicalInstitutionId &&
                v.parentId !== 0 &&
                v.medicalInstitutionType === this.medicalInstitutionType &&
                disList.push(v.medicalInstitutionId)
              return v
            })
          } else {
            JSON.stringify(res.data, (k, v) => {
              if (typeof v === 'undefined' || (!v && v !== 0)) return v
              v.medicalInstitutionId && disList.push(v.medicalInstitutionId)
              return v
            })
          }

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
          disabled: item.status === 2 ? true : false, // 当前机构是否已停用
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
@import './style.css';
</style>
