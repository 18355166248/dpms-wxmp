export default {
  /**
   * 获取页面数据, 默认获取当前页 需要上一页数据传入-1, 以此类推
   * @param {*} index <number>
   */
  getPagesInfo(index = 0) {
    const pages = getCurrentPages();
    const page = pages[pages.length + (index - 1)];

    var info = page.data;

    return info;
  },
};
