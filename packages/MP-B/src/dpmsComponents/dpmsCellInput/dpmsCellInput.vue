<template>
  <dpmsCell :title="title" :required="required" :isLink="isLink">
    <input
      :type="type"
      :value="value"
      @input="onChange"
      @blur="onBlur"
      @focus="onFocus"
      placeholder-style="font-size: 34rpx; font-weight: 400; color: rgba(0, 0, 0, 0.25);"
      :placeholder="placeholder"
      :maxlength="max"
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
    max: {
      type: Number,
      default: 140,
    },
  },
  methods: {
    onChange(e) {
      this.$emit('input', e.detail.value.trim())
    },
    onBlur(e) {
      this.$emit('blur', e.detail.value.trim())
    },
    onFocus(e) {
      this.$emit('focus', e.detail.value.trim())
    },
  },
}
</script>

<style lang="scss" scoped>
textarea,
input {
  flex: 1;
  font-size: 34rpx;
}

textarea {
  text-align: left;
  width: auto;
}
</style>
