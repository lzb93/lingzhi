import { withdrawals, getVerifyCode } from '../../../services/API';
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
    console.log(getVerifyCode())
    this.setData({
      verifyCode: getVerifyCode()
    })

    wx.setNavigationBarTitle({
      title: "申请提现"
    })
  },
  save(e) {
    let obj = e.detail.value
    withdrawals(obj)
    .then(({ status, result, msg }) => {
      if (status === 1) {
        App.wxAPI.alert(msg)
        .then(() => {
          wx.navigateBack()
        })
      } else {
        App.wxAPI.alert(msg)
      }
    })
    .catch(e => {
      App.wxAPI.alert(msg)
    })
  //   {
  //     account_bank: val.account_bank, //银行卡号
  //     account_name: val.account_name, //账户名称
  //     bank_name: val.bank_name,       //银行名称
  //     money: val.money,
  //     verify_code: val.verify_code,
  //     paypwd: val.paypwd
  // }
  }

})
