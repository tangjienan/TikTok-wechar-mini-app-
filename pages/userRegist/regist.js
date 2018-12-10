const app = getApp()
Page({
    data: {
    },
    doRegist: function(e) {
    var formObject = e.detail.value;
    var userName = formObject.userName;
    var passWord = formObject.passWord;
    console.log(formObject)
    if (userName.length == 0 || passWord.length == 0) {
      wx.showToast({
        title: 'Username or Password can not be null',
        icon: 'none',
        duration: 3000
      })
    } else {
      var serverUrl = app.severUrl;
      wx.request({
        url: serverUrl + "/regist",
        method: "POST",
        data:{
          username: userName,
          password: passWord
        },
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          console.log(res.data)
          var status = res.data.status
          if (status == 200) {
            wx.showToast({
              title: "successfully regiseter",
              icon: 'none',
              duration: 3000
            })
            app.userInfo = res.data.data;
          } else if (status == 500) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 3000
            })
          }
        }   
      })
    }
  }
})