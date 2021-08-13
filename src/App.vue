<template>
  <div id="app">
    <transition :name="transitionName">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"/>
      </keep-alive>
    </transition>
    <transition :name="transitionName">
      <router-view v-if="!$route.meta.keepAlive"/>
    </transition>
  </div>
</template>

<script>
export default {
  data () {
    return {
      pathList: [],
      transitionName: 'router-slide-right',
    }
  },
  watch: { // 监听路由变化
    $route (to, from) {
      if (this.pathList.includes(to.path)) {
        const index = (this.pathList.findIndex(() => {
          return from.path
        }))
        this.pathList.splice(index, 1)
        this.$router.isBack = true
      } else {
        this.pathList.push(to.path)
        this.$router.isBack = false
      }
      if (to.path === 'Home') {
        this.$router.isBack = true
        this.pathList = []
      }
      this.$router.isBack = false
    },
  },
  mounted () {
  },
  methods: {
    onSwipeLeft () {
      this.$router.go(-1)
    },
  },
}
</script>

<style lang="less">
  @import "styles/variables";
  @import "~hls-easy-ui/packages/common/styles/publicStyle";
  html, body, #app {
    height: 100%;
    width: 100%;
    overflow-x: hidden;
  }
</style>
