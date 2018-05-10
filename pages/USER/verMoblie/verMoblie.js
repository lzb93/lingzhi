import { verifMobile, getUserMobile, getTelCode } from '../../../services/API';
//获取应用实例
const app = getApp()

Page({
  data: {
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
  blurCode(e) {
    this.setData({
      code: e.detail.value
    })
  },
  submit() {
    let params = {
      mobile: this.data.mobile,
      code: this.data.code
    }
    if(!params.code) {
      app.wxAPI.alert('请输入验证码!');
      return;
    }
    verifMobile(params).then(({status, result, msg}) => {
      if(status == 1) {
        wx.navigateTo({
          url: `/pages/USER/bindPwd/bindPwd?mobile=${this.data.mobile}`
        })
      }
    })
  },
  getCode() {
    const countDown = this.data.countDown;
    getTelCode({ mobile: this.data.mobile, type: 2 }).then(({ status, result, msg }) => {
      if (status == 1) {
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
