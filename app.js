//app.js
import * as API from './services/API'
import * as wxAPI from './services/wxAPI'
import config from './utils/config'
import { getUserInfo } from './services/auth';

let setting = require('setting.js');
App({
  globalData: {
    setting: setting
  },
  userInfo: {}, // 用户信息
  token: '', // 登录状态
  curEditAddress: {}, // 当前编辑的地址
  sendAddress: {}, //寄件人地址
  collectAddress: {}, //收件人地址
  orderAddress: {}, //订单地址
  queryExpress: '', //查询快递数据
  statistics: '', //评论信息
  wxAPI: wxAPI, // 微信api promise包装
  API: API, // api
  http: config.http,// baseUrl
  host: config.host, 
  getUserInfo: getUserInfo, // 登录流程
  typeMsg: {
    id: null,
    index: null
  },
  onLaunch: function (e) {
    this.userInfo.firstLeader = e.query.userId;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              getUserInfo()
            }
          })
        }
      }
    })
  }
})