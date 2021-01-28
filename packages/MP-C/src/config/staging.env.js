const config = {
  env: 'staging',
  debug: {
    http: false,
    websocket: false,
    notVerifyPath: false,
  },
  enableNotReleaseCode: false,
  DPMSServerUrl: 'http://pre-tower.medcloud.cn/api/his/',
  SCRMServerUrl: 'http://pre-tower.medcloud.cn/api/',
  iconfontUrl: '//at.alicdn.com/t/font_1575084_5snnlrkarpw.js',
  microAppUrl: 'http://uat.scrm.laoganma.fun/scrm_vue/',
  scrmUrl: 'http://pre.scrm.medcloud.cn',
  DPMSAntdPrefixCls: 'dpms-ant',
  SCRMAntdPrefixCls: 'SCRM',
  appId: 'wxdc573e390f80f5c0',
}

export default config
