<template>
  <dpmsCell :title="title">
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
    title: String,
    placeholder: String,
  },
  methods: {
    onChange(e) {
      this.$emit('input', e.detail.value)
    },
  },
}
</script>

<style></style>
