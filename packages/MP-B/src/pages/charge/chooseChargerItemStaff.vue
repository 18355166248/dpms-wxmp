<template>
  <view>
    <view class="content">
      <view>
        <dpmsCellPicker
          :title="title"
          :placeholder="'请选择' + title"
          :list="List"
          :defaultProps="{ label: 'staffName', value: 'staffId' }"
          defaultType="staffId"
          @input="onChange()"
          v-model="staffId"
          :required="isRequired"
        />
        <chargestand-title>
          <div slot="content" class="flexCenter">
            <div
              class="iconfont icon-user"
              style="font-size: 40rpx; margin-right: 11rpx;"
            />
            <div class="ellipsis" style="width: 550rpx;">项目{{ title }}</div>
          </div>
        </chargestand-title>
        <view v-for="item in disposeList" :key="item.itemCode">
          <dpmsCellPicker
            :title="item.itemName"
            :placeholder="`请选择${title}`"
            :list="List"
            :defaultProps="{ label: 'staffName', value: 'staffId' }"
            defaultType="staffId"
            v-model="item[itemStaffId]"
            @input="onChangeItem($event, item)"
          />
        </view>
      </view>
      <div class="footer-wrapper flex-center">
        <div class="btns">
          <button @click="onSubmit" class="submit-btn flex-center">
            确定
          </button>
        </div>
      </div>
    </view>
  </view>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import ChargestandTitle from '@/pages/charge/common/checkstandstandTitle'

const STAFF_ENUMS = new Map([
  ['doctor', 2],
  ['nurse', 6],
  ['consultant', 4],
  ['salesMan', 16],
  ['other', 0],
])

export default {
  data() {
    return {
      btn: {
        width: '686rpx',
        height: '80rpx',
        background: '#5cbb89',
        fontSize: '36rpx',
        borderRadius: '40rpx',
      },
      staffId: '',
      type: '',
      title: '',
      itemStaffId: '',
      isRequired: false,
    }
  },
  components: {
    ChargestandTitle,
  },
  onLoad(query) {
    this.type = query.type
    this.isRequired = query.required === 'true' ? true : false
    this.itemStaffId = this.type + 'StaffId'
    if (this.type === 'doctor') {
      this.title = '医生'
      uni.setNavigationBarTitle({
        title: '选择医生',
      })
    } else {
      this.title = '护士'
      uni.setNavigationBarTitle({
        title: '选择护士',
      })
    }

    this.staffId = this.checkStandStaffList[this.itemStaffId]

    this.disposeList?.forEach((item) => {
      let id = ''
      item.salesList?.forEach((item2) => {
        if (item2.salesType && item2.salesType === STAFF_ENUMS.get(this.type)) {
          id = item2.salesId
          return
        }
      })

      // 默认选第一个
      // if(!item.salesList && this.type === 'doctor') {
      //   id = this.List[1].staffId
      // }

      this.$set(item, this.itemStaffId, id)
    })


    // 默认选第一个
    if(!this.staffId && this.type === 'doctor') {
      this.staffId = this.List[1].staffId
    }

  },
  onShow() {
    if (typeof this.staffId == 'undefined') {
      this.disposeList.forEach((item) => {
        item[this.itemStaffId] = ''
      })
    }
  },
  computed: {
    ...mapState('dispose', ['staffList', 'disposeList', 'checkStandStaffList']),
    List() {
      const newList = this.staffList?.filter(
        (item) => item.position === STAFF_ENUMS.get(this.type),
      )
      newList.unshift({
        staffId: 1,
        staffName: `不选择${this.title}`,
      })
      return newList
    },
  },
  methods: {
    ...mapMutations('dispose', ['setDisposeList', 'setCheckStandStaffList']),
    onSubmit() {
      this.setDisposeList(
        this.disposeList.map((item) => {
          if (!item.salesList) {
            item.salesList = []
          }
          let stop = true
          item.salesList.forEach((item2) => {
            if (
              item2.salesType &&
              item2.salesType === STAFF_ENUMS.get(this.type)
            ) {
              item2.salesId = item[this.itemStaffId]
              stop = false
              return
            }
          })
          stop &&
            item[this.itemStaffId] &&
            item.salesList.push({
              salesId: item[this.itemStaffId],
              salesType: STAFF_ENUMS.get(this.type),
            })
          return item
        }),
      )
      this.checkStandStaffList[this.itemStaffId] = this.staffId
      this.setCheckStandStaffList(this.checkStandStaffList)
      this.$dpmsUtils.back()
    },
    onChange(val) {
      if (val === 1) {
        this.staffId = ''
        val = ''
      }
      this.disposeList.forEach((item) => {
        item[this.itemStaffId] = val
      })
    },
    onChangeItem(val, item) {
      if (val === 1) {
        item[this.itemStaffId] = ''
        return
      }
      this.disposeList.forEach((item2) => {
        if (item2.itemCode === item.itemCode) item[this.itemStaffId] = val
        this.$forceUpdate()
      })
    },
  },
}
</script>

<style scoped lang="scss">
.content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 750rpx;
  height: 100vh;
  .footer-wrapper {
    width: 750rpx;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    background: #fff;
    .btns {
      display: flex;
      justify-content: space-between;
      padding: 16rpx 32rpx;
    }
    .submit-btn {
      width: 686rpx;
      border-radius: 40rpx;
      height: 80rpx;
      color: #fff;
      background: #5cbb89;
    }
  }
}
</style>
