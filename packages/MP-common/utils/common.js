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
      let enums = CCEnumUtil.create(enumObj);
      for (let key in enums.properties)
        enums.properties[key] = {
          ...enums.properties[key],
          zh_CN: enums.properties[key].text.zh_CN,
        };
      return enums;
    }
  },

  /**
   * 千分位数字字符串
   * @param  {Number|String} money 原始金额
   * @param  {String} sysmbol 货币符号
   * @param  {Number} places 小数位
   */
  formatPrice(money, sysmbol = "¥", places = 2) {
    const zero = `${sysmbol}0.00`;

    if (isNaN(money) || money === "") return zero;

    if (money && money != null) {
      money = `${money}`;
      let left = money.split(".")[0]; // 小数点左边部分
      let right = money.split(".")[1]; // 小数点右边
      // 保留places位小数点，当长度没有到places时，用0补足。
      right = right
        ? right.length >= places
          ? "." + right.substr(0, places)
          : "." + right + "0".repeat(places - right.length)
        : "." + "0".repeat(places);
      var temp = left
        .split("")
        .reverse()
        .join("")
        .match(/(\d{1,3})/g); // 分割反向转为字符串然后最多3个，最少1个，将匹配的值放进数组返回
      const numericalSymbols = Number(money) < 0 ? "-" : "";
      return (
        sysmbol +
        numericalSymbols +
        temp.join(",").split("").reverse().join("") +
        right
      ); // 补齐正负号和货币符号，数组转为字符串，通过逗号分隔，再分割（包含逗号也分割）反向转为字符串变回原来的顺序
    } else if (money === 0) {
      return zero;
    } else {
      return zero;
    }
  },
};
