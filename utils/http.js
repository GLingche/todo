import config from "../config/index";

const install = (Vue, vm) => {
	// 基本配置
	console.log(Vue.prototype.$u.get, "test")
		console.log(vm.$store.getters.token,"outside")

	// 二次封装wx.uploadFile 
	// {String }url:请求的接口地址 
	// {String} filePath:请求方式的本地文件路径（可以是微信的临时路径）
	// {String} name: 获取图片二进制文件的key
	// {Object} formData: HTTP 请求中其他额外的 form data（选） 
	Vue.prototype.$u.uploadFile =function uploadFile(url, params){
		return new Promise((resolve, reject) => {
			// 拼接
			let _url = `${config.baseUrl.dev}/${url}`;
			console.log(_url)
			console.log(vm.$store.getters.token)
			console.log(params,"参数最终")
			wx.uploadFile({
				url: _url,
				filePath: params.filePath,
				name: params.name,
				formData: {
					imgIndex: 0
				},
				header: {
					// 微信wx.uploadFile默认
					'content-type': ' multipart/form-data'
				},
				success: res => {
					console.log(res,"thisPromiseres")
					resolve(res.data)
				}
			})
		})
	}

	Vue.prototype.$u.http.setConfig({
		baseUrl: config.baseUrl.dev,
		loadingText: '努力加载中~',
		loadingTime: 0,
		//设置自定义头部content-type
		header: {
			'content-type': 'application/json;charset=UTF-8'
		}

	});

	// 请求拦截部分(请求前会执行该方法)
	Vue.prototype.$u.http.interceptor.request = (config) => {

		console.log(config, "发请求前")
		console.log(config.header.token, "token")
		//请求头携带token
		console.log(vm.$store.getters.token, "httpToken")
		if (vm.$store.getters.token) {
			config.header.token = vm.$store.getters.token;
		} else {
			config.header.token = null;
		}

		return config;
		// 如果return一个false值，则会取消本次请求
		// if(config.url == '/user/rest') return false; // 取消某次请求
	}

	//响应拦截(请求后会执行该方法)
	Vue.prototype.$u.http.interceptor.response = (response) => {
		return response
	}
}
	

export default {
	install
}
