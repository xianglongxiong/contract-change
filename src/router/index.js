/*
 * @Author: your name
 * @Date: 2021-08-09 18:50:15
 * @LastEditTime: 2021-08-12 18:27:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \hls-contract-change\src\router\index.js
 */
import Vue from 'vue'
import Router from 'vue-router'
const Home = resolve => require.ensure([], () => { resolve(require('@/pages/home')) }, 'home')
const NewChange = resolve => require.ensure([], () => { resolve(require('@/pages/newChange')) }, 'newChange')
const EarlyEnd = resolve => require.ensure([], () => { resolve(require('@/pages/earlyEnd')) }, 'earlyEnd')
Vue.use(Router)

// 全局跳转路由方法
Router.prototype.pushPage = function (param, bool) {
  let key = true
  if (bool === undefined) {
    key = true
  } else if (bool === true || bool === false) {
    key = bool
  }
  this.currentRoute.meta.nextReload = key
  this.push(param)
}

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {path: '/home', component: Home, name: 'Home', meta: {keepAlive: true}},
    {path: '/newchange', component: NewChange, name: 'NewChange', meta: {keepAlive: true}},
    {path: '/earlyEnd', component: EarlyEnd, name: 'EarlyEnd'},
  ],
  scrollBehavior (to, from, savedPosition) {
    if (to.hash) {
      return {
        selector: to.hash,
      }
    }
  },
})
