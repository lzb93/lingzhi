import { getMoney } from '../../../services/API';

const app = getApp();
Page({

  data:{
    money: '',
    price: ''
  },
  onLoad(options) {
    this.setData({
      money: options.money
    })
  },
  allMoney() {
    this.setData({
      price: this.data.money
    })
  },
  priceBlur(e) {
    this.setData({
      price: e.detail.value
    })
  },
  submit() {
    const price = this.data.price;
    if (price == 0) {
      app.wxAPI.alert("提现金额需大于0");
      return;
    }
    if(!price || price > this.data.money) {
      app.wxAPI.alert("提现金额错误!");
      return;
    }
    wx.navigateTo({
      url: `/pages/USER/money/money?price=${price}`
    })
  }
})