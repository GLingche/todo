// 创建 User 模块方法，方法内的方法共享 vm 对象
let User = (vm) => {
  return {
    //用户登录
    login: (params = {}) => {
      console.log(params, "apiLogin")
      return vm.$u.post('api/v1/signup', params)
    },
    getInfo: () => {
      return vm.$u.get('api/v1/currentuser')
    },
  }
}

// 抛出当前模块
export default User
