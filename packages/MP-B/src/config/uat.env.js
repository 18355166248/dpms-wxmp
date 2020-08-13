const config = {
  env: 'uat',
  debug: {
    http: false,
    websocket: false,
    notVerifyPath: false,
  },
  enableNotReleaseCode: false,
  DPMSServerUrl: 'http://uat.cloud.api.dental.laoganma.fun/',
  SCRMServerUrl: 'http://api.scrm.uat.laoganma.fun/',
  iconfontUrl: '//at.alicdn.com/t/font_1575084_5snnlrkarpw.js',
  microAppUrl: 'http://uat.scrm.laoganma.fun/scrm_vue/',
  scrmUrl: 'http://uat.scrm.laoganma.fun',
  DPMSAntdPrefixCls: 'dpms-ant',
  SCRMAntdPrefixCls: 'SCRM',
  useServerUrlRedirection: {
    open: true,
    pathMap: {
      institution: 'http://10.101.11.99:8442/',
    },
  },
}

export default config
