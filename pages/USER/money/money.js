import { getUserCard, miniwithdrawals } from '../../../services/API';

const app = getApp();
Page({
  data: {
    price: '',
    card: '',
    pwd: ''
  },
  onLoad(options) {
    this.setData({
      price: options.price
    })
  },
  onShow() {
    getUserCard().then(({ status, result, msg }) => {
      if (status == 1) {
        if (!result) {
          app.wxAPI.confirm("去绑定一张银行卡？")
            .then(() => {
              wx.navigateTo({
                url: '/pages/USER/bindBankCard/bindBankCard?from=tixian'
              })
            })
            .catch(() => {
              wx.navigateBack()
            })
        }
        this.setData({
          card: result
        })
      }
    })
  },
  pwdBlur(e) {
    this.setData({
      pwd: e.detail.value
    })
  },
  submit() {
    let params = {
      card_number: this.data.card.card_number,
      money: this.data.price,
      password: this.data.pwd
    }
    if(!params.password) {
      app.wxAPI.alert('提现密码未输入!');
      return;
    }
    miniwithdrawals(params).then(({status, result, msg}) => {
      if(status == 1) {
        wx.navigateTo({
          url: '/pages/USER/comFinish/comFinish'
        })
      }
    })
  }
})