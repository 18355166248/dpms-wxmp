<template>
  <view class="select-charge-wrap">
    <!--搜索-->
    <view class="search-input">
      <view class="iconfont iconsearch"></view>
      <u-input
        v-model="value"
        type="text"
        height="76"
        :custom-style="inputStyle"
        :placeholder="'请输入项目名称或拼音快速搜索'"
        :clearable="false"
      />
    </view>
    <!--选择项目-->
    <view class="projects-wrap">
      <view class="list-wrap">
        <view
          class="classify"
          v-for="item in classifyList"
          :key="item.settingsChargeTypeId"
        >
          <view class="header" @click="toggleClassify(item)">
            <view>{{ item.settingsChargeTypeName }}</view>
            <view class="iconfont iconup1" v-if="item.open"></view>
            <view class="iconfont icondown1" v-else></view>
          </view>
          <view class="children" v-if="item.open">
            <view
              class="project"
              v-for="project in item.children"
              :key="project.settingsChargeTypeId"
            >
              <view>{{ project.settingsChargeTypeName }}</view>
              <view class="checkBox">
                <dpmsCheckbox
                  shape="square"
                  :value="project.checked"
                  @change="projectChange($event, project, item)"
                >
                </dpmsCheckbox>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="bottom-wrap">
      <chargeButton type="solid" :buttonStyle="buttonStyle" @click="nextStep"
        >下一步</chargeButton
      >
    </view>
  </view>
</template>
<script>
import billAPI from '@/APIS/bill/bill.api'
import moment from 'moment'
import chargeButton from './common/chargeButton'

export default {
  name: '',
  data() {
    return {
      inputStyle: {
        width: '600rpx',
      },
      headStyle: {
        height: '56rpx',
      },
      classifyList: [],
      buttonStyle: { width: '686rpx' },
    }
  },
  computed: {},
  onLoad() {
    this.getChargeTypes()
  },
  onShow() {},
  onHide() {},
  onUnload() {},
  methods: {
    async getChargeTypes() {
      const { data } = await billAPI.getChargeTypes()
      if (data) {
        data.forEach((item) => {
          item.open = false
          item.children.forEach((project) => {
            project.checked = false
          })
        })
        this.classifyList = data || []
      }
    },
    //切换分类
    toggleClassify(item) {
      item.open = !item.open
    },
    projectChange(value, project, item) {
      console.log(value, project, item)
    },
    //下一步
    nextStep() {
      uni.navigateTo({
        url: '/pages/charge/checkstand',
      })
    },
  },
  watch: {},
  components: { chargeButton },
}
</script>
<style lang="scss" scoped>
.select-charge-wrap {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  box-sizing: border-box;

  .search-input {
    margin: 16rpx 32rpx;
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 8rpx;
    padding: 0 28rpx;

    .iconsearch {
      margin-right: 20rpx;
      color: #bfbfbf;
    }
  }

  .projects-wrap {
    font-size: 30rpx;
    line-height: 30rpx;
    flex-grow: 2;
    overflow-y: scroll;

    .list-wrap {
      padding: 0 0 0 32rpx;
      background: #fff;
    }

    .classify {
      &:last-child {
        border-bottom: none;
      }

      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 32rpx 0;
        border-bottom: 2rpx solid #f5f5f5;

        .iconfont {
          padding-right: 32rpx;
          color: #bfbfbf;
        }
      }
    }

    .project {
      display: flex;
      align-items: center;
      padding: 32rpx 0 32rpx 64rpx;
      justify-content: space-between;
      border-bottom: 2rpx solid #f5f5f5;

      &:last-child {
        border-bottom: none;
      }

      .checkBox {
        padding-right: 32rpx;
      }
    }
  }

  .bottom-wrap {
    padding: 16rpx 8rpx;
    display: flex;
    justify-content: space-between;
  }
}
</style>
