import { orderEdit, saveOrder, dopay } from '../../../services/API'
const App = getApp()
Page({
  data: {
    host: App.host,
    items: [],
    userInfo: {},
    totalPrice: {},
    addressList: {},
    shippingList: [],
    peiSong: {}, //配送方式
    address_id: '',
    user_note: ''
    // balance: 0, //使用的余额
  },
  onLoad() {
    wx.setNavigationBarTitle({ title: '商品订单'})
  },
  onShow() {
    orderEdit({ address_id: App.curCheckedAddress || '' })
    .then(({ status, result, msg }) => {
      if (status === 1 ) {
        this.setData({
          items: result.cartList,
          totalPrice: result.totalPrice,
          addressList: result.addressList,
          shippingList: result.shippingList,
          userInfo: result.userInfo,
          peiSong: result.shippingList[0], // 设置默认的配送方式
        })
        
        if ( result.addressList ) {
          console.log(result)
          this.setData({ address_id: result.addressList.address_id })
          this.change()
        } else {
          App.wxAPI.confirm("去新建一个收货地址？")
          .then(() => {
            wx.navigateTo({
              url: '/pages/USER/addressEdit/addressEdit?from=payOrder'
            })
          })
          .catch(() => {
            wx.navigateBack()
          })
        }
      } else {
        App.wxAPI.alert(msg)
      }
    })
  },
  openPeiSong() {
    const shippingList = this.data.shippingList
    const _this = this
    wx.showActionSheet({
      itemList: shippingList.map(({ name }) => name),
      success ({ tapIndex }) {
        if (typeof tapIndex == 'number') {
          _this.setData({ peiSong: shippingList[tapIndex] })
          _this.change()
        }
      }
    })
  },
  // useBalance(e) {
  //   let balance = e.detail.value
  //   this.setData({ balance })
  //   console.log(+balance > +this.data.userInfo.user_money)
  //   if (+balance > +this.data.userInfo.user_money) {
  //     this.setData({ balance: 0 })
  //     return App.wxAPI.alert('您的账户余额没有这么多')
  //   }
  //   this.change()
  // },
  leaveMsgBlur(e) {
    this.setData({ 
      user_note: e.detail.value
    })
    console.log(this.data.user_note)
  },
  // 价格变动（使用积分，选择物流）
  change() {
    let params = {
      user_id: this.data.userInfo.user_id,
      act: 'order_price',
      address_id: this.data.address_id,
      // user_money: this.data.balance,
      cart_form_data: JSON.stringify({shipping_code: this.data.peiSong.shipping_code})
      // cart_form_data: JSON.stringify({"shipping_code":"shentong","user_note":"","coupon_id":0,"couponCode":""})
    }
    saveOrder(params)
    .then(({ status, result, msg }) => {
      if (status === 1) {
        let totalPrice = this.data.totalPrice
        let peiSong = this.data.peiSong
        totalPrice.total_fee = result.payables //应付总额
        peiSong.postFee = result.postFee
        this.setData({ 
          totalPrice,
          peiSong
        })
      } else {
        App.wxAPI.alert(msg)
      }
    })
  },
  // 提交
  save() {
    let params = {
      user_id: this.data.userInfo.user_id,
      act: 'submit_order', // order_price 为价格变动submit_order为提交订单
      address_id: this.data.address_id,
      // user_money: this.data.balance,
      cart_form_data: JSON.stringify({ shipping_code: this.data.peiSong.shipping_code, user_note: this.data.user_note })
      // cart_form_data: JSON.stringify({"shipping_code":"shentong","user_note":"","coupon_id":0,"couponCode":""})
    }
    saveOrder(params)
    .then(({ status, result, msg }) => {
      if (status === 1) {
        wx.redirectTo({
          url: `/pages/CART/payment/payment?orderId=${result}`
        })
      } else {
        App.wxAPI.alert(msg)
        return Promise.reject(msg)
      }
    })
    .catch(e => {
      // App.wxAPI.alert(e)
      console.log(e)
    })
  },

})