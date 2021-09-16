<template>
  <div>
    <dpmsDatetimePicker
      isCell
      :disabled="disabled"
      :placeholder="placeholder"
      :fields="fields"
      :defaultValue="defaultValue"
      @change="onChange"
      :showDayOfWeek="showDayOfWeek"
    >
      <dpmsCell
        :title="title"
        :required="required"
        isLink
        :placeholder="placeholder"
        :value="pickerValue"
      />
    </dpmsDatetimePicker>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '请选择日期时间',
    },
    // 表示选择器的粒度，有效值：year | month | day | hour | minute
    fields: {
      type: String,
      default: 'minute',
    },
    required: {
      type: Boolean,
      default: false,
    },
    title: String,
    value: [String, Number],
    showDayOfWeek: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {}
  },
  computed: {
    defaultValue() {
      let v = this.value

      if (this.value) {
        v = moment(this.value).format('YYYY-MM-DD HH:mm')
      }

      return v
    },
    pickerValue() {
      const formatStr = this.showDayOfWeek
        ? 'YYYY-MM-DD/ddd HH:mm'
        : 'YYYY-MM-DD HH:mm'
      return this.value ? moment(this.value).format(formatStr) : ''
    },
  },
  methods: {
    onChange(value) {
      this.$emit('input', moment(value.dt).valueOf())
    },
  },
  components: {},
}
</script>

<style></style>
