import { CCEnumUtil } from "@arctic/tools";

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

  // 获取枚举值,注意枚举值一定要统一为Storage中的‘enums’字段
  getEnums(key) {
    let enumObj = uni.getStorageSync("enums")[key];
    if (enumObj) {
      let properties = CCEnumUtil.create(enumObj).properties;
      for (let key in properties)
        properties[key] = {
          ...properties[key],
          zh_CN: properties[key].text.zh_CN,
        };
      return properties;
    }
  },
};
