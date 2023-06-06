<template>
  <div>
    <slot />
  </div>
</template>

<script>
import _ from 'lodash'
import AsyncValidator from 'async-validator'

export default {
  name: 'dpmsForm',
  props: {
    rules: {
      type: Object,
    },
    model: {
      type: Object,
      default: {},
    },
  },
  methods: {
    validate(callback) {
      if (!_.isPlainObject(this.rules)) return

      let validator = new AsyncValidator(this.rules)

      validator.validate(this.model, (errors, fields) => {
        _.isFunction(callback) && callback(errors, fields)
      })
    },
  },
}
</script>

<style></style>
