/*!
 * Toast轻提示
 */
export default {
  /**
   * 显示提示框
   * @param {String} value
   * @param {Object} 覆盖配置
   * @return {void}
   */
  show(value, config) {
    uni.showToast({
      title: value,
      icon: "none",
      duration: 2000,
      ...config,
    });
  },
  /**
   * 隐藏提示框
   */
  clear() {
    uni.hideToast();
  },
  /**
   * 显示loading
   * @param {string, object} option 字符串或者对象选项
   * @return {void}
   */
  showLoading(option) {
    if (typeof option === "string") {
      const value = option;

      uni.showLoading({
        title: value,
      });
    } else {
      uni.showLoading(option);
    }
  },
  /**
   * 关闭loading
   */
  clearLoading() {
    uni.hideLoading();
  },
};
