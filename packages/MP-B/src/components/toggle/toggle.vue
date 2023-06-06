<template>
  <text>{{ isVisible ? text : '**' }}</text>
</template>

<script>
export default {
  name: 'Toggle',
  props: {
    isVisible: {
      type: Boolean,
      default: true,
    },
    text: {
      type: String,
      default: '',
    },
  },
}
</script>
