import { orderEdit, getAddressList, saveOrder, teamOrder } from '../../../services/API';

const app = getApp();
Page({
  data: {
    address: {},
    changeAddress: {},
    items: [],
    totalPrice: {},
    pageType: ''
  },
  onLoad(option) {
    this.setData({
      pageType: option.order_sn
    })
  },
  onShow() {
    app.changeAddress && this.setData({ changeAddress: app.changeAddress });
    if (this.data.pageType) {
      teamOrder({ order_sn: this.data.pageType}).then(({status, result, msg}) => {
        if(status == 1) {
          let items = [];
          result.order_goods.goods_price = result.order_goods.member_goods_price;
          items.push(result.order_goods);
          this.setData({
            address: result.addressList,
            items: items,
            totalPrice: {
              goods_num: result.order_goods.goods_num,
              total_fee: result.order_goods.member_goods_price
            }
          })
        }
      })
    } else {
      orderEdit({ address_id: this.data.changeAddress.address_id }).then(({ status, result, msg }) => {
        if (status == 1) {
          this.setData({
            address: result.userAddress,
            items: result.cartList,
            totalPrice: result.cartPriceInfo
          })
        }
      })
    }
  },
  changeAddress() {
    wx.navigateTo({
      url: '/pages/EXPRESS/address/address'
    })
  },
  // 提交
  save() {
    let params = {
      // user_id: this.data.userInfo.user_id,
      act: 'submit_order', // order_price 为价格变动submit_order为提交订单
      address_id: this.data.address_id,
      cart_form_data: JSON.stringify({ shipping_code: this.data.peiSong.shipping_code, user_note: this.data.user_note })
    }
    saveOrder(params)
      .then(({ status, result, msg }) => {
        if (status === 1) {
          wx.redirectTo({
            url: `/pages/CART/payment/payment?orderId=${result}`
          })
        } else {
          app.wxAPI.alert(msg)
          return Promise.reject(msg)
        }
      })
      .catch(e => {
        // App.wxAPI.alert(e)
        console.log(e)
      })
  }
})