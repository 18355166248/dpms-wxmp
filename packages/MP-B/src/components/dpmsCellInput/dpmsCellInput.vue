<template>
  <dpmsCell :title="title" :required="required" :isLink="isLink">
    <input
      :type="type"
      :value="value"
      @input="onChange"
      @blur="onBlur"
      placeholder-class="input-placeholder"
      :placeholder="placeholder"
    />
    <template v-slot:right-icon>
      <slot name="inputRight" />
    </template>
  </dpmsCell>
</template>

<script>
export default {
  props: {
    value: String,
    placeholder: String,
    title: {
      type: String,
      required: true,
    },
    required: {
      type: Boolean,
      required: false,
    },
    isLink: {
      type: Boolean,
      required: false,
    },
    type: {
      type: String,
      default: 'text',
    },
  },
  methods: {
    onChange(e) {
      this.$emit('input', e.detail.value)
    },
    onBlur(e) {
      this.$emit('blur', e.detail.value)
    },
  },
}
</script>

<style lang="scss" scoped>
.input-placeholder {
  font-size: 34rpx;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.25);
}
</style>
