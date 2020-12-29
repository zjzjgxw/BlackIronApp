const api = require("../../utils/api");

// pages/user/auth.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeInfo:null,
    settingVisable:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let app = getApp();
    if (app.globalData.storeInfo != null) {
      this.setData({
        storeInfo: app.globalData.storeInfo
      })
    }

  },


  getUser: function () {
    const app = getApp();
    //登录
    wx.login({
      success: res => {
        api.weixinLogin(res.code).then(res => {
          if (api.isSuccess(res)) {
            app.globalData.token = res.data.accessToken
            this.updateUserInfo();
          } else {
            console.log(res.msg)
          }
        })
      }
    })
  },

  updateUserInfo: function () {
    // // // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              console.log(res)
              var requestData = {
                encryptedData: res.encryptedData,
                iv: res.iv
              }
              api.updateUserInfo(requestData).then(result => {
                if(!api.isSuccess(result)){
                  wx.showToast({
                    title: '更新失败',
                  })
                }
                this.getCurrent();
              })
            }
          })
        } else {
          this.setData({
            settingVisable:true
          })
        }
      }
    })
  },

  getCurrent: function () {
    //获取用户信息
    api.getUserInfo().then(result => {
      if (result.code == 200) {
        const app = getApp();
        app.globalData.userInfo = result.data.user
        wx.navigateBack({
          delta: 0,
        })
      }
    })
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