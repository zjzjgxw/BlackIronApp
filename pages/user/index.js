// pages/user/index.js
const api = require('../../utils/api.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let app = getApp();
    if(app.globalData.userInfo != null){
      this.setData({
        userInfo:app.globalData.userInfo
      })
    }
    // // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           console.log(res)

    //           // 可以更新用户信息
    //           // var requestData={
    //           //   encryptedData:res.encryptedData,
    //           //   iv:res.iv
    //           // }
    //           // api.updateUserInfo(requestData).then(result=>{
    //           //   console.log(result)
    //           // })
    //         }
    //       })
    //     }
    //   }
    // })

    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },
  goOrderList:function(e){
    wx.navigateTo({
      url: '/pages/order/list?key='+e.currentTarget.dataset.key,
    })
  },

  handleLogin: function () {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        api.weixinLogin(res.code).then(res => {
          console.log(res)
          if (api.isSuccess(res)) {
            const app = getApp();
            app.globalData.token = res.data.accessToken
            //获取用户信息
            api.getUserInfo().then(result => {
              console.log(result)
              if (result.code == 200) {
                this.setData({
                  userInfo: result.data.user
                })
              }
            })
          } else {
            console.log(res.msg)
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})