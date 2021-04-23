<template>
  <scroll-view class="dpmsTable">
    <wyb-table
      ref="table"
      :headers="headers"
      :contents="contents"
      height="90vh"
      :url-col="urlCol"
      :first-line-fixed="firstLinefixed"
    />
  </scroll-view>
</template>

<script>
import wybTable from '@/components/wyb-table/wyb-table.vue'

export default {
  name: 'dpmsTable',
  props: {
    firstLinefixed: {
      type: Boolean,
      required: false,
    },
    contents: {
      type: Array,
      required: true,
    },
  },
  components: {
    wybTable,
  },
  data() {
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
.dpmsTable {
}
</style>
