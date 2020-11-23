/**
 *  请求数据
 * @param {*} url 
 * @param {*} data 
 * @param {*} method 
 */
function requestData(url, data, method = "get") {
  const app = getApp();
  if (app.debug) {
    console.log('requestData url: ', url);
  }
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data || {},
      method: method,
      header: {
        'Content-Type': 'application/json',
        'Authorization': app.globalData.token
      },
      success: function (res) {
        if (app.debug) {
          console.log('response data: ', res);
        }
        if (res.statusCode == 200) {
          resolve(res.data);
        } else {
          reject();
        }
      },
      fail: function () {
        reject();
      }
    });
  });
}

function uploadFile(url, filePath) {
  return new Promise(function (resolve, reject) {
    wx.uploadFile({
      filePath: filePath,
      name: 'file',
      url: url,
      success: function (res) {
        if (res.statusCode == 200) {
          resolve(JSON.parse(res.data));
        } else {
          reject();
        }
      },
      fail: function () {
        reject()
      }
    })
  })
}


const WEB_DOMAIN = "http://192.168.0.100:9800"
const BUSINESS_ID = 2

const isSuccess = res => {
  if (res.code == 200) {
    return true;
  }
  return false;
}

module.exports = {
  isSuccess: isSuccess,
  weixinLogin(code) {
    return requestData(WEB_DOMAIN + "/sso/users/wxlogin", {
      "code": code
    })
  },
  getBanners() {
    return requestData(WEB_DOMAIN + "/app/banners", {
      businessId: BUSINESS_ID
    })
  },
  updateUserInfo(data) {
    return requestData(WEB_DOMAIN + "/users/wx", data, "put")
  },
  getUserInfo() {
    return requestData(WEB_DOMAIN + "/app/users/current", {})
  },
  uploadVideo(filePath) {
    return uploadFile(WEB_DOMAIN + "/files/media/aliYunUpload", filePath)
  },
  createArticle(data) {
    return requestData(WEB_DOMAIN + "/articles", data, "post")
  },
  getRecommendProducts() {
    return requestData(WEB_DOMAIN + "/app/products/recommend", {
      businessId: BUSINESS_ID
    })
  },
  getAllCategory() {
    return requestData(WEB_DOMAIN + "/app/products/category", {
      businessId: BUSINESS_ID
    })
  },
  getProductsOfCategory(categoryId, pageNum = 1, pageSize = 10) {
    return requestData(WEB_DOMAIN + "/app/products", {
      businessId: BUSINESS_ID,
      categoryId,
      pageNum,
      pageSize
    })
  },
  getProductInfo(id) {
    return requestData(WEB_DOMAIN + "/app/products/detail/" + id)
  },
  getStockOfProdcut(productId) {
    return requestData(WEB_DOMAIN + "/app/products/stock", {
      productId: productId
    })
  },
  getCoupons(productIds) {
    return requestData(WEB_DOMAIN + "/app/coupons?productIds=" + productIds.join(","))
  },
  createOrder(params) {
    return requestData(WEB_DOMAIN + "/app/orders",params,"POST")
  }
}