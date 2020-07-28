<template>
  <dpmsCell :title="title" :required="required" :isLink="isLink">
    <input
      type="text"
      :value="value"
      @input="onChange"
      :placeholder="placeholder"
    />
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
  },
  methods: {
    onChange(e) {
      this.$emit('input', e.detail.value)
    },
  },
}
</script>

<style></style>
