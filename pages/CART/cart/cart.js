import { cartList, delCart, getGoodscoupons } from '../../../services/API'
import config from '../../../utils/config'
const App = getApp()
Page({
  data: {
    txtStyle: '',
    startX: 0,
    moveX: 0,
    endX: 0,
    disX: 0,
    host: config.host,
    items: [],
    total_price: {},
    num: 1,
    checkedLen: 0,
    isChecked: true,
    isNomore: false,
    iscouPon: false,
    isbianJi: true
  },
  onLoad() {},
  onShow() {
    let token = App.token
    if ( !token ) {
      // 没登录处理....
      App.getUserInfo(() => {
        this.onShow()
      })
      return
    }

    cartList().then(this.render)
  },
  render({ status, result, msg }) {
    if (status === 1) {
      this.setData({
        items: result.cartList,
        total_price: result.total_price,
        checkedLen: result.cartList.filter(item => item.selected).length
      })
      const is = this.isCheckedAll()
      this.setData({ isChecked: is ? false : true})
      const len = this.data.items.length == 0
      this.setData({ isNomore: len ? true : false })
    } else {
      App.wxAPI.alert(msg)
    }
  },
  checked(e) {
    const index = e.currentTarget.dataset.index
    const obj = this.data.items[index]
    let params = [{
      selected: obj.selected ? 0 : 1,
      cartID: obj.id,
      goodsNum: obj.goods_num,
      user_id: getApp().userInfo.user_id
    }]
    cartList({ cart_form_data: JSON.stringify(params) })
    .then(this.render)
  },
  checkedAll() {
    const is = this.isCheckedAll()
    const arr = this.data.items
    let params = []
    arr.forEach(item => {
      params.push({
        selected: is ? 1 : 0,
        cartID: item.id,
        goodsNum: item.goods_num,
        user_id: getApp().userInfo.user_id
      })
    })
    console.log(params);
    console.log(arr)
    cartList({ cart_form_data: JSON.stringify(params) })
    .then(this.render)
  },
  // 判断是全选 还是 全反选
  isCheckedAll() {
    const arr = this.data.items
    return !arr.every(({ selected }) => selected == 1)
  },
  del(e) {
    App.wxAPI.confirm('确定删除？')
    .then(() => {

      if (e.currentTarget.dataset.index){
        const index = e.currentTarget.dataset.index
        const obj = this.data.items[index]
        return delCart({ ids: obj.id })
      }else{
    
        var dsid = this.data.items.filter(item => item.selected);
        let idsarr=[];
        
        // 判断dsid是否是数组，不是的话跳过，是就循环获取id
        (dsid || []).forEach(item => {
          idsarr.push(item.id)
        })

        //  Map方法转换数据

        // let arr = (dsid || []).map(item => {
        //   return item.id;
        // })
        // console.log(arr)

        return delCart({ ids: idsarr })    
      }
      
    })
    .then(({ status, result, msg}) => {
      if (status === 1) {
        cartList().then(this.render)
        App.wxAPI.toast('删除成功')
      } else {
        App.wxAPI.alert(msg)
      }
    })
  },
  onblur(e) {
    let num = e.detail.value 
    const index = e.currentTarget.dataset.index
    const obj = this.data.items[index]
    let params = [{
      selected: obj.selected,
      cartID: obj.id,
      goodsNum: num <= 0 ? 1 : num
    }]
    cartList({ cart_form_data: JSON.stringify(params) })
    .then(this.render) 
  },
  add(e) {
    const index = e.currentTarget.dataset.index
    const obj = this.data.items[index]
    if (obj.goods_num < 99) {
      let params = [{
        selected: obj.selected,
        cartID: obj.id,
        goodsNum: ++obj.goods_num
      }]
      cartList({ cart_form_data: JSON.stringify(params) })
      .then(this.render) 
    }
  },
  subtract(e) {
    const index = e.currentTarget.dataset.index
    const obj = this.data.items[index]
    if (obj.goods_num > 1) {
      let params = [{
        selected: obj.selected,
        cartID: obj.id,
        goodsNum: --obj.goods_num
      }]
      cartList({ cart_form_data: JSON.stringify(params) })
      .then(this.render)  
    }
  },
  settlement() {
    if (this.data.checkedLen <= 0) {
      return App.wxAPI.alert('尚选中任何商品')
    }
    wx.navigateTo({url: '../payOrder/payOrder'})
  },
  start(e) {
    let startX = e.changedTouches[0].clientX
    console.log('start:'+startX)
    this.setData({startX: startX, disX: 0})
  },
  move(e) {
    let moveX = e.changedTouches[0].clientX
    let disX = this.data.startX - moveX;
    if (Math.abs(disX) < 30) {
      return 
    }
    this.setData({moveX: moveX, disX: disX})
  },
  end(e) {
    let endX = e.changedTouches[0].clientX
    let items = this.data.items
    let index = e.currentTarget.dataset.index
    if (this.data.disX > 40) {
      items[index]['txtStyle'] = 'transform: translateX(-13%); transition: transform 0.1s ease-in;'
    } else if (this.data.disX < -30) {
      items[index]['txtStyle'] = 'transform: translateX(0); transition: transform 0.1s ease-in;'
    }
    this.setData({items: items})
  },

  // 领券
  coupondk(e){
    this.setData({
      iscouPon: true
    })
    let goods = e.currentTarget.dataset.goods;
    // 返回优惠券列表
    return getGoodscoupons({ store_id: goods })
    

  },
  couponlingqu(e) {
    App.wxAPI.toast("领券成功")

  },
  coupongb(e) {
    this.setData({
      iscouPon: false
    })
  },

  // 编辑
  bianji(){
    this.setData({
      isbianJi: false
    })
  },
  wancheng() {
    this.setData({
      isbianJi: true
    })
  },

})
