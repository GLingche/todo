import App from './App'
import Vue from 'vue'
import uView from "uview-ui";
import store from '@/store/index.js'
Vue.use(uView);
Vue.config.productionTip = false
Vue.prototype.culculateStatus = function() {
  let {
	windowWidth
  } = uni.getSystemInfoSync()
  this.windowWidth = windowWidth
}
App.mpType = 'app'	
const app = new Vue({
    ...App,
	store
})

//http 
import http from './utils/http'
Vue.use(http, app)

//aip
import httpApi from './api/api.js'
Vue.use(httpApi, app)

app.$mount()
