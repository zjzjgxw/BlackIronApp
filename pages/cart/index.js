// pages/cart/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cart:[],
    slideButtons:[],
    totalPrice:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let cart = wx.getStorageSync('cart') || [];
    console.log(cart);
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

  },

  handleRadioChange:function(e){
    let currentItem = e.currentTarget.dataset.item;
    let cart = this.data.cart;
    cart.forEach(item=>{
      if(item.id == currentItem.id && item.firstValue == currentItem.firstValue && item.secondValue == currentItem.secondValue){
        item.isSelected = !item.isSelected;
      }
    })

    this.setData({
      cart:cart,
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