<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
    <div class="ali-report-wrap">
      
      <a class="ace-link ace-link-primary ali-report-link" href="http://www.beian.gov.cn/portal/registerSystemInfo?spm=a2cmq.17630005.J_9220772140.109.7ef879fe4wvUYd" target="_blank" data-spm-anchor-id="a2cmq.17630005.J_9220772140.109"><img data-src="//img.alicdn.com/tfs/TB1..50QpXXXXX7XpXXXXXXXXXX-40-40.png" class="ali-report-img" src="//img.alicdn.com/tfs/TB1..50QpXXXXX7XpXXXXXXXXXX-40-40.png"><span class="ali-report-link-text" data-spm-anchor-id="a2cmq.17630005.J_9220772140.i0.7ef879fe4wvUYd">京ICP备19035303号</span></a></div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.ali-report-wrap{
  padding-top: 15px;
  width: 100%;
  height: auto;

}
</style>
