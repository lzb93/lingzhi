Page({
  data: {
    talkInfo: '购买了商品大概多长时间能到货？',
    talkInfo1: '下单以后，当天采用**快递发货一般3-7天到货。您可以登录您的个人中心查看订单的物理配送信息。',
    talkInfo2: '商品不想要了能拒收吗？',
    talkInfo3: '如果您不需要次商品，您可以在联系您收货的时候，直接选择拒收即可。'
  },
  onLoad() {
    wx.setNavigationBarTitle({
      title: "帮助中心"
    })
  },
})