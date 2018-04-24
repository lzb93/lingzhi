import { homePage, favourite, goodsCategoryList, goodsList } from '../../../services/API'
import config from '../../../utils/config'

const App = getApp()
Page({
  data: {
    scrollTop: 0,
    ad: [], // 轮播
    new_goods: [], // 新产品
    hot_goods: [], // 热销产品
    host: config.host,
    keyword: '',
    isEmpt: false,
    isAgain: true,
    p: 2,
    isNomore: false,
    navbars: [],
  },
  onShareAppMessage(res) {
    return {
      title: '提兴灵芝',
      path: '/pages/HOME/home/home',
      success: function(res) {
        console.log("转发成功")
      },
      fail: function(res) {
        console.log("转发失败")
      }
    }
  },
  onLoad() {
    homePage()
    .then(({ status, result, msg}) => {
      if (status !== 1) Promise.reject(msg)
      this.setData({
        ad: result.ad,
        new_goods: result.new_goods,
        hot_goods: result.hot_goods,
      })
    })
    .catch((e) => {
      App.wxAPI.alert(msg)
    })
    
    setTimeout(() => {
      goodsCategoryList()
      .then(({ status, result, msg }) => {
        if (status === 1) {
          this.setData({ navbars: result })
          result.forEach((item, index) => {
            goodsList({ id: item.id })
            .then(({ status, result, msg }) => {
              if (status === 1) {
                let res = this.data.navbars
                res[index]['content'] = result.goods_list || []
                this.setData({ navbars: res })
              } else {
                App.wxAPI.alert(msg)
              }
            })
          })
        } else {
          App.wxAPI.alert(msg)
        }
      })
    }, 2000)
    
  },
  onReachBottom () {
    if( !this.data.isAgain ) return
    this.setData({ isAgain: false, })
    favourite({ p: this.data.p })
    .then(({ status, result, msg }) => {
      if (status === 1) {
        let arr = this.data.hot_goods.concat(result.favourite_goods)
        this.setData({ 
          p: ++this.data.p,
          isAgain: true,
          hot_goods: arr
        })
        if (result.favourite_goods.length < 10) {
          this.setData({ 
            isAgain: false, 
            isNomore: true 
          })
        }
      } else {
        App.wxAPI.alert(msg)
      }
    })
  },
  jumpType(e) {
    App.typeMsg = {
      id: e.currentTarget.dataset.id,
      index: e.currentTarget.dataset.index
    }
    console.log(App.typeMsg)
    wx.switchTab({
      url: `/pages/TYPE/type/type`
    })  
  },
  // onPageScroll: function (e) {
  //   setTimeout(() => this.setData({ scrollTop: e.scrollTop }), 500)
  // },
  onblur(e) {
    setTimeout(() => {
      this.setData({
        isEmpt: false
      })
    }, 50)
    this.setData({
      keyword: e.detail.value
    })
  },
  onfocus(e) {
    const keyword = e.detail.value 
    if (keyword != '') {
      this.setData({
        isEmpt: true
      })
    }
  },
  oninput(e) {
    let keyword = e.detail.value 
    if (keyword != '') {
      this.setData({
        isEmpt: true,
        keyword
      })
    } else {
      this.setData({
        isEmpt: false
      })
    }
    return keyword.trim()
  },
  empt() {
    setTimeout(() => {
      this.setData({
        keyword: ''
      })
    }, 50)
  },
  search() {
    const keyword = this.data.keyword
    if (keyword) {
      wx.navigateTo({
        url: `../../TYPE/prduct/prduct?keyword=${keyword}`
      })
    }
  },
  onLoop(e) {
    // console.log(e.detail)
  }
})