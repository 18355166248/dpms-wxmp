const commonMixins = {
  methods: {
    // 向下查找
    broadcast(componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params);
    },
    // 向上查找
    dispatch(componentNames, eventName, params) {
      let parent = this.$parent || this.$root;
      let name = parent.$options.name;

      while (parent && (!name || name !== componentNames)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.name;
        }
      }

      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
    // 向上查找最近的组件实例
    findComponentUpward(context, componentName) {
      let parent = context.$parent;
      let name = parent.$options.name;

      while (parent && (!name || [componentName].indexOf(name) < 0)) {
        parent = parent.$parent;
        if (parent) name = parent.$options.name;
      }
      return parent;
    },
  },
};

function broadcast(componentName, eventName, params) {
  this.$children.forEach((child) => {
    const name = child.$options.name;

    if (componentName === name) {
      child.$emit.call(child, eventName, params);
    } else {
      broadcast.call(child, componentName, eventName, params);
    }
  });
}

export default commonMixins;
