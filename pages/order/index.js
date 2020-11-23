const api = require("../../utils/api");

// pages/order/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    order: null,
    storeName: null,
    totalNum: 0,
    totalPrice: 0,
    expressPrice: 0,
    receiver: null,
    telphone: null,
    address: null,
    area: null,
    useCouponsNum: 0,
    coupon: null,
    mode:"create",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let order = wx.getStorageSync('order')
    let storeName = getApp().globalData.storeName;

    console.log(order);
    let totalNum = 0;
    let totalPrice = 0;
    let expressPrice = 99999;
    let productIds = [];
    order.products.forEach(item => {
      totalNum += item.num;
      totalPrice += (item.price * item.num);
      if (item.expressPrice < expressPrice) {
        expressPrice = item.expressPrice;
      };
      productIds.push(item.id);
    })

    this.setData({
      order,
      storeName,
      totalNum,
      totalPrice,
      expressPrice
    });

    //获取可用的优惠券数量
    api.getCoupons(productIds).then(result => {
      if (api.isSuccess(result)) {
        let useCoupons = result.data.coupons.filter(item => {
          return item.status.index == 0
        })
        this.setData({
          useCouponsNum: useCoupons.length
        })
      }
    })
  },


  submitOrder: function () {
    if(this.data.receiver == null || this.data.telphone == null || this.data.address == null || this.data.area == null){
      wx.showToast({
        title: '请完善收件人信息',
        icon: 'none'
      });
      return;
    }

    let order = this.data.order;
    let items = [];
    order.products.forEach(item=>{
      items.push({
        productId:item.id,
        specificationId:item.specificationId,
        num:item.num
      })
    })

    let params = {
      receiver: this.data.receiver,
      telphone: this.data.telphone,
      address: this.data.area + " " + this.data.address,
      couponId:this.data.coupon ? this.data.coupon.id : 0,
      items:items
    }

    wx.showLoading({
      title: '正在提交订单',
      mask:true
    })

    api.createOrder(params).then(result=>{
      console.log(result);
      this.setData({
        mode:"pay"
      })
      wx.hideLoading({
        success: (res) => {
          console.log(res);
        },
      })
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
    let coupon = wx.getStorageSync('coupon');

    if (coupon != null) {
      let totalPrice = this.data.totalPrice;
      totalPrice -= coupon.price;
      this.setData({
        coupon,
        totalPrice
      });
    }
  },


  selectAddress: function (res) {
    if(this.data.mode == "create"){
      wx.chooseAddress({
        success: (result) => {
          console.log(result);
          this.setData({
            area: result.provinceName + " " + result.cityName + " " + result.countyName,
            address: result.detailInfo,
            receiver: result.userName,
            telphone: result.telNumber
          })
        },
      })
    }
  },
  goCoupons: function () {
    if(this.data.mode == "create"){
      wx.navigateTo({
        url: `/pages/coupons/index`
      });
    }
   
  },
  onFail: function (res) {
    console.log(res);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})