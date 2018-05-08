// pages/USER/pinglun/pinglun.js
import { orderDetail, cancelOrder1, cancelOrder2, orderConfirm, delOrder, getGoodsaddcomment} from '../../../services/API.js'
import { uploadFile } from '../../../utils/request'
import { format } from '../../../utils/utils'
// import { uploadFileQueue } from '../../../utils/request'
const App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    host: App.host,
    tempimg:[],
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
    App.wxAPI.chooseImage({num:9})
      .then(({ tempFiles }) => {
        this.setData({
          tempFiles: tempFiles
        })
        const arr=[];
        const length = tempFiles.length;
        for (let i = 0; i < length;i++){
          uploadFile(App.host + '?m=Api&c=User&a=uploadImg', tempFiles[i]).then(res =>{
            if(JSON.parse(res).status ==1){
              arr.push(JSON.parse(res).result);
              if (arr.length == length){
                this.setData({
                  tempimg: arr
                })
              }
            }
          })

        }
        
      })
      .catch(e => {
        App.wxAPI.alert(e)
      })
  },


  pinglunFabu() {
    console.log(this.data.tempimg)
    return

    var ids={}
    // var imgs =[]
    // this.data.tempFiles.forEach(item => {
    //   imgs.push(item.path)

    // })
    if (this.data.content.length<5){
      App.wxAPI.alert("评论字数不能少于10个字节")
      return
    }

    if (this.data.tempFiles.length>0){
    
      // 上传图片

 
      
      var tempimg
      return uploadFileQueue(App.host + '?m=Api&c=User&a=uploadImg', this.data.tempFiles)
        .then(({ status, result, msg }) => {
          tempimg.push(result)
      
          if (status === 1) {
            this.setData({
              tempFiles: tempimg
            })
            this.fabutijiao();
          } else {
            App.wxAPI.alert(msg)
          }

        })
        .catch(e => {
          App.wxAPI.alert(e)
        })
    }else{
      this.fabutijiao();
    }
   


  

  },
  
  // 发布提交
  fabutijiao(){
    // console.log(this.data.tempimg)
    if (this.data.content.length < 5) {
      App.wxAPI.alert("评论字数不能少于5个字")
      return
    }
 
   
    // 执行发布
    getGoodsaddcomment({
      order_id: this.data.order_id,    //订单id
      goods_id: this.data.goods_id,   //商品id
      goods_score: this.data.score,//星级
      content: this.data.content,//内容
      is_anonymous: this.data.anonymous, //是否密名1或0
      img: this.data.tempimg,//上传晒单图片 后面 [0]表示第一张 [1]第二张[2]第三章 一次类推,可以多张图片
      // user_id: getApp().userInfo.user_id
    }).then(({ status, result, msg }) => {
        if (status === 1) {
          App.wxAPI.alert(msg);
          wx.navigateBack();

        } else {
          App.wxAPI.alert(msg)
        }
      })
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