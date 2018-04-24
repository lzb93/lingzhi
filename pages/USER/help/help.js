Page({
  data: {
    service: '售前问题',
    servicea:'售后问题',
    contact:'联系客服'
  },
  onLoad() {
    wx.setNavigationBarTitle({
      title: "帮助中心"
    })
  },
  /** 关闭规格弹窗 */
  closeSpecModal: function () {
    this.setData({ openSpecModal: false });
  },

  /** 打开规格弹窗 */
  openSpecModel: function () {
    this.setData({ openSpecModal: true });
  }
  // contactService: function () {
  //   app.getConfig(function (config) {
  //     var cfg = config.config;
  //     for (var i = 0; i < cfg.length; i++) {
  //       if (cfg[i].name == 'phone') {
  //         app.confirmBox(cfg[i].value);
  //         return;
  //       }
  //     }
  //   });
  // }
})
