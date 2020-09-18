const config = {
  env: 'staging',
  debug: {
    http: false,
    websocket: false,
    notVerifyPath: false,
  },
  enableNotReleaseCode: false,
  DPMSServerUrl: 'http://pre.api.dental.his.medcloud.cn/',
  SCRMServerUrl: 'https://api.scrm.medcloud.cn/',
  iconfontUrl: '//at.alicdn.com/t/font_1575084_5snnlrkarpw.js',
  microAppUrl: 'http://uat.scrm.laoganma.fun/scrm_vue/',
  scrmUrl: 'http://pre.scrm.medcloud.cn',
  DPMSAntdPrefixCls: 'dpms-ant',
  SCRMAntdPrefixCls: 'SCRM',
}

export default config
