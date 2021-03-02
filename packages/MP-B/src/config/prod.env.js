const config = {
  env: 'prod',
  debug: {
    http: false,
    websocket: false,
    notVerifyPath: false,
  },
  enableNotReleaseCode: false,
  DPMSServerUrl: 'https://power.medcloud.cn/api/his/',
  SCRMServerUrl: 'https://power.medcloud.cn/api/',
  iconfontUrl: '//at.alicdn.com/t/font_1575084_5snnlrkarpw.js',
  microAppUrl: 'http://scrm.medcloud.cn/scrm_vue/',
  scrmUrl: 'https://scrm.medcloud.cn',
  DPMSAntdPrefixCls: 'dpms-ant',
  SCRMAntdPrefixCls: 'SCRM',
}

export default config
