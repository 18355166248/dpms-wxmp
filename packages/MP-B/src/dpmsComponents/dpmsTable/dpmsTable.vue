<template>
  <scroll-view class="dpmsTable">
    <wyb-table
      ref="table"
      :headers="headers"
      :contents="contents"
      :height="height"
      :first-line-fixed="firstLinefixed"
      firstColBgColor="#ffffff"
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
    headers: {
      type: Array,
      required: true,
    },
    height: {
      type: String,
      required: true,
    },
  },
  components: {
    wybTable,
  },
  data() {
    return {}
  },
}
</script>

//
<style lang="scss">
// .dpmsTable {
// }
//
</style>
