<template>
  <picker
    :value="pickerValue"
    @change="onChange"
    mode="date"
    :start="start"
    :end="end"
    :header-text="headerText"
  >
    <dpmsCell
      :title="title"
      :required="required"
      isLink
      :placeholder="placeholder"
      :value="pickerValue"
    />
  </picker>
</template>

<script>
export default {
  props: {
    value: [String, Number],
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
    start: String,
    end: String,
    headerText: String,
  },
  data() {
    return {
      pickerValue: this.value,
    }
  },
  watch: {
    value(newVal) {
      this.pickerValue = newVal
    },
  },
  methods: {
    onChange(e) {
      this.pickerValue = e.detail.value
      this.$emit('input', e.detail.value)
    },
  },
}
</script>
