import { getCategory, getGoodsList, orderbyDefault } from '../../../services/API.js'
import { dalay } from '../../../utils/utils'
const App = getApp()
Page({
  data: {
    host: App.host,
    navbars: [],
    items: [],
    activeNav: 0,
    activeSort: 0,
    url: '',
    id: '', // 商品分类id
    p:0,
    allData: '',
    isAgain: true,
    isNomore: false,
    scrollLeft: 0,
  },
  onLoad() {
    getCategory()
      .then(({ status, result, msg }) => {
        if (status === 1) {
          this.setData({ navbars: result })
          if (App.typeMsg.index !== null) {
            this.setData({ activeNav: App.typeMsg.index, id: App.typeMsg.id })
          } else {
            this.setData({ activeNav: 0, id: result[0].id })
          }
          this.getGoodsList()
        } else {
          App.wxAPI.alert(msg)
        }
      })
  },
  onShow() {
    // 模拟点击
    if (App.typeMsg.index != null && App.typeMsg.index != this.data.activeNav) {
      this.tabNavbar({
        currentTarget: {
          dataset: {
            id: App.typeMsg.id,
            index: App.typeMsg.index
          }
        }
      })
    }
  },
  tabNavbar(e) {
    const id = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    this.move(index) // 控制挪动
    this.reset()
    dalay(500) // 防止触发 到底
    this.setData({ activeNav: index, id: id })
    App.typeMsg = {
      id: id,
      index: index
    }
    // this.data.id = id
    this.getGoodsList()
  },
  getGoodsList(params) {
    getGoodsList({ category_id: this.data.id, page: this.data.p })
      .then(({ status, result, msg }) => {
        if (status === 1) {
          console.log(result);
          let goods_list = result || []
          let arr = this.data.items.concat(goods_list)

          // ...
          if (this.data.p === 0 && goods_list.length < 10) {
            this.setData({ isNomore: true })
          }
          this.setData({
            items: arr,
            allData: result,
            url: result.orderby_default,
            p: ++this.data.p
          })

        } else {
          App.wxAPI.alert(msg)
        }
      })
  },
  reset() {
    this.setData({
      items: [],
      activeSort: 0,
      p: 0,
      id: '',
      url: '',
      isAgain: true,
      isNomore: false
    })
  },
  onReachBottom() {
    if (!dalay(500)) return
    if (!this.data.isAgain) return
    this.setData({ isAgain: false })
    this.sort(this.data.url, { p: this.data.p })
  },
  tabSortbar(e) {
    if (!dalay(500)) return
    const url = e.currentTarget.dataset.url
    const index = e.currentTarget.dataset.index
    this.reset()
    this.setData({ activeSort: index, url: url })
    this.sort(this.data.url, { p: this.data.p })
  },
  sort(url, params) {
    orderbyDefault(url, params)
      .then(({ status, result, msg }) => {
        if (status === 1) {
          let goods_list = result || []
          let arr = this.data.items.concat(goods_list)
          this.setData({
            items: arr,
            p: ++this.data.p,
            allData: result,
            isAgain: true,
          })
          if (goods_list.length < 15) {
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

  scroll(e) {
    console.log(e)
  },
  move(index) {
    const len = this.data.navbars.length
    if (len < 6) return;
    const needLeft = 2 // 0, 1 右边移动
    const needRight = len - 3 // 5, 6做移动
    if (index <= needLeft) {
      this.setData({ scrollLeft: 0 })
    } else if (index >= needRight) {
      this.setData({ scrollLeft: 150 })
    }
  }
})
