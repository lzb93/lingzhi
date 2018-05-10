import { bindingBankCard } from '../../../services/API';
import { uploadFile } from '../../../utils/request'

const app = getApp();
Page({
  data: {
    http: app.http,
    card_img: '',
    name: '',
    cardNumber: ''
  },
  onLoad(options) {
    this.setData({
      from: options.from || ''
    })
  },
  chooseImage() {
    app.wxAPI.chooseImage({num: 1})
      .then(({ tempFiles }) => {
        return uploadFile(app.host + 'c=User&a=uploadImg', tempFiles[0]);
      })
      .then(res => {
        this.setData({
          card_img: JSON.parse(res).result
        })
      })
      .catch(e => {
        app.wxAPI.alert(e)
      })
  },
  bindName(e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindCardNum(e) {
    this.setData({
      cardNumber: e.detail.value
    })
  },
  submit() {
    let params = {
      card_number: this.data.cardNumber,
      name: this.data.name,
      card_img: this.data.card_img
    };
    if (!params.name) {
      app.wxAPI.alert('请输入持卡人姓名！');
      return;
    }
    if (!params.card_number) {
      app.wxAPI.alert('请输入银行卡卡号！');
      return;
    }
    if (!params.card_img) {
      app.wxAPI.alert('未上传银行卡图片！');
      return;
    }
    bindingBankCard(params).then(({status, result, msg}) => {
      if(status == 1) {
        wx.navigateBack({
          delta: 1
        })
      } else {
        app.wxAPI.alert(msg);
      }
    })
  }
})