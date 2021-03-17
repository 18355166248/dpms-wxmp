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

export default OS;
