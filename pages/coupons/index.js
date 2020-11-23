const api = require("../../utils/api");
const util = require("../../utils/util");

// pages/coupons/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
      key:1,
      title:"可用",
      visable:"show"
    },{
      key:2,
      title:"全部",
      visable:"hidden"
    }],
    coupons:[],
    useCoupons:[],
  },

  selectTap: function(e){
    let tabs = this.data.tabs;
    tabs.forEach(item=>{
      if(item.key === e.currentTarget.dataset.item.key){
        item.visable = "show"
      }else{
        item.visable = "hidden"
      }
    })
    this.setData({
      tabs
    })
  },

  getCoupons: function(productIds){
    api.getCoupons(productIds).then(result=>{
      if(api.isSuccess(result)){
        let useCoupons = result.data.coupons.filter(item=>{return item.status.index == 0})
        this.setData({
          coupons:result.data.coupons,
          useCoupons:useCoupons
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let productIds = options.productId.split(",");
    if(!util.checkLogin()){
      util.doLogin().then((res)=>{
        this.getCoupons(productIds)
      })
    }else{
      this.getCoupons(productIds)
    }
  },

  selectCoupon: function(e){
    console.log(e);
    let item = e.currentTarget.dataset.item;
    if(item.status.index ==0){
      wx.setStorageSync('coupon', item);
      wx.navigateBack({
        delta: 0,
      })
    }else{
      wx.showToast({
        title: '优惠券不可用',
        icon:"none"
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