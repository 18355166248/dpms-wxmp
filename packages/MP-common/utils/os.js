const OS = function () {
  let info = uni.getSystemInfoSync();
  let os = {};
  os.info = info;
  os.android = info.platform == "android";
  os.iphone = info.brand == "iPhone";
  os.ios = info.platform == "ios";
  os.iphoneType = info.model.replace(/^iPhone \w+<$/);
  os.iphoneX = info.model.match(/iPhone X/) ? true : false;
  os.screenHeight = info.screenHeight;
  os.screenWidth = info.screenWidth;
  os.windowHeight = info.windowHeight;
  os.windowWidth = info.windowWidth;
  os.statusbarHeight = info.statusbarHeight;
  os.screen159 = info.screenWidth == 360 && info.windowHeight < 540;
  os.screen189 =
    (info.screenWidth == 360 && info.windowHeight > 590) ||
    (info.screenWidth == 393 && info.windowHeight > 660);
  os.xiaomi =
    info.brand.match(/Xiaomi/) || info.brand.match(/Redmi/) ? true : false;
  os.huawei = info.brand.match(/HUAWEI/) ? true : false;
  os.oppo = info.brand.match(/OPPO/) ? true : false;
  os.vivo = info.brand.match(/vivo/) ? true : false;

  return os;
};

// 获取手机系统信息
export const getSystemInfo = function () {
  const res = wx.getSystemInfoSync();
  let articleBoxClass = "";
  const os = {};
  os.windowW = res.safeArea ? res.safeArea.width : res.windowWidth;
  os.windowH = res.safeArea ? res.safeArea.height : res.windowHeight;
  os.screenProp = os.windowW / os.windowH;
  if (os.screenProp < 0.53) articleBoxClass = "screen189";
  if (os.screenProp >= 0.53 && os.screenProp <= 0.64)
    articleBoxClass = "screenNormal";
  if (os.screenProp > 0.64) articleBoxClass = "screen159";

  return articleBoxClass;
};

export default OS;
