import { goodsInfo, goodsdetail, addCart, collectGoods } from '../../../services/API';
import { js_date_time } from '../../../utils/utils';

const WxParse = require('../../../utils/wxParse/wxParse.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    http: app.http,
    host: app.host,
    gallerys: [],
    goodsInfo: {},
    goodsContent: '',
    comments: [],
    specs: [],
    goodsPrices: [],
    detailComment: 'detail',
    isShowPop: false,
    buyType: 'buy',
    popImg: '',
    defaultPrice: "",
    selectedSpec: {},
    kefutop:true
  },
  //切换商品详情和评价
  detailTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      detailComment: tab
    })
  },
  onLoad(e) {
    goodsInfo({ id: e.id }).then(({ status, result, msg }) => {
      if (status == 1) {
        const comments = [];
        (result.comment || []).map((item) => {
          comments.push({
            add_time: js_date_time(item.add_time),
            content: item.content,
            username: item.username,
            head_pic: item.head_pic
          })
        });
        const specs = [];
        (result.goods_spec_list || []).forEach((spec) => {
          const items = [];
          (spec.spec_list || []).forEach((item, index) => {
            items.push({
              item: item.item,
              item_id: item.item_id,
              src: item.src,
              selected: index == 0 ? true: false
            })
          })
          specs.push({
            spec_list: items,
            spec_name: spec.spec_name
          })
        })
        this.setData({
          gallerys: result.gallery,
          goodsInfo:result.goods,
          comments: comments,
          specs: specs,
          popImg: result.goods.original_img,
          defaultPrice: result.goods.shop_price,
          goodsPrices: result.spec_goods_price
        })
        app.statistics = this.data.goodsInfo.statistics;
      }
    })
    goodsdetail({ id: e.id }).then(({ status, result, msg }) => {
      if (status == 1) {
        this.setData({
          goodsContent: result.goods_content
        })
        WxParse.wxParse('article', 'html', result.goods_content, this, 5);
      }
    })
  },
  buyOrAdd(e) {
    const buyType = e.currentTarget.dataset.type;
    this.setData({
      isShowPop: true,
      buyType: buyType
    })
    if(this.data.specs.length == 0) {
      const goods = this.data.goodsInfo;
      this.setData({
        selectedSpec: {
          goods_id: goods.goods_id,
          store_count: goods.store_count,
          price: goods.shop_price,
          num: 1
        }
      })
    } else {
      this.formatSelectedProduct();
    }
    
  },
  colsePop(e) {
    this.setData({
      isShowPop: false,
      buyType: "buy"
    })
  },
  sure(e) {
    let token = app.token;
    if (!token) {
      // 没登录处理....
      this.setData({
        isShowPop: false,
        buyType: "buy"
      })
      app.getUserInfo(() => {
        this.setData({ userInfo: app.userInfo })
      })

      return
    }
    const buyType = this.data.buyType;
    const selectedSpec = this.data.selectedSpec;
    let params = {
      goods_id: selectedSpec.goods_id,
      goods_num: selectedSpec.num,
      item_id: selectedSpec.item_id || 0
    }
    addCart(params).then(({ status, result, msg }) => {
      if (status === 1) {
        if (buyType === 'buy') {
          wx.switchTab({ url: '/pages/CART/cart/cart' });
        } else {
          this.colsePop();
          app.wxAPI.toast("加入成功");
        }
      } else {
        app.wxAPI.alert(msg)
      }
    })
  },
  selectSpec(e) {
    const specs = e.currentTarget.dataset.specs;
    const id = e.currentTarget.dataset.id;
    const name = e.currentTarget.dataset.name;
    (specs || []).forEach((spec) => {
      if(spec.spec_name == name) {
        (spec.spec_list || []).forEach((item) => {
          item.selected = item.item_id == id ? true : false;
        })
      }
    })
    this.setData({
      specs: specs
    })
    this.formatSelectedProduct();
  },
  formatSelectedProduct() {
    let selectedName = '';
    (this.data.specs || []).forEach((spec) => {
      (spec.spec_list || []).forEach((item) => {
        if(item.selected) {
          selectedName += "_" + item.item_id;
        }
      })
    })
    
    let selectedSpec = (this.data.goodsPrices || []).find((item) => {
      return ("_" + item.key) == selectedName;
    })
    if (selectedSpec) {
      selectedSpec.num = 1;
      this.setData({
        selectedSpec: selectedSpec
      })
    } else {
      this.setData({
        selectedSpec: {
          price: this.data.defaultPrice,
          store_count: 0,
          num: 1
        }
      })
    }
  },
  downNum() {
    let selectedSpec = this.data.selectedSpec
    if (selectedSpec.num > 1) {
      selectedSpec.num = --selectedSpec.num
      this.setData({ selectedSpec })
    }
  },
  upNum() {
    let selectedSpec = this.data.selectedSpec
    if (selectedSpec.num < selectedSpec.store_count) {
      selectedSpec.num = ++selectedSpec.num
      this.setData({ selectedSpec })
    }
  },
  onblur(e) {
    let num = e.detail.value;
    let selectedSpec = this.data.selectedSpec;
    if (num > 0 && num <= selectedSpec.store_count) {
      selectedSpec.num = num
      this.setData({ selectedSpec })
    }
  },
  collectFn(e) {
    let goodsInfo = this.data.goodsInfo;
    const goodsId = goodsInfo.goods_id;
    const isCollect = this.data.goodsInfo.is_collect ? 0 : 1;
    collectGoods({ goods_id: goodsId, type: isCollect }).then(({ status, result, msg }) => {
      if(status == 1) {
        goodsInfo.is_collect = isCollect;
        this.setData({ goodsInfo: goodsInfo });
        if (isCollect) {
          app.wxAPI.toast("已收藏");
        }
      }
    })
  },
  kefutop(e){
    this.setData({ kefutop: !this.data.kefutop });
  },
  makePhoneCall(e){
    wx.makePhoneCall({
      phoneNumber: '18907975577' //仅为示例，并非真实的电话号码
    })
  }
})