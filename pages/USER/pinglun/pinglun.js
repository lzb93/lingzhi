// pages/USER/pinglun/pinglun.js
import { orderDetail, cancelOrder1, cancelOrder2, orderConfirm, delOrder, getGoodsaddcomment} from '../../../services/API.js'
import { format } from '../../../utils/utils'
// import { uploadFileQueue } from '../../../utils/request'
const App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    host: App.host,
    tempFiles:[],
    order_id:"",
    goods_list:[],
    goods_id:{},
    score: 5,//星级
    anonymous:0, //是否密名1或0
    content:'',//内容
    xingji:[
      "../../../images/xin2.png",
      "../../../images/xin2.png",
      "../../../images/xin2.png",
      "../../../images/xin2.png",
      "../../../images/xin2.png",
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    let goods_list = JSON.parse(options.goods_list);
    let goods_id = goods_list[0].goods_id;  
    // if (goods_list.length=1){
    //   goods_id = goods_list[0].goods_id;  
    //   // goods_list.push(goods_list[0])

    // }
    // else{
    //   (goods_list || []).forEach(item => {
    //     goods_id.push(item.goods_id)
    //   })
    // }

    this.setData({
      order_id:options.order_id,
      goods_list: goods_list,
      goods_id:goods_id,
    }) 
  
  
  },
  chooseImage() {
    App.wxAPI.chooseImage()
      .then(({ tempFiles }) => {
        this.setData({
          tempFiles: tempFiles
        })     
      })
      .catch(e => {
        App.wxAPI.alert(e)
      })
  },
  pinglunFabu() {
    var ids={}
    if (this.data.content.length<10){
      App.wxAPI.alert("评论字数不能少于10个字")
      return
    }
    return getGoodsaddcomment({
      order_id: this.data.order_id,    //订单id
      goods_id: this.data.goods_id,   //商品id
      goods_score: this.data.score,//星级
      content: this.data.content,//内容
      is_anonymous: this.data.anonymous, //是否密名1或0
      comment_img_file: this.data.tempFiles,//上传晒单图片 后面 [0]表示第一张 [1]第二张[2]第三章 一次类推,可以多张图片
      // user_id: getApp().userInfo.user_id
    })
      .then(({ status, result, msg }) => {
        wxAPI.hideLoading()
        if (status === 1) {
          App.wxAPI.alert(msg)
     
        } else {
          App.wxAPI.alert(msg)
        }
      })
      .catch((e) => {
        App.wxAPI.alert(e)
      });

  },
  setpingjia(e){
    this.setData({

      content: e.detail.value
    }) 
  },
  xingji(e){
    let xingji = this.data.xingji
    for (let i = 0; i < 5; i++) {
      xingji[i] = "../../../images/xin1.png"
    }
    for (let i = 0; i < e.currentTarget.dataset.index+1; i++){
      xingji[i]="../../../images/xin2.png"  
    }
    this.setData({
      xingji: xingji,
      score: e.currentTarget.dataset.index + 1
    }) 
  }
 


})