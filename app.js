//app.js
const api = require('./utils/api.js')

App({
  onLaunch: function () {
    // // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        api.weixinLogin(res.code).then(res => {
          console.log(res)
          if (api.isSuccess(res)) {
            this.globalData.token = res.data.accessToken
            //获取用户信息
            api.getUserInfo().then(result => {
              console.log(result)
              if (result.code == 200) {
                this.globalData.userInfo = result.data.user
              }
            })
          } else {
            console.log(res.msg)
          }
        })
      }
    })

  },
  globalData: {
    userInfo: null,
    token: null,
    storeName:"19Flower"
  }
})