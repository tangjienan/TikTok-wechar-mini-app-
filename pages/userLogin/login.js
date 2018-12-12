const app = getApp()

Page({
  // 登录  
  doLogin: function (e) {
    var me = this;
    var formObject = e.detail.value;
    var username = formObject.username;
    var password = formObject.password;
    // 简单验证
    if (username.length == 0 || password.length == 0) {
      wx.showToast({
        title: 'username or password can not be null',
        icon: 'none',
        duration: 3000
      })
    } else {
      var serverUrl = app.severUrl;
      wx.showLoading({
        title: 'please wait...',
      });
      // 调用后端
      wx.request({
        url: serverUrl + '/login',
        method: "POST",
        data: {
          username: username,
          password: password
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data);
          wx.hideLoading();
          if (res.data.status == 200) {
            // 登录成功跳转 
            wx.showToast({
              title: 'success',
              icon: 'success',
              duration: 2000
            });
            app.userInfo = res.data.data;
            // fixme 修改原有的全局对象为本地缓存
            // 页面跳转
            var redirectUrl = me.redirectUrl;
            if (redirectUrl != null && redirectUrl != undefined && redirectUrl != '') {
              wx.redirectTo({
                url: redirectUrl,
              })
            } else {
              wx.redirectTo({
                url: '../mine/mine',
              })
            }

          } else if (res.data.status == 500) {
            // 失败弹出框
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 3000
            })
          }
        }
      })
    }
  },
  goRegistPage: function () {
    wx.redirectTo({
      url: '../userRegist/regist',
    })
  }
})