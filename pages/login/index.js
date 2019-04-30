// pages/login.js
import { Request } from '../../utils/index';

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canGetCode: true,
    linPhone: '',
    verify: '',
    checkedTrue: false,
    timeText: '获取验证码',
    prevTime: '剩余',
    currentTime: 60,
    tailTime: 's',
    hasGetPointList: false,
  },
/**
 * 验证手机号码是否合法
 * @param {boolean} showTip 是否显示错误弹窗，默认显示
 */
  isPoneValid: function(showTip) {
    const phone = this.data.linPhone;
    var retVal = /^[1][3,4,5,7,8][0-9]{9}$/.test(phone);
    if (!retVal && showTip !== false) {
      const msg = phone ? '请输入正确的手机号' : '手机号不能为空';
      wx.showToast({
        title: msg,
        icon: 'none',
      })
    }
    return retVal;
  },

/**
 * 验证验证码是否合法
 */
  isVerifyCodeValid: function(showTip) {
    const verifyCode = this.data.verify;
    const isValid = /^[0-9]{4}$/.test(verifyCode);
    if (!isValid && showTip !== false) {
      const msg = verifyCode ? '验证码错误' : '验证码不能为空';
      wx.showToast({
        title: msg,
        icon: 'none',
      })
    }
    return isValid;
  },

  onPhoneNumInput: function(e) {
    var phone = e.detail.value;     

    phone = phone.trim();
    if (phone) {
      this.setData({
        linPhone: phone
      })
      const checkedTrue = this.validForm(false);
      this.setData({ checkedTrue })
    }
  },

  onGetVerifyCode: function() {
    var that = this;
    const deviceid = app.globalData.deviceID;
    if (!this.isPoneValid(false)){
      wx.showToast({
        title: '请输入有效手机号',
        icon: 'none'
      });
      return;
    }
    if (deviceid && this.isPoneValid(false) && this.data.canGetCode) {
      const url = Request.getApiAddress('USER', 'smsverifycode/send');
      Request.post({
        url,
        data: {
          mobilePhone: this.data.linPhone,
          verifyCodeType: 'MOBILE_LOGIN'
        },
      })
      .then(() => {
        that.setData({canGetCode: false});
        let n = 59;
        var time = setInterval(function () {
          that.setData({
            currentTime: n,
          })
          if (n === 0) {
            that.setData({
              timeText: '重新获取',
              canGetCode: true,
              currentTime:60,
              verify: ''
            })
            clearInterval(time);
          }
          n -= 1;
        }, 1000);
      })
    }    
  },

  onVerifyCodeInput: function(e) {
    let verifyCode = e.detail.value;
    verifyCode = verifyCode.trim();

    if (verifyCode) {
      this.setData({
        verify: verifyCode,
      })
      const checkedTrue = this.validForm(false);
      this.setData({ checkedTrue });
    }
  },
  
  bindUser: function() {
    // 绑定
    const bindURL = Request.getApiAddress('USER', 'user/query');
    Request.post({ // 替换URL
      url: bindURL,
      useGeneralHandle: false,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: app.globalData.token
      }
    })
    .then((res) => {
      if (res.data && res.data.status === 0) {
        wx.setStorageSync('token', app.globalData.token)
        wx.setStorageSync('phone', this.data.linPhone)
        wx.setStorageSync('userId', app.globalData.userInfo.userId)
        wx.switchTab({
          url: '../index/index'
        });        
      } else if (res.data && res.data.status === -1024) {
        wx.showToast({
          title: res.data.msg || '',
          icon: 'none'
        });
        return;
      }
    })  
  },

/**
 * 验证表单是否合法
 * @param {boolean} showTip 是否显示不合法提示，true 显示，false 不显示
 */
  validForm: function (showTip) {
    showTip = showTip !== false;
    let isPhoneValid = false;
    let isVerifyCodeValid = false;

    isPhoneValid = this.isPoneValid(showTip);
    if (isPhoneValid) {
      isVerifyCodeValid = this.isVerifyCodeValid(showTip);
    }
    return isPhoneValid && isVerifyCodeValid
  },

  onLogin() {
    var that = this;
    
    if (!this.validForm(true)){
      this.setData({verify: ''});
      return;
    }
    
    const loginURL = Request.getApiAddress('USER', 'mobile/login');
    const deviceid = app.globalData.deviceID;
    Request.post({
      url: loginURL,
      useGeneralHandle: false,
      data: {
        mobilePhone: that.data.linPhone,
        smsVerifyCode: that.data.verify,
        pushDeviceID: deviceid,
        deviceType: app.globalData.deviceType,
        invitationCode: ''
      }
    })
    .then((res) => {
      that.setData({verify: ''})
      if (res.data && res.data.status === 0) {
        app.globalData.token = res.data.data.token;
        app.globalData.userInfo.loginPhone = that.data.linPhone;
        app.globalData.userInfo.userId = res.data.data.userId;
        wx.setStorageSync('userId', res.data.data.userId);
        that.bindUser(); 
      } else {
        wx.showToast({
          title: res.data.msg || '登陆失败',
          icon: 'none'
        });
        return;
      }        
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    wx.login({
      success(res) {
        if (res.code) {
          // 发起网络请求
          wx.request({
            url: 'http://k7j9dn.natappfree.cc/user/query',
            data: {
              code: res.code
            },
            success: function (data) {
              console.log(data, 'login data')
            },
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  //   try {
  //     var systemInfo = wx.getSystemInfoSync();
  //     var tempSystemInfo = systemInfo.system;
  //     if(tempSystemInfo) {
  //       var index = tempSystemInfo.indexOf(' ');
  //       app.globalData.deviceType = tempSystemInfo.substring(0,index).toUpperCase();
  //     } else {
  //       app.globalData.deviceType='ANDROID';
  //     }
  //   } catch(err) {
  //     wx.showModal({
  //       title: '获取设备系统信息失败',
  //       icon: 'none',
  //     })
  //   }
  },
})