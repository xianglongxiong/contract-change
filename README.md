# hls-car-vue

> A Vue.js project

## Build Setup

``` bash
# install dependencies
yarn install

# serve with hot reload at localhost:8080
yarn run dev

# build for production with minification
yarn run build

# build for production and view the bundle analyzer report
yarn run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


### 文件命名规范

1. 文件夹全部采用驼峰命名法，即首字母小写后面每个单词首字母大写

2. 文件名全部使用小写字母，单词与单词之间采用**-**连接,如 **user-info.vue,user-info-detail.vue**,

3. 路由的注册 `import` 语句后的单词采用 Pascal命名法，所有单词的首字母大写，其余字母小写，单词与单词之间不使用任何符号风格。如
  路由全部按需加载，按照如下写法，路由后面的单词为打包后的js名称，按照模块进行分割打包，注意不要全部一样，那样没有任何意义

  ```javascript
  const HomeManager = resolve => require.ensure([], () => { resolve(require('@/pages/homeManager/home-manager')) }, 'home')
  const LoadMore = resolve => require.ensure([], () => { resolve(require('@/pages/loadMore/load-more')) }, 'loadMore')
  const UserInfo = resolve => require.ensure([], () => { resolve(require('@/pages/userInfo/user-info')) }, 'userInfo')
  const UserInfoDetail = resolve => require.ensure([], () => { resolve(require('@/pages/userInfo/user-info-detail')) }, 'userInfo')
  ```

4. 实际路由注册需安照如下写法，`path`为 `/tab/文件名`,`/tab`是否保留视实际情况而定。`component`后接的单词需和`import`的单词保持一致,`name`后接的单词也需和`import`的单词保持一致

  ```javascript
  {path: "/tab/home-manager", component: HomeManager, name: 'HomeManager', meta: {keepAlive: true}},
  {path: '/tab/load-more', component: LoadMore, name: 'LoadMore', meta: {keepAlive: true}},
  {path: '/tab/user-info', component: UserInfo, name: 'UserInfo', meta: {keepAlive: true}},
  ```

