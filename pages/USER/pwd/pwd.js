import { bindingpwd, getUserMobile, getTelCode } from '../../../services/API';
//获取应用实例
const app = getApp()

Page({
  data: {
    pwd: '',
    comfirmPwd: '',
    mobile: '',
    isShowCode: false,
    btn: '获取验证码',
    countDown: false,
    code: ''
  },
  onLoad() {

  },
  onShow() {
    getUserMobile().then(({ status, result, msg }) => {
      if (status == 1) {
        if (!result) {
          app.wxAPI.confirm("去绑定手机号？")
            .then(() => {
              wx.navigateTo({
                url: '/pages/USER/bindTel/bindTel?from=mobile'
              })
            })
            .catch(() => {
              wx.navigateBack()
            })
        } else {
          this.setData({
            mobile: result
          })
        }
      }
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
  blurCode(e) {
    this.setData({
      code: e.detail.value
    })
  },
  submit() {
    let params = {
      password: this.data.pwd,
      sencond_password: this.data.comfirmPwd,
      mobile: this.data.mobile,
      type: 2,
      code: this.data.code
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
    bindingpwd(params).then(({status, result, msg}) => {
      if(status == 1) {
        app.wxAPI.toast(msg)
        wx.navigateBack({
          delta: 1
        })
      } else {
        app.wxAPI.alert(msg);
      }
    })
  },
  getCode() {
    const countDown = this.data.countDown;
    getTelCode({ mobile: this.data.mobile, type: 2 }).then(({ status, result, msg }) => {
      if(status == 1) {
        this.setData({
          isShowCode: true,
          countDown: true
        })
        this.countDown(this);
      } else {
        app.wxAPI.alert(msg);
      }
    })
  },
  countDown(that) {
    let second = 59;
    const time = setInterval(() => {
      second -= 1;
      that.setData({
        btn: '重新发送(' + second + ')'
      })
      if (second < 0) {
        clearInterval(time);
        this.setData({
          btn: '重新发送',
          countDown: false
        })
      }
    }, 1000)
  },
})
