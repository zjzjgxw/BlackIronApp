// pages/cart/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cart:[],
    slideButtons:[],
    totalPrice:0,
    totalSelected:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    

  },

  handleRadioChange:function(e){
    let currentItem = e.currentTarget.dataset.item;
    let cart = this.data.cart;
    cart.forEach(item=>{
      if(item.id == currentItem.id && item.firstValue == currentItem.firstValue && item.secondValue == currentItem.secondValue){
        item.isSelected = !item.isSelected;
      }
    })
    let totalSelected = true;
    cart.forEach(item=>{
      if(item.isSelected == false){
        totalSelected = false;
      }
    })
    this.setData({
      cart:cart,
      totalSelected:totalSelected,
      totalPrice:this.getTotalPrice(cart)
    })
  },

  handleSub:function(e){
    let currentItem = e.currentTarget.dataset.item;
    let cart = this.data.cart;
    cart.forEach(item=>{
      if(item.id == currentItem.id && item.firstValue == currentItem.firstValue && item.secondValue == currentItem.secondValue){
        if(item.num > 1){
          item.num -= 1;
        }
      }
    });
    this.setData({
      cart:cart,
      totalPrice:this.getTotalPrice(cart)
    })
  },
  handleAdd:function(e){
    let currentItem = e.currentTarget.dataset.item;
    let cart = this.data.cart;
    cart.forEach(item=>{
      if(item.id == currentItem.id && item.firstValue == currentItem.firstValue && item.secondValue == currentItem.secondValue){
        if(item.lastNum >= item.num +1){
          item.num += 1;
        }
      }
    });
    this.setData({
      cart:cart,
      totalPrice:this.getTotalPrice(cart)
    })
  },


  getTotalPrice:function(cart){
    let totalPrice = 0;
    cart.forEach(item=>{
      if(item.isSelected){
        totalPrice += item.price * item.num
      }
    })
    return totalPrice;
  },

  deleteItem:function(e){
    let currentItem = e.currentTarget.dataset.item;
    let cart = this.data.cart.filter((item)=>{
      return !(item.id == currentItem.id && item.firstValue == currentItem.firstValue && item.secondValue == currentItem.secondValue)
    });
    this.setData({
      cart:cart,
      totalPrice:this.getTotalPrice(cart)
    });
    wx.setStorageSync('cart', cart)
  },

  handleTotalSelected:function(){
    if(this.data.totalSelected == true){
      let cart = this.data.cart;
      cart.forEach(item=>{
        item.isSelected = false;
      });
      this.setData({
        cart,
        totalSelected: false,
        totalPrice:this.getTotalPrice(cart)
      });
    }else{
      let cart = this.data.cart;
      cart.forEach(item=>{
        item.isSelected = true;
      });
      this.setData({
        cart,
        totalSelected: true,
        totalPrice:this.getTotalPrice(cart)
      });
    }
  },

  handleOrder:function(){
    let products = [];
    this.data.cart.forEach(item=>{
      if(item.isSelected){
        products.push(item);
      }
    })
    wx.setStorageSync('order', {products:products});
    wx.setStorageSync('cart', []);
    wx.navigateTo({
      url: '/pages/order/index?mode=create',
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
    let cart = wx.getStorageSync('cart') || [];
    cart.forEach(item=>{
      item['isSelected'] = true;
    });
    this.setData({
      cart:cart,
      slideButtons: [{
        text: '删除',
        src: '/images/index/delete.png', // icon的路径
      }],
      totalPrice:this.getTotalPrice(cart)
    })

    if(cart.length > 0){
      wx.setTabBarBadge({
        index: 1,
        text: `${cart.length}`,
      })
    }else{
      wx.hideTabBarRedDot({
        index: 1,
      })
    }
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