import { setPassword } from '../../../services/API';
const App = getApp()
Page({
  data: {
    verifyCode: '',
    userInfo: {}
  },
  onLoad(e) {
    this.setData({
      userInfo: App.userInfo
    })

    wx.setNavigationBarTitle({
      title: "设置密码"
    })
  },
  save(e) {
    let obj = e.detail.value
    if (obj.new_password !== obj.new_password_again) {
      return App.wxAPI.alert('两次密码不一致，请重新输入')
    }
    setPassword({ paypwd: obj.new_password })
    .then(({ status, result, msg }) => {
      if (status === 1) {
        App.wxAPI.alert(msg)
        .then(() => {
          return wx.navigateBack()
        })
      } else {
        App.wxAPI.alert(msg)
      }
    })
    .catch(e => {
      App.wxAPI.alert(msg)
    })
  }

})
