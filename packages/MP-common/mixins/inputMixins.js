export default {
  data() {
    return {
      isScroll: true,
    };
  },
  methods: {
    // 获取焦点事件
    bindFocus() {
      this.isScroll = false;
    },
    // 失去焦点事件
    closeBlur() {
      this.isScroll = true;
    },
  },
};
