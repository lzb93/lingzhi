const App = getApp()
import {search, orderbyDefault, newinfo, hotinfo} from '../../../services/API.js'
import {dalay} from '../../../utils/utils'
Page({
  data: {
    host: App.host,
    items: [],
    activeSort: 0,
    url: '',
    id: '', // 商品分类id
    p: 1,
    allData: '',
    isAgain: true,
    isNomore: false, 
    isNoSearch: false, 
  },
  onLoad(e) {
    wx.setNavigationBarTitle({title: '商品列表'})
    // var arr = getCurrentPages()
    const keyword = e.keyword
    const target = e.target

    // let ctx = ''
    // if ( keyword ) {
    //   ctx = keyword
    // } else if( target === 'new_goods') {
    //   ctx = target
    // } else if ( target === 'hot_goods' ) {
    //   ctx = target
    // } else {
    //   console.log('没传任何参数')
    // }
    this.search(keyword || target)
  },
  search(keyword) {
    // console.log('search:'+keyword)
    ;((keyword == 'new_goods')  ?  newinfo({p:1}) : (keyword == 'hot_goods' ? hotinfo({p:1}) : search({P: 1, q: keyword})))
    .then(({status, result, msg}) => {
      if (status === 1) {
        let goods_list = result.goods_list || []
        if(goods_list.length === 0) {
          this.setData({ isNoSearch: true })
        }
        let arr = this.data.items.concat(goods_list)
        this.setData({
          items: arr,
          allData: result,
          url: result.orderby_default,
          p: ++this.data.p
        })
        if (goods_list.length < 15) {
          this.setData({isAgain: false, isNomore: true})
        }
      } else {
        App.wxAPI.alert(msg)
      }
    })
  },
  tabSortbar(e) {
    if (!dalay(500)) 
      return
    const url = e.currentTarget.dataset.url
    const index = e.currentTarget.dataset.index
    this.reset()
    this.setData({activeSort: index, url: url})
    this.sort(this.data.url, {p: this.data.p})
  },
  onReachBottom() {
    if (!dalay(500)) return
    if (!this.data.isAgain) return
    this.setData({ isAgain: false })
    this.sort(this.data.url, {p: this.data.p})
  },
  sort(url, params) {
    orderbyDefault(url, params).then(({status, result, msg}) => {
      if (status === 1) {
        let goods_list = result.goods_list || []
        if (goods_list.length === 0) {
          this.setData({ isNoSearch: true })
        }
        let arr = this.data.items.concat(goods_list)
        this.setData({
          items: arr,
          p: ++this.data.p,
          allData: result,
          isAgain: true
        })
        if (goods_list.length < 15) {
          this.setData({isAgain: false, isNomore: true})
        }
      } else {
        App.wxAPI.alert(msg)
      }
    })
  },
  reset() {
    this.setData({
      items: [],
      activeSort: 0,
      p: 1,
      id: '',
      url: '',
      isAgain: true,
      isNomore: false,
      isNoSearch: false
    })
  }
})