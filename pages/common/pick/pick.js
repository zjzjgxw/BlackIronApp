const api = require("../../../utils/api")

// pages/common/pick/pick.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hidden: Boolean,
    productId: Number,
    type: String,
    imgUrl: String,
    type: String,
    productInfo: Object,
  },



  observers: {
    'hidden': function (value) {
      // 每次 setData 都触发
      this.setData({
        isHidden: value
      })
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    isHidden: true,
    hasSpecifications: false,
    price: null,
    num: 1, //购买数量
    chosedFirst: null, //选择的第一个规格
    chosedSecond: null, //选择的第二个规格
    lastNum: null, //剩余库存
    firstName: null, //第一个规格名称
    secondName: null, //第二个规格名称
    stockDict: {}, //库存规格详细
    firstOptions: [], //规格一选项
    secondOptions: [], //规格二选项
    firstOptionsColor: {},
    secondOptionsColor: {},
    selectedColor: '#ffebeb',
    unSelectedColor: '#f6f7f9',
  },

  lifetimes: {
    attached: function () {
      api.getStockOfProdcut(13).then(result => {
        if (api.isSuccess(result)) {
          let info = result.data.info;
          if (info.specifications.length == 0) { //没有规格
            this.setData({
              price: info.price,
              lastNum: info.lastNum,
            })
          } else { //有规格
            let firstName = null;
            let secondName = null;
            let firstOptions = new Set();
            let secondOptions = new Set();
            let stockDict = {};
            let firstOptionsColor = {};
            let secondOptionsColor = {};
            info.specifications.forEach(item => {
              if (firstName == null) {
                firstName = item.firstName
              }
              if (secondName == null) {
                secondName = item.secondName
              }
              firstOptions.add(item.firstValue);
              firstOptionsColor[item.firstValue] = this.data.unSelectedColor;
              if (item.secondName == null) {
                stockDict[item.firstValue] = {
                  price: item.detail.price,
                  lastNum: item.detail.lastNum
                }
              } else {
                secondOptions.add(item.secondValue)
                secondOptionsColor[item.secondValue] = this.data.unSelectedColor;
                stockDict[item.firstValue + "_" + item.secondValue] = {
                  price: item.detail.price,
                  lastNum: item.detail.lastNum
                }
              }
            });
            this.setData({
              price: info.price,
              lastNum: info.lastNum,
              firstName,
              secondName,
              firstOptions: Array.from(firstOptions),
              secondOptions: Array.from(secondOptions),
              stockDict,
              firstOptionsColor,
              secondOptionsColor,
              hasSpecifications: true,
            })
          }
        }
      })
      
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    addCart:function(){
      if(this.data.firstName != null && this.data.chosedFirst == null){
        wx.showToast({
          title: '请选择'+this.data.firstName,
          icon: 'none'
        });
        return;
      }
      if(this.data.secondName != null && this.data.chosedSecond == null){
        wx.showToast({
          title: '请选择'+this.data.secondName,
          icon: 'none'
        });
        return;
      }
      this.properties.productInfo['price'] = this.data.price;
      this.properties.productInfo['num'] = this.data.num;
      this.properties.productInfo['firstName'] = this.data.firstName;
      this.properties.productInfo['secondName'] = this.data.secondName;
      this.properties.productInfo['firstValue'] = this.data.chosedFirst;
      this.properties.productInfo['secondValue'] = this.data.chosedSecond;

      let cart = wx.getStorageSync('cart') || [];
      let isExist = false;
      cart.forEach(item=>{
        if(item.id == this.properties.productInfo.id && item.firstName == this.properties.productInfo.firstName && item.firstValue == this.properties.productInfo.firstValue
          && item.secondName == this.properties.productInfo.secondName && item.secondValue == this.properties.productInfo.secondValue){
            item.num += this.properties.productInfo.num;
            isExist = true;
        }
      });
      if(!isExist){
        cart.push(this.properties.productInfo);
      }
      wx.setStorageSync('cart', cart);
      this.setData({
        isHidden:true
      })
    },

    handleClose:function(){
      this.setData({
        isHidden:true
      })
    },
    handleSub:function(){
      if(this.data.num >1){
        this.setData({
          num:this.data.num -1
        })
      }
    },
    handleAdd:function(){
        this.setData({
          num:this.data.num +1
        })
    },
    handleFirstSelected: function (e) {

      if (this.data.secondName == null) {
        let info = this.data.stockDict[e.currentTarget.dataset.item];
        this.setData({
          price: info.price,
          lastNum: info.lastNum,
        })
      } else {
        if (this.data.chosedSecond != null) {
          let key = e.currentTarget.dataset.item + '_' + this.data.chosedSecond;
          if (this.data.stockDict.hasOwnProperty(key)) {
            let info = this.data.stockDict[key];
            if(info.lastNum < this.data.num){
              wx.showToast({
                title: '剩余库存少于' + this.data.num,
                icon: 'none'
              })
              return;
            }
            this.setData({
              price: info.price,
              lastNum: info.lastNum,
            })
            //设置被选择的颜色
              let colors = this.data.firstOptionsColor;
              for (let key in colors) {
                if (key == e.currentTarget.dataset.item) {
                  colors[key] = this.data.selectedColor;
                } else {
                  colors[key] = this.data.unSelectedColor;
                }
              }
              this.setData({
                chosedFirst: e.currentTarget.dataset.item,
                firstOptionsColor: colors
              })
          } else {
            wx.showToast({
              title: '已售完',
              icon: 'none'
            })
          }
        }else{
           //设置被选择的颜色
           let colors = this.data.firstOptionsColor;
           for (let key in colors) {
             if (key == e.currentTarget.dataset.item) {
               colors[key] = this.data.selectedColor;
             } else {
               colors[key] = this.data.unSelectedColor;
             }
           }
           this.setData({
             chosedFirst: e.currentTarget.dataset.item,
             firstOptionsColor: colors
           })
        }
      }
    },
    handleSecondSelected: function (e) {
      if (this.data.chosedFirst != null) { //第一规格已经选择
        let key = this.data.chosedFirst + '_' + e.currentTarget.dataset.item;
        if (this.data.stockDict.hasOwnProperty(key)) {
          let info = this.data.stockDict[key];
          if(info.lastNum < this.data.num){ //剩余库存不足
            wx.showToast({
              title: '剩余库存少于'+this.data.num,
              icon: 'none'
            })
            return;
          }
          this.setData({
            price: info.price,
            lastNum: info.lastNum,
          })
          //设置被选择的颜色
          let colors = this.data.secondOptionsColor;
          for (let key in colors) {
            if (key == e.currentTarget.dataset.item) {
              colors[key] = this.data.selectedColor;
            } else {
              colors[key] = this.data.unSelectedColor;
            }
          }
          this.setData({
            chosedSecond: e.currentTarget.dataset.item,
            secondOptionsColor: colors
          })
        } else {
          wx.showToast({
            title: '已售完',
            icon: 'none'
          })
        }
      } else { // 第一规格还未选择
        //设置被选择的颜色
        let colors = this.data.secondOptionsColor;
        for (let key in colors) {
          if (key == e.currentTarget.dataset.item) {
            colors[key] = this.data.selectedColor;
          } else {
            colors[key] = this.data.unSelectedColor;
          }
        }
        this.setData({
          chosedSecond: e.currentTarget.dataset.item,
          secondOptionsColor: colors
        })
      }

    }
  }
})