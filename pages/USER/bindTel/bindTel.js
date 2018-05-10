import { getTelCode, bindingMobile } from '../../../services/API';

const app = getApp();
Page({
  data: {
    selected: true,
    tel: '',
    code: '',
    isShowCode: false,
    btn: '获取验证码',
    countDown: false,
    from: ''
  },
  onLoad(options) {
    this.setData({
      from: options.from
    })
  },
  selectService() {
    let selected = this.data.selected;
    this.setData({
      selected: !selected
    })
  },
  blurTel(e) {
    this.setData({
      tel: e.detail.value
    })
  },
  blurCode(e) {
    this.setData({
      code: e.detail.value
    })
  },
  getCode() {
    const countDown = this.data.countDown;
    if(this.data.tel.length < 11) {
      app.wxAPI.alert("手机号码不对!");
      return;
    }
    if (countDown) {
      return;
    }
    getTelCode({ mobile: this.data.tel, type: 1 }).then(({status, result, msg}) => {
      this.setData({
        isShowCode: true,
        countDown: true
      })
      this.countDown(this);
      // if(status == 1) {
      //   this.sertData({
      //     isShowCode: true
      //   })
      // }
    })
  },
  countDown(that) {
    let second = 15;
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
  submit() {
    let params = {
      mobile: this.data.tel,
      code: this.data.code
    }
    if (!this.data.code) {
      app.wxAPI.alert('验证码未填写!');
      return;
    }
    if (!this.data.selected) {
      app.wxAPI.alert('服务声明未同意!');
      return;
    }
    bindingMobile(params).then(({status, result, msg}) => {
      if(status == 1) {
        const from = this.data.from;
        if(from) {
          wx.navigateBack();
        } else {
          app.wxAPI.toast(msg);
        }
      } else {
        app.wxAPI.alert(msg);
      }
    })
  }
})