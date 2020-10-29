import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import 'font-awesome/css/font-awesome.css'




Vue.config.productionTip = false

Vue.use(VXETable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
