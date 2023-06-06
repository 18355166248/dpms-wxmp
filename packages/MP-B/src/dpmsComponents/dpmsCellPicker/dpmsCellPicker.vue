<template>
  <picker
    :range-key="defaultProps.label"
    :range="list"
    :value="selectIndex"
    @change="onChange"
    :mode="mode"
    :end="end"
    :header-text="headerText"
    :disabled="disabled"
  >
    <dpmsCell
      :title="title"
      :required="required"
      :isLink="!disabled"
      :placeholder="placeholder"
      :value="pickerValue"
      :hideBorderBottom="hideBorderBottom"
      :disabled="disabled"
    >
      <template #title
        ><slot name="title">{{ title }}</slot></template
      >
    </dpmsCell>
  </picker>
</template>

<script>
export default {
  props: {
    mode: {
      type: String,
      default: 'selector', // selector, multiSelector, time, date, region
    },
    list: {
      type: Array,
      default: [],
    },
    value: [String, Number],
    defaultType: {
      type: String,
      default: 'label',
    },
    defaultProps: {
      type: Object,
      default: { label: 'label', value: 'value' },
    },
    placeholder: String,
    required: {
      type: Boolean,
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    isLink: {
      type: Boolean,
      required: false,
    },
    end: String,
    headerText: String,
    disabled: {
      type: Boolean,
      required: false,
    },
    hideBorderBottom: {
      type: Boolean,
      required: false,
    },
  },
  computed: {
    pickerValue() {
      const pickerIndex = this.list.findIndex(
        (item) => item[this.defaultType] === this.value,
      )

      this.selectIndex = pickerIndex === -1 ? 0 : pickerIndex

      return pickerIndex > -1
        ? this.list[pickerIndex][this.defaultProps.label]
        : ''
    },
    pickerKey() {
      if (this.defaultProps.label === this.defaultType) {
        return this.defaultProps.label
      }
      if (this.defaultProps.value === this.defaultType) {
        return this.defaultProps.value
      }
    },
  },
  watch: {
    list(newVal) {
      if (this.value) {
        this.selectIndex = this.list.findIndex((item) => {
          const v = item[this.pickerKey]

          return v === this.value
        })
      }
    },
  },
  data() {
    return {
      selectIndex: 0,
    }
  },
  created() {
    if (this.value) {
      this.selectIndex = this.list.findIndex((item) => {
        const v = item[this.pickerKey]

        return v === this.value
      })
    }
  },
  methods: {
    onChange(e) {
      let index = e.detail.value
      let value = index

      if (this.mode === 'selector') {
        value = this.list[index]
      }

      // if (this.mode === 'multiSelector') {
      //   value = []
      //   e.detail.value.forEach((index2, i) => {
      //     value.push(this.list[i][index2])
      //   })
      // }

      this.selectIndex = index

      this.$emit('input', value && value[this.defaultType], value)
    },
  },
}
</script>

<style></style>
