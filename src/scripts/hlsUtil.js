export default {
  /**
   * 判断输入是否为十一位电话号码
   * @param str 字符串
   * @returns {boolean}
   */
  phoneNumber: function (str) {
    // ^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\\d{8}$

    let reg = /^(1)+\d{10}$/
    return reg.test(str)
  },
  /**
   * 判断+86后11位电话号码
   * @param str 字符串
   * @returns {boolean}
   */
  phoneNumber86: function (str) {
    let reg = /^(\+86|\+86+\s)+(1)+\d{10}$/
    return reg.test(str)
  },
  /**
   * 是否是邮件格式
   * @param str
   * @returns {boolean|*}
   */
  isEmailAddress: function (str) {
    let pattern = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
    return pattern.test(str)
  },

  /**
   * 拨打电话仅仅限制于手机
   * @param number
   */
  callPhone: function (number) {
    window.open('tel:' + number)
  },
  /**
   * 发邮件
   * @param email
   */
  callEmail: function (email) {
    window.open('mailto:' + email)
  },
  /**
   *
   * @param x 输入的数字
   * @returns {Number} 返回数字
   */
  toDecimal: function (x) {
    // hlsPopup.showLongCenter(baseConfig.debug);
    let f = parseFloat(x)
    if (isNaN(f)) {
      return 0
    }
    f = Math.round(x * 100) / 100
    return f
  },

  formatFloat: function (f, digit) {
    let m = Math.pow(100000, digit)
    return parseInt(f * m, 100000) / m
  },

  /**
   * 判断平台
   * @return {String} 平台
   */
  detectOS: function () {
    const ua = navigator.userAgent.toLowerCase()

    if (/MicroMessenger/i.test(ua)) {
      return 'weixin'
    } else if (/iPhone|iPad|iPod|iOS/i.test(ua)) {
      return 'ios'
    } else if (/Android/i.test(ua)) {
      return 'android'
    } else {
      return 'other'
    }
  },

}
