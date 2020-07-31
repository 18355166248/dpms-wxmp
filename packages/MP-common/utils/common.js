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
      return Object.values(CCEnumUtil.create(enumObj).properties).map((v) => ({
        ...v,
        zh_CN: v.text.zh_CN,
      }));
    }
  },

  /**
   * 千分位数字字符串
   * @param  {Number|String} num 原始数据
   * @param  {String} lang 语言
   * @param  {String} currencySymbol 货币符号
   */
  formatPrice(num, lang = "en", currencySymbol = "￥") {
    const number = Number(num);

    const toleranceNum = Number.isNaN(number) ? 0 : number;

    const formatNumberStr = Intl.NumberFormat(lang).format(toleranceNum);

    return `${currencySymbol}${formatNumberStr}`;
  },
};
