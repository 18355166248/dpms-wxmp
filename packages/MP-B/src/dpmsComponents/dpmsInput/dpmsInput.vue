<template>
  <input type="text" @input="handleInput" :value="currentValue" />
</template>

<script>
import commonMixns from 'mpcommon/mixins/common'

export default {
  name: 'dpmsInput',
  mixins: [commonMixns],
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      currentValue: this.value,
    }
  },
  created() {},
  methods: {
    handleInput(event) {
      const value = event.target.value
      this.currentValue = value
      console.log(value)
      this.$emit('input', value)
      this.dispatch('dpmsFormItem', 'on-form-change', value)
    },
    handleBlur() {
      this.dispatch('dpmsFormItem', 'on-form-blur', this.currentValue)
    },
  },
}
</script>

<style scoped lang="scss">
input {
  font-size: 14px;
  display: block;
  width: 100%;
  padding: 0 15px;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
  height: 40px;
  line-height: 40px;
  color: #606266;
}
</style>
