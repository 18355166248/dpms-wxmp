<template>
  <div>
    <wyb-table
      ref="table"
      :headers="headers"
      :contents="contents"
      height="600rpx"
      :url-col="urlCol"
    />
  </div>
</template>

<script>
import wybTable from '@/components/wyb-table/wyb-table.vue'
export default {
  components: {
    wybTable,
  },
  data() {
    const theUrl = '/pages/demos/noticeBar-demo/more' // 本地的某个页面
    const httpUrl = 'https://ext.dcloud.net.cn/plugin?id=2667' // 某个网址
    return {
      headers: [
        {
          label: '姓名',
          key: 'name',
        },
        {
          label: '年龄',
          key: 'age',
        },
        {
          label: '学院',
          key: 'collage',
        },
        {
          label: '成绩',
          key: 'score',
        },
        {
          label: '路由',
          key: 'url',
        },
        {
          label: '网址',
          key: 'link',
        },
      ],
      contents: [
        {
          name: '刘一',
          age: '',
          collage: '信息学院',
          score: '99',
          url: ['查看更多', theUrl],
          link: '',
        },
        {
          name: '陈二',
          age: '18',
          collage: '商学院',
          score: '98',
          url: ['我带参数', theUrl, { name: '陈二' }],
          link: '',
        },
        {
          name: '张三',
          age: '22',
          collage: '统计与数学学院',
          score: '97',
          url: ['查看更多', theUrl],
          link: '',
        },
        {
          name: '李四',
          age: '19',
          collage: '城市与环境学院',
          score: '96',
          url: '',
          link: ['访问网址', httpUrl],
        },
        {
          name: '王五',
          age: '20',
          collage: '旅游与酒店管理学院',
          score: '95',
          url: ['查看更多', theUrl],
          link: '',
        },
        {
          name: '赵六 ',
          age: '20',
          collage: '',
          score: '88',
          url: ['查看更多', theUrl],
          link: '',
        },
        {
          name: '孙七',
          age: '21',
          collage: '',
          score: '95',
          url: '',
          link: ['访问网址', httpUrl],
        },
        {
          name: '周八 ',
          age: '21',
          collage: '会计学院',
          score: '85',
          url: ['查看更多', theUrl],
          link: '',
        },
        {
          name: '吴九 ',
          age: '20',
          collage: '',
          score: '91',
          url: ['查看更多', theUrl],
          link: '',
        },
        {
          name: '郑十',
          age: '19',
          collage: '',
          score: '95',
          url: '',
          link: ['访问网址', httpUrl],
        },
      ],
      urlCol: [
        {
          type: 'route',
          key: 'url',
        },
        {
          type: 'http',
          key: 'link',
        },
      ],
    }
  },
}
</script>

<style lang="scss">
.dpmsSearch {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
  box-sizing: border-box;
  padding: 20rpx 24rpx;
  .search__content {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    padding-left: 16rpx;
    border-radius: 8rpx;
  }
  .cell {
    position: relative;
    display: flex;
    box-sizing: border-box;
    width: 100%;
    overflow: hidden;
    font-size: 28rpx;
    line-height: 48rpx;
    flex: 1;
    padding: 10rpx 16rpx 10rpx 0;
    background-color: transparent;
    align-items: center;
  }
  .cell__value {
    position: relative;
    overflow: hidden;
    color: #969799;
    text-align: right;
    vertical-align: middle;
    word-wrap: break-word;
  }
  .cell__title,
  .cell__value {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
  }
  .field__left-icon {
    margin-right: 10rpx;
    font-weight: 700;
    .icon-search {
      font-size: 40rpx;
      color: rgba($color: #000000, $alpha: 0.25);
    }
  }

  .icon {
    position: relative;
    display: inline-block;
    font-size: inherit;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
  }
  .field__control {
    font-size: 28rpx;
    display: block;
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    margin: 0;
    padding: 0;
    color: #323233;
    line-height: inherit;
    text-align: left;
    background-color: transparent;
    border: 0;
    resize: none;
  }
  .field__body {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    .iconfont {
      opacity: 0.65;
    }
  }
  .field__value {
    overflow: visible;
  }
  .search__action {
    padding: 0 24rpx;
    color: $common-color;
    font-size: 28rpx;
    line-height: 68rpx;
  }

  .icon-clear {
    color: #c8c9cc;
    font-size: 30rpx;
    padding: 0 10rpx;
  }
  .placeholderClass {
    color: rgba($color: #000000, $alpha: 0.25);
  }
}
.search-show-action {
  padding-right: 0;
}
</style>
