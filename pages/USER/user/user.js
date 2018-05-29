import { teamList, getButton } from '../../../services/API';

const app = getApp();
Page({
  data: {
    userInfo: '',
    authorize: true,
    isShowButton: false,
    userNav: [
      {
        type: 'WAITPAY',
        src: '../../../images/pay.png',
        name: '待付款'
      },
      {
        type: 'WAITSEND',
        src: '../../../images/pend.png',
        name: '待发货'
      },
      {
        type: 'WAITRECEIVE',
        src: '../../../images/good.png',
        name: '待收货'
      },
      {
        type: 'WAITCCOMMENT',
        src: '../../../images/finish.png',
        name: '完成'
      },
      {
        type: 'RETURN',
        src: '../../../images/icon_refund.png',
        name: '退款'
      }
    ],
    items: [
      // {
      //   id: 1,
      //   flag: true,
      //   name: '拼团订单',
      //   src: '../../../images/icon_user_team.png',
      //   url: '/pages/TEAM/order/order'
      // },
      {
        id: 2,
        flag: true,
        name: '售后列表',
        src: '../../../images/icon_user1.png',
        url: '/pages/USER/refund/refund'
      },
      {
        id: 3,
        flag: true,
        name: '我的地址',
        src: '../../../images/icon_user2.png',
        url: '/pages/EXPRESS/address/address'
      },
      {
        id: 4,
        flag: true,
        name: '商品收藏',
        src: '../../../images/icon_user5.png',
        url: '/pages/USER/collect/collect'
      },
      // {
      //   id: 5,
      //   flag: true,
      //   name: '余额/下级',
      //   src: '../../../images/icon_user1.png',
      //   url: '/pages/USER/lower/lower'
      // },
      {
        id: 6,
        flag: true,
        name: '领劵中心',
        src: '../../../images/icon_user3.png',
        url: '/pages/USER/notused/notused'
      },
      // {
      //   id: 7,
      //   flag: true,
      //   name: '信息绑定',
      //   src: '../../../images/icon_user_bind.png',
      //   url: '/pages/USER/binding/binding'
      // }
    ]
  },
  onLoad() {
    this.setData({ userInfo: app.userInfo })
  },
  onShow() {
    let authorize = wx.getStorageSync('authorize')
    this.setData({ authorize: authorize })
    let token = app.token;
    if (!token) {
      // 没登录处理....
      app.getUserInfo(() => {
        this.setData({
           userInfo: app.userInfo,
           authorize: true
        })
        wx.setStorage({
          key: 'authorize',
          data: true,
        })
      })
      return
    }else{
      this.setData({ authorize: true })
    }
    this.setData({ userInfo: app.userInfo })
    getButton().then(({status, result, msg}) => {
      if(status == 1) {
        let arr = this.data.items;
        arr.forEach(item => {
          if(item.id == 5) {
            item.flag = result == 2 ? true : false
          }
        })
        this.setData({
          items: arr
        })
      }
    })
  },
  openUserNav(e) {
    const type = e.currentTarget.dataset.type;
    if (type == 'RETURN') {
      wx.navigateTo({
        url: `/pages/USER/refundOrder/refundOrder`
      })
    } else {
      wx.navigateTo({
        url: `/pages/USER/order/order?type=${type}`
      })
    }
  },
  // 授权
  bindGetUserInfo() {
    app.getUserInfo(() => {
      this.setData({ userInfo: app.userInfo })
    })
    let that = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              that.setData({
                authorize: true
              })
              wx.setStorage({
                key: 'authorize',
                data: true,
              })
            }
          })
        }
      },
      fail: function (error) {
        
      }
    })
  },
  quxiao() {
    this.setData({
      authorize: true
    })
    wx.switchTab({
      url: '/pages/HOME/home/home',
    })
  }
})