import { bindingpwd, getUserMobile, getTelCode } from '../../../services/API';
//获取应用实例
const app = getApp()

Page({
  data: {
    pwd: '',
    comfirmPwd: '',
    mobile: ''
  },
  onLoad(options) {
    this.setData({
      mobile: options.mobile
    })
  },
  comPwd(e) {
    this.setData({
      pwd: e.detail.value
    })
  },
  comComfirmPwd(e) {
    this.setData({
      comfirmPwd: e.detail.value
    })
  },
  submit() {
    let params = {
      password: this.data.pwd,
      sencond_password: this.data.comfirmPwd,
      mobile: this.data.mobile,
      type: 1
    }
    if (!params.password) {
      app.wxAPI.alert("提现密码未输入!");
      return;
    }
    if (!params.sencond_password) {
      app.wxAPI.alert("再次确认密码未输入!");
      return;
    }
    if (params.password != params.sencond_password) {
      app.wxAPI.alert("两次输入的密码不一致!");
      return;
    }
    bindingpwd(params).then(({ status, result, msg }) => {
      if (status == 1) {
        app.wxAPI.toast(msg)
        wx.switchTab({
          url: '/pages/USER/user/user'
        })
      } else {
        app.wxAPI.alert(msg);
      }
    })
  }
})