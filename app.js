//app.js
import * as API from './services/API'
import * as wxAPI from './services/wxAPI'
import config from './utils/config'
import { getUserInfo } from './services/auth';
App({
  userInfo: '', // 用户信息
  token: '', // 登录状态
  curEditAddress: '', // 当前编辑的地址
  curCheckedAddress: '', // 订单指定的地址
  wxAPI: wxAPI, // 微信api promise包装
  API: API, // api
  host: config.host, // baseUrl
  getUserInfo: getUserInfo, // 登录流程
  typeMsg: {
    id: null,
    index: null
  },
  onLaunch: function() {
    getUserInfo()
   
    // setTimeout(() => {
    //   wx.navigateTo({
    //     // url: '/pages/USER/order/order'
    //     // url: '/pages/USER/returnOrder/returnOrder'
    //     // url : '/pages/USER/balance/balance'
    //     // url: '/pages/USER/balanceExport/balanceExport'
    //     // url: '/pages/USER/balanceList/balanceList'
    //     url: '/pages/USER/editPassword/editPassword'
        
        
          
    //   })
    // }, 1000)
    
    // setTimeout(() => {
    //   wx.switchTab({
    //     url: '/pages/USER/user/user'
    //   })
    // }, 1000)
    // wx.setStorageSync('token', '1234232')
    // wx.removeStorageSync('token')
    // let token = wx.getStorageSync('token')
    // console.log(token)
  }
})