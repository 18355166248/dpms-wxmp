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
  ServerUrl: 'http://uat-tower.laoganma.fun/',
  iconfontUrl: '//at.alicdn.com/t/font_1965288_h9yn44x7c5t.js',
  microAppUrl: 'http://uat.scrm.laoganma.fun/scrm_vue/',
  scrmUrl: 'http://uat.scrm.laoganma.fun',
  DPMSAntdPrefixCls: 'dpms-ant',
  SCRMAntdPrefixCls: 'SCRM',
  appId: 'wxdc573e390f80f5c0',
}

export default config
