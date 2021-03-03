const config = {
  env: 'uat',
  debug: {
    http: false,
    websocket: false,
    notVerifyPath: false,
  },
  enableNotReleaseCode: false,
  useServerUrlRedirection: {
    open: false,
    pathMap: {
      'institution-customer': 'http://10.101.11.93:8449/',
    },
  },

  DPMSServerUrl: 'http://uat-tower.laoganma.fun/api/his/',
  SCRMServerUrl: 'http://uat-tower.laoganma.fun/api/',
  // DPMSServerUrl: 'http://7e618e2f.cpolar.io/api/his/',
  // SCRMServerUrl: 'http://7e618e2f.cpolar.io/api/',
  iconfontUrl: '//at.alicdn.com/t/font_1575084_5snnlrkarpw.js',
  microAppUrl: 'http://uat.scrm.laoganma.fun/scrm_vue/',
  scrmUrl: 'http://uat.scrm.laoganma.fun',
  DPMSAntdPrefixCls: 'dpms-ant',
  SCRMAntdPrefixCls: 'SCRM',
  appId: 'wxdc573e390f80f5c0',
}

export default config
