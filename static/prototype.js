/**
 *
 * @param fmt
 * @returns {*}
 * @constructor
 */
Date.prototype.format = function (fmt) { // eslint-disable-line
  var o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    'S': this.getMilliseconds(), // 毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o) { if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
  return fmt
}
/**
 * 移除数组的某个元素
 * @param dx 下标
 * @returns {boolean}
 */
Array.prototype.remove = function (dx) { // eslint-disable-line
  if (isNaN(dx) || dx > this.length) {
    return false
  }
  for (var i = 0, n = 0; i < this.length; i++) {
    if (this[i] !== this[dx]) {
      this[n++] = this[i]
    }
  }
  this.length -= 1
}
