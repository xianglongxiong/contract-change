/*
 * @Author: your name
 * @Date: 2021-08-09 18:50:15
 * @LastEditTime: 2021-08-10 13:59:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \hls-contract-change\config\dev.env.js
 */
'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  CONFIG_ENV: JSON.stringify(process.env.CONFIG_ENV),
  debug: true,
  isMobilePlatform: false,
  VUE_APP_API_HOST: '"http://devapi.leafhzero.hand-china.com"',
  basePath: '"http://devapi.leafhzero.hand-china.com/"',
  appId: '"com.hls.easy.car"',
  currentVersion: '"1.0.0"'
});
