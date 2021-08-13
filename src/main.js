// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// import FastClick from 'fastclick'
import App from './App'
import router from './router/index'
// import flexible from './common/ydui.flexible'

import {componentInstall, hlsPopup, directives, filter} from 'hls-easy-ui'
import Vant from 'vant'
import 'vant/lib/index.css'
/**
 * http
 */
import {post, get} from './scripts/hlsHttp'

/** 全局函数hlsUtil**/

import hlsUtil from './scripts/hlsUtil'

if (process.env.CONFIG_ENV === 'uat') {
  const VConsole = require('vconsole')
  new VConsole() // eslint-disable-line
}

Vue.use(directives)
Vue.use(Vant)
Vue.use(filter)

/**
 * 组件
 */

Vue.use(componentInstall)

Vue.prototype.hlsPopup = window.hlsPopup = hlsPopup
Vue.prototype.$devicePixelRatio = 2

let hlsHttp = {
  get: get,
  post: post,
}
Vue.prototype.hlsHttp = window.hlsHttp = hlsHttp

Vue.prototype.hlsUtil = window.hlsUtil = hlsUtil

/** end**/

/**
 * 全局返回上一页面
 * @param index
 */
let routeGo = function (index) {
  if (!index) {
    index = -1
  }
  this.$router.go(index)
}
Vue.prototype.$routeGo = routeGo

Vue.config.productionTip = true

/* eslint-disable no-new */
new Vue({
  data () {
    return {
      pathList: [],
      transitionName: null,
    }
  },
  router,
  watch: { // 监听路由变化
    $route (to, from) {
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
    },
  },
  render: h => h(App),
}).$mount('#app-box')
