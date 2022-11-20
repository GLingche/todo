// 引入 User 模块
import User from "./user.js"

const install = (Vue, vm) => {	
	vm.$u.api = {
		User:User(vm),	// 将 vm 对象传递到 User 模块中
        // 参考 User 模块方式增加其它模块
	};
}

export default {
	install
}