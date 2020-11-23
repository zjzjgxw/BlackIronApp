const api = require("../../utils/api")

// pages/product/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    swiperCurrent: 0,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 800,
    circular: true,
    hidePicker: true,
    pickerType: 'buy',
    cartNum: 0,
    productId:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      productId:options.id
    })
    api.getProductInfo(options.id).then(result => {
      if (api.isSuccess(result)) {
        this.setData({
          detail: result.data.detail
        })
      }
    })

    let cart = wx.getStorageSync('cart') || [];
    this.setData({
      cartNum: cart.length
    })
  },

  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },

  handleBuy: function (e) {
    this.setData({
      hidePicker: false,
      pickerType: 'buy'
    })
  },

  handleAddCart: function () {
    this.setData({
      hidePicker: false,
      pickerType: 'cart'
    })
  },

  onAddCartEvent: function (e) {
    let cart = wx.getStorageSync('cart') || [];
    this.setData({
      cartNum: cart.length
    })
  },
  goCart:function(){
    if(!util.checkLogin()){
      util.doLogin().then((res)=>{
        wx.switchTab({
          url: '/pages/cart/index',
        })
      })
    }else{
      wx.switchTab({
        url: '/pages/cart/index',
      })
    }
  },
  goHome:function(){
    if(!util.checkLogin()){
      util.doLogin().then((res)=>{
        wx.switchTab({
          url: '/pages/index/index',
        })
      })
    }else{
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
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