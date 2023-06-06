/*!
 * Toast轻提示
 */

/**
 * 显示提示框
 * @param {String} value
 * @param {Object} 覆盖配置
 * @return {void}
 */
function show(value, config) {
  uni.showToast({
    title: value,
    icon: "none",
    duration: 2000,
    ...config,
  });
}
/**
 * 隐藏提示框
 */
function clear() {
  uni.hideToast();
}
/**
 * 显示loading
 * @param {string, object} option 字符串或者对象选项
 * @return {void}
 */
function showLoading(option) {
  if (typeof option === "string") {
    const value = option;

    uni.showLoading({
      title: value,
    });
  } else {
    uni.showLoading(option);
  }
}
/**
 * 关闭loading
 */
function clearLoading() {
  uni.hideLoading();
}
// 显示导航栏loading
function showNavBarLoading() {
  uni.showNavigationBarLoading();
}
// 隐藏导航栏loading
function hideNavBarLoading() {
  uni.hideNavigationBarLoading();
}
// 隐藏返回首页按钮
function hideHomeButton() {
  uni.hideHomeButton();
}
// 显示loading和导航栏loading
function showPageLoading(option) {
  showLoading(option);
  showNavBarLoading();
}
// 隐藏loading和导航栏loading
function hidePageLoading() {
  clearLoading();
  hideNavBarLoading();
}
export default {
  show,
  clear,
  showLoading,
  clearLoading,
  showNavBarLoading,
  hideNavBarLoading,
  hideHomeButton,
  showPageLoading,
  hidePageLoading,
};
