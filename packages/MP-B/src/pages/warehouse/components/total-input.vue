<template>
  <view>
    <input type="digit" :value="currentValue" @input="change" />
  </view>
</template>
<script>
export default {
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: Infinity,
    },
    value: {
      type: Number,
    },
    precision: {
      type: Number,
      default: 2,
    },
  },
  data() {
    return {
      focused: false,
      currentValue: this.value,
    }
  },
  computed: {},
  watch: {
    value: {
      // immediate: true,
      handler: 'updateValue',
    },
  },
  methods: {
    updateValue(val) {
      console.log(`${this.name}:`, val)
      this.currentValue = val
      this.$emit('input', this.currentValue)
      this.$emit('on-change', this.currentValue)
      // this.$nextTick(() => {

      // })
    },
    change(event) {
      let val = Number(event.target.value)
      this.updateValue(val)
    },
  },
}
</script>
