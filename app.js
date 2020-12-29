//app.js
const api = require('./utils/api.js')

App({
  onLaunch: function (options) {
    //登录
    wx.login({
      success: res => {
        api.weixinLogin(res.code).then(res => {
          if (api.isSuccess(res)) {
            this.globalData.token = res.data.accessToken
          } else {
            console.log(res.msg)
          }
        })
      }
    });
  },

  onShow:function(){
    api.getBusinessInfo().then(res=>{
      if(api.isSuccess(res)){
        this.globalData.storeInfo = res.data.business
        wx.setNavigationBarTitle({
          title: res.data.business.name,
        })
      }else{
        wx.showToast({
          title: '请求出错',
        });
      }
    })
  },
  globalData: {
    userInfo: null,
    token: null,
    storeInfo: null,
  }
})