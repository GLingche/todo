import { getToken, setToken, removeToken } from '../../utils/auth';

const getDefaultState = () => {
	return {
		token: getToken(),
		name: '',
		avatar: ''
	};
};

const state = getDefaultState();

const mutations = {
	// 重置state
	RESET_STATE: state => {
		Object.assign(state, getDefaultState());
	},
	SET_TOKEN: (state, token) => {
		state.token = token;
	},
	SET_NAME: (state, name) => {
		state.name = name;
	},
	SET_AVATAR: (state, avatar) => {
		state.avatar = avatar;
	}
};

const actions = {
	// 用户登录
	async login({ commit }, login) {
		//调用授权弹窗
		let Info = await uni.getUserProfile({
			desc: '登录'
		});
		console.log(Info);
		//获取用户code
		let Code = await wx.login();
		console.log(Info[1].userInfo.nickName);
		console.log(Code);
		let userInfo = {
			username: Info[1].userInfo.nickName,
			avatarImage: Info[1].userInfo.avatarUrl,
			jsCode: Code.code
		};
		console.log(userInfo, '授权info');

		return new Promise((resolve, reject) => {
			login(userInfo)
				.then(res => {
					console.log(res, 'response');
					const { user, token } = res;
					commit('SET_NAME', user.username);
					commit('SET_AVATAR', user.avatarImage);
					commit('SET_TOKEN', token);
					setToken(token);
					resolve(res);
				})
				.catch(error => {
					// uni.$u.toast(error.message)
					reject(error,"this");
				});
		});
	},

	// 获取用户信息
	getInfo({ commit, state }, getInfo) {
		return new Promise((resolve, reject) => {
			getInfo()
				.then(res => {
					console.log(res, 'store');
					const { user, token } = res;
					commit('SET_NAME', user.uname);
					commit('SET_AVATAR', user.avatar);
					commit('SET_TOKEN', getToken());
					resolve(res);
				})
				.catch(error => {
					// uni.$u.toast(error.message)
					reject(error);
				});
		});
	},

	// 重制state
	resetState({ commit }) {
		return new Promise(resolve => {
			commit('RESET_STATE');
			resolve();
		});
	}
};

export default {
	//命名空间(必填 否则无法索引到此处)
	namespaced: true,
	state,
	mutations,
	actions
};
