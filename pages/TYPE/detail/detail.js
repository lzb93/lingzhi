import { goodsInfo, goodsContent, addCart, collectGoods, getGoodsComment } from '../../../services/API.js'
import { dalay, format} from '../../../utils/utils'

const WxParse = require('../../../utils/wxParse/wxParse.js')
const App = getApp()
Page({
  data:{
    host: App.host,
    activeDetail: 0,
    isShowPopou: false,
    goods: {}, // 商品详情
    goods_spec_list: [], //商品选项
    spec_goods_price: [], // 规格映射表
    gallery: [], // 轮播图
    goods_content: '', //详情图片说明
    goods_attr_list: [], //详情参数说明
    specs: {}, // 
    popouIns: '', // addcart buy
    pinlun:[
      {
        img: '../../../images/icon4.jpg',
        times:12312313,
        text:"这是评论阿萨德还多久爱欧式基调建瓯",
        textimg: [
          '../../../images/icon4.jpg',
          '../../../images/icon4.jpg'
        ],
      },
      {
        img: '../../../images/icon4.jpg',
        times: 12312313,
        text: "222这是评论阿萨德还多久爱欧式基调建瓯",
        textimg: [
          '../../../images/icon4.jpg',
          '../../../images/icon_kefu.png',
          '../../../images/icon4.jpg',
          '../../../images/icon_kefu.png',
          '../../../images/icon4.jpg'
        ],
      },
      {
        img: '../../../images/icon4.jpg',
        times: 123123213,
        text: "这是评23论阿萨德还多久爱欧式基调建瓯",
        textimg: "dasdasd",
      }
    ]
  },
  onLoad(e) {
    wx.setNavigationBarTitle({title: '商品详情'})
    let target = e.target
    // console.log(target)
    // target = 1
    this.goodsInfo(target)
    this.goodsContent(target)

    // 加载评论
    return getGoodsComment({goods_id:target})
      .then(({ status, result, msg }) => {
        if (status === 1) {
          result.forEach(item => {

            item.add_time = format(item.add_time * 1000, 'yyyy.MM.dd hh:mm:ss');
          })
          this.setData({
            pinlun: result
          })

        } else {
          App.wxAPI.alert(msg)
        }
      })
    // var article = '&lt;p style=&quot;text-align: center;&quot;&gt;&lt;img src=&quot;/public/upload/goods/2016/03-09/56e01a6586cd0.jpg&quot; title=&quot;4.jpg&quot;/&gt;&lt;/p&gt;';
    
  },
  onReady() {
  },
  goodsInfo(target) {
    goodsInfo({ id: target}) 
    .then(({status, result, msg}) => {
      if (status === 1) {
        this.setData({ 
          goods: result.goods,
          goods_spec_list: result.goods_spec_list,
          gallery: result.gallery,
          goods: result.goods,
          spec_goods_price: result.spec_goods_price
        })
        this.specsInit()
      } else {
        App.wxAPI.alert(msg)
      }
    })
  },
  goodsContent(target) {
    goodsContent({ id: target})
    .then(({status, result, msg}) => {
      if (status === 1) {
        this.setData({ 
          goods_content: result.goods_content,
          goods_attr_list: result.goods_attr_list
        })
        WxParse.wxParse('article', 'html', result.goods_content, this, 5);
      } else {
        App.wxAPI.alert(msg)
      }
    })
  },
  specsInit() {
    this.setData({ 
      specs: { 
        goods_id: this.data.goods.goods_id, // 产品ID
        imgUrl:  this.data.host + this.data.goods.original_img, // 图片
        store_count: this.data.goods.store_count, //库存
        price: this.data.goods.shop_price, // 价格
        num: 1, // 数量
        // key: '', // spec_list_spec_list_spec_list
        item_id: '', // key对应的规格ID
      }
    })
  },
  tabSpec(e) {
    const pub_index = e.currentTarget.dataset.spec_index
    const sub_index = e.currentTarget.dataset.index
    let goods_spec_list = this.data.goods_spec_list
    // 选中操作
    goods_spec_list[pub_index]['spec_list'].forEach((item, index) => {
      if (index === sub_index) {
        item.active = true
        if (item.src) {
          // 设置选中的图片
          let specs = this.data.specs
          specs.imgUrl = this.data.host + item.src
          this.setData({ specs })
        }
      } else {
        item.active = false 
      }
    })
    const activeAll = this.getActiveAll()
    const activeAllLenth = activeAll.length
    const specLength = goods_spec_list.length
    if (specLength === activeAllLenth) {
      const obj = this.mapSpecPrice(activeAll.join('_'))
      let specs = this.data.specs
      specs.item_id = obj.item_id
      specs.price = obj.price
      specs.store_count = obj.store_count
      this.setData({ specs })
    }
    this.setData({ goods_spec_list: goods_spec_list })    
  },
  // 
  mapSpecPrice(key) {
    const spec_goods_price = this.data.spec_goods_price
    const obj = spec_goods_price.filter((item) => {
      return item['key'] == key
    })[0]
    return obj
  },
  // 获取选中的item_id
  getActiveAll() {
    let arr = []
    let goods_spec_list = this.data.goods_spec_list
    goods_spec_list.forEach((pubItem, index) => {
      pubItem['spec_list'].forEach((item) => {
        if ( item.active ) {
          arr.push(item.item_id)
        }
      })
    })
    return arr
  },
  tabDetail (e) {
    const index = e.currentTarget.dataset.index
    this.setData({ activeDetail: index })
  },
  save() {
    let params = {
      goods_id: this.data.specs.goods_id, 
      item_id: this.data.specs.item_id || 0,
      goods_num: this.data.specs.num
    }
    addCart(params)
    .then(({status, result, msg}) => {
      if (status === 1) {
        if (this.data.popouIns === 'buy') {
          wx.switchTab({ url: '/pages/CART/cart/cart' })
        } else {
          this.closePopou()
          App.wxAPI.toast("加入成功")
        }
      } else {
        App.wxAPI.alert(msg)
      }
    })
  },
  call() {
    // App.wxAPI.confirm('拨打电话?')
    // .then(() => {
    //   wx.makePhoneCall({ phoneNumber: '10000' })
    // })
    wx.makePhoneCall({ phoneNumber: '10000' })
  },
  collect() {
    const is_collect = this.data.goods.is_collect ? 0 : 1
    collectGoods({
      goods_id: this.data.goods.goods_id,
      type: is_collect,
      user_id: App.userInfo.user_id
    })
    .then(({status, result, msg}) => {
      if (status === 1) {
        let goods = this.data.goods
        goods.is_collect = is_collect
        if (is_collect) {
          App.wxAPI.toast("已收藏")
        }
        this.setData({ goods })
      } 
    })
  },
  openPopou(e) {
    const ins = e.currentTarget.dataset.ins
    this.setData({ 
      popouIns: ins,
      isShowPopou: true
    })
  },
  closePopou() {
    this.setData({ isShowPopou: false })
  },
  stopPopou: () => false,
  add() {
    let specs = this.data.specs
    if(specs.num < 99) {
      specs.num = ++specs.num
      this.setData({ specs })
    }
  },
  subtract() {
    let specs = this.data.specs
    if(specs.num > 1) {
      specs.num = --specs.num
      this.setData({ specs })
    }
  },
  onblur(e) {
    let num = e.detail.value 
    if(num > 0 && num <= 99) {
      let specs = this.data.specs
      specs.num = num
      this.setData({ specs })
    }
  },
})
