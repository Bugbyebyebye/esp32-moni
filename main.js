import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false

import App from './App'
App.mpType = 'app'

import uView from '@/uni_modules/uview-ui'
Vue.use(uView)

new Vue({
  ...App
}).$mount()

Vue.prototype.$baseUrl = "http://8.130.84.188:5000"
// Vue.prototype.$baseUrl = "http://localhost:5000"