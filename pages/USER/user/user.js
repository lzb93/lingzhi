const App = getApp()
Page({
  data: {
    userInfo: '',
    waitItems: [{
        text: '待付款',
        icon: 'icon_wait_pay.png',
        target: 'WAITPAY',
      }, {
        text: '待发货',
        icon: 'icon_wait_send.png',
        target: 'WAITSEND',
      }, {
        text: '待收货',
        icon: 'icon_wait_receipt.png',
        target: 'WAITRECEIVE',
      }, {
        text: '待评价',
        icon: 'icon_wait_end.png',
        target: 'WAITCCOMMENT',
      }
    ],
    jumpItems: [
      {
        icon: 'icon_user1.png',
        name: '售后/退款',
        target: `/pages/USER/returnOrder/returnOrder`
      }, 
      {
        icon: 'icon_user2.png', 
        name: '收货地址',
        target: '/pages/USER/address/address'
      },
     
      {
        icon: 'icon_user3.png',
        name: '我的优惠券',
        target: '/pages/USER/coupon/coupon'
      }, 
      {
        icon: 'icon_user4.png',
        name: '常见问题',
        target: '/pages/USER/help/help'
      }, 
      // {
      //   icon: 'icon_user_ps.png',
      //   name: '配送说明',
      //   target: '/pages/USER/distribution/distribution'
      // }, 
      // {
      //   icon: 'icon_user_sz.png',
      //   name: '设置',
      //   target: '/pages/USER/setup/setup'
      // }, 
      {
        icon: 'icon_user5.png',
        name: '我的收藏',
        target: '/pages/USER/collect/collect'
      },
    ]
  },
  onLoad() {
    this.setData({ userInfo: App.userInfo })
  },
  onShow() {
    let token = App.token
    if ( !token ) {
      // 没登录处理....
      App.getUserInfo(() => {
        this.setData({ userInfo: App.userInfo })
      })
      return
    }
    this.setData({ userInfo: App.userInfo })
  },
  login() {

  },
  // getUserInfo() {
  //   App.getUserInfo((userInfo) => {
  //     this.setData({ userInfo })
  //     console.log('setsuccess')
  //   })
  // },
  jumpOrder(e) {
    const target = e.currentTarget.dataset.target
    wx.navigateTo( {url: `/pages/USER/order/order?target=${target}`})
  }

})