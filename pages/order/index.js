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
    totalPrice: 0, //商品总价
    payPrice: 0, //实付金额
    expressPrice: 0,
    receiver: null,
    telphone: null,
    province: null,
    city: null,
    county: null,
    address: null,
    useCouponsNum: 0,
    coupon: null,
    mode: "create",
    remark: "",
    productIds: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let order = wx.getStorageSync('order');
    let storeName = getApp().globalData.storeName;

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
    if (options.mode == "create") {
      this.setData({
        order,
        storeName,
        totalNum,
        totalPrice,
        payPrice: totalPrice + Number(expressPrice),
        expressPrice,
        productIds,
        mode: options.mode
      });
    } else {
      console.log(order);
      this.setData({
        order:order,
        storeName,
        totalNum,
        province:order.province,
        city:order.city,
        county:order.county,
        address:order.address,
        receiver:order.receiver,
        telphone:order.telphone,
        payPrice:order.price,
        expressPrice:order.expressPrice,
        totalPrice:totalPrice,
        productIds,
        remark:order.remark,
        mode:options.mode
      })
    }


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
    if (this.data.receiver == null || this.data.telphone == null || this.data.address == null) {
      wx.showToast({
        title: '请完善收件人信息',
        icon: 'none'
      });
      return;
    }

    let order = this.data.order;
    let items = [];
    order.products.forEach(item => {
      items.push({
        productId: item.id,
        specificationId: item.specificationId,
        num: item.num
      })
    })

    let params = {
      receiver: this.data.receiver,
      telphone: this.data.telphone,
      province: this.data.province,
      city: this.data.city,
      county: this.data.county,
      address: this.data.address,
      couponId: this.data.coupon ? this.data.coupon.id : 0,
      items: items,
      remark: this.data.remark
    }

    wx.showLoading({
      title: '正在提交订单',
      mask: true
    })

    api.createOrder(params).then(result => {
      wx.hideLoading({
        success: (res) => {
          console.log(res);
        },
      })
      if(api.isSuccess(result)){
        this.setData({
          mode: "pay"
        })
      }else{
        wx.showToast({
          title: "创建订单失败",
          icon: 'error',
          duration: 2000
        })
      }
   
    })

  },

  setRemark: function (e) {
    this.setData({
      remark: e.detail.value
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
      this.setData({
        coupon,
        payPrice: this.data.payPrice - coupon.price
      });
    }
    let order = wx.getStorageSync('order')
    this.setData({
      order
    });
  },


  selectAddress: function (res) {
    if (this.data.mode == "create") {
      wx.chooseAddress({
        success: (result) => {
          console.log(result);
          this.setData({
            province: result.provinceName,
            city: result.cityName,
            county: result.countyName,
            address: result.detailInfo,
            receiver: result.userName,
            telphone: result.telNumber
          })
        },
      })
    }
  },
  goCoupons: function () {
    if (this.data.mode == "create") {
      let idString = this.data.productIds.join(",")
      wx.navigateTo({
        url: `/pages/coupons/index?productId=${idString}`
      });
    }
  },

  commentOrder: function(){
    wx.navigateTo({
      url: '/pages/order/comment',
    })
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