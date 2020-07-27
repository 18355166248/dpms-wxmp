<template>
  <div class="content">
    <tki-tree
      ref="tkitree"
      idKey="id"
      rangeKey="name"
      selectParent
      :range="list"
      @confirm="treeConfirm"
    ></tki-tree>
  </div>
</template>

<script>
import tkiTree from './tki-tree.vue'

export default {
  components: { tkiTree },
  data() {
    return {
      list: [
        {
          id: 1,
          name: '北京市',
          children: [
            {
              id: 11,
              name: '市辖区',
              children: [
                {
                  id: 111,
                  name: '西城区',
                  children: [
                    {
                      id: 1111,
                      name: '南河沿大街',
                      children: [
                        {
                          id: 11111,
                          name: '紫金宫饭店',
                          checked: true,
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 112,
                  name: '东城区',
                },
                {
                  id: 113,
                  name: '朝阳区',
                },
                {
                  id: 114,
                  name: '丰台区',
                },
              ],
            },
          ],
        },
      ],
    }
  },
  onLoad() {},
  methods: {
    // 显示树形选择器
    showTree() {
      this.$refs.tkitree._show()
    },
  },
}
</script>

<style lang="scss" scoped></style>
