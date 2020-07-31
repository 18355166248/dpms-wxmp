<template>
  <dpmsCell :title="title" :required="required" :isLink="isLink">
    <textarea
      :value="value"
      @input="onChange"
      v-if="type === 'textarea'"
      :auto-height="autosize"
      :placeholder="placeholder"
      placeholder-style="font-size: 34rpx; font-weight: 400; color: rgba(0, 0, 0, 0.25);"
    ></textarea>
    <input
      v-else
      :type="type"
      :value="value"
      @input="onChange"
      @blur="onBlur"
      placeholder-style="font-size: 34rpx; font-weight: 400; color: rgba(0, 0, 0, 0.25);"
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
    autosize: {
      type: Boolean,
      required: true,
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
textarea,
input {
  width: 100%;
}
</style>
