<template>
	<view>
		<u-navbar :background="background" :is-back="false"  is-fixed="true" :border-bottom="false" z-index="9999">
			<view class="slot-wrap"><span class="monDaySpan">{{monDay}}</span><u-tag :text="week" shape="circle" type="success" /></view>
		</u-navbar>
		<view class="wrap">
			<view class="top">
				<view class="flex align-center">
					<u-avatar
						:src="userInfo.avatarImage"
						class="margin"
						size="large"
						style="animation-duration:1s"
						:class="[animation == 'slide-right' ? 'animation-slide-right' : '']"
					></u-avatar>
					<span class="padding text" :class="[animation == 'slide-right' ? 'animation-slide-right' : '']" style="animation-duration:1s">{{ userInfo.username }}</span>
					<button
						@tap="login"
						class="userBtn"
						style="background-color: #f40;animation-duration:1s"
						:style="{ pointerEvents: pointerEvents }"
						:class="[animation == 'slide-right' ? 'animation-slide-right' : '']"
						v-text="btnValue"
					></button>
				</view>
				<view class="content flex justify-center align-center">
					<view class="flex align-center" v-for="(v, i) in list1" :key="i">
						<view class="flex flex-direction justify-between align-center" style="height: 150rpx;width: 150rpx;">
							<iconWrap :bgColor="v.bg" :size="v.iconSize" :color="v.color" :name="v.iconName"></iconWrap>
							<span style="color:#a9aeb8">{{ v.tagName }}</span>
							<span style="font-weight: bold;">{{ v.tagNum }}</span>
						</view>
						<view v-if="i < 2" style="height: 200upx;">
							<u-line class="u-line" color="#a9aeb8" :hair-line="false" margin="50rpx 50rpx" direction="col" width="100%" length="50%" />
						</view>
					</view>
				</view>
				<u-line class="u-line" color="#DDDDDD" margin="50rpx 30rpx" length="92%" direction="row" />
			</view>

			<view class="tag">
				<u-cell-group>
					<u-cell-item icon="edit-pen" title="标签管理" :arrow="true" arrow-direction="left"></u-cell-item>
					<u-cell-item icon="account" title="个人信息" :arrow="true" arrow-direction="left"></u-cell-item>
					<u-cell-item icon="question-circle" title="常见问题" :arrow="true" arrow-direction="left"></u-cell-item>
					<u-cell-item icon="setting" title="设置" :arrow="true" arrow-direction="left"></u-cell-item>
					<u-line class="u-line" color="#DDDDDD" margin="50rpx 30rpx" length="92%" direction="row" />
					<u-cell-item icon="bell" title="更新日志" :arrow="false" @click="toLog"></u-cell-item>
				</u-cell-group>
			</view>
			<u-tabbar v-model="current" :list="tabList" :mid-button="true" mid-button-size="65px" active-color="#23cc52"></u-tabbar>
		</view>
	</view>
</template>

<script>
import { tabList } from '../../store/tabbar.js';
import IconWrap from '../../components/iconWrap.vue';
import {getMonDay,toWeekName} from '../../utils/formatter.js';
export default {
	components: {
		IconWrap
	},
	data() {
		return {
			monDay:'Oct 2',
			week:'星期一',
			animation: '',
			pointerEvents: 'initial', //鼠标事件
			userInfo: {
				isLogin: true,
				username: '微信用户',
				avatarImage: ''
			},
			background: {
				backgroundColor: 'rgba(195, 191, 191, 0.1)'
			},
			bg: 'rgba(255,165,30,0.5)',
			tabList: tabList,
			btnValue: '微信登录',
			list1: [
				{
					iconSize: 48,
					color: '#FFA51E',
					iconName: 'file-text',
					tagName: '记录天数',
					tagNum: 200,
					bg: 'rgba(255,165,30,0.5)'
				},
				{
					iconSize: 48,
					color: '#23CC52',
					iconName: 'tags-fill',
					tagName: '创建标签',
					tagNum: 15,
					bg: 'rgba(35,204,82,0.5)'
				},
				{
					iconSize: 48,
					color: '#257CFF',
					iconName: 'bag-fill',
					tagName: '收藏条目',
					tagNum: 20,
					bg: 'rgba(37,124,255,0.5)'
				}
			],
			src: '',
			current: 0
		};
	},
	computed: {
		adaptSize() {
			return (this.windowWidth / 10) * 2;
		}
	},
	onLoad() {},

	methods: {
		//检验token是否过期
		async checkTokenExpired() {
			if (this.$store.getters.token == null || this.$store.getters.token == '') {
				this.userInfo.isLogin = false;
				this.btnValue = '微信登录';
				this.userInfo.username = '微信用户';
				this.userInfo.avatarImage = '';
				this.pointerEvents = 'initial';
				let cloneList = JSON.parse(JSON.stringify(this.list1));
				cloneList[0].tagNum = 0;
				cloneList[1].tagNum = 0;
				cloneList[2].tagNum = 0;
				this.list1 = cloneList;
				//重制state
				this.$store.dispatch('user/resetState');
			} else {
				//获取用户信息api
				const apiGetInfo = this.$u.api.User.getInfo;
				await this.$store
					.dispatch('user/getInfo', apiGetInfo)
					.then(res => {
						console.log(res, 'dispatchres');
						this.animation = 'slide-right';
						this.userInfo.isLogin = true;
						this.userInfo.avatarImage = res.user.avatarImage;
						this.userInfo.username = res.user.username;
						this.btnValue = res.user.quote;
						this.pointerEvents = 'none';
						let cloneList = JSON.parse(JSON.stringify(this.list1));
						cloneList[0].tagNum = res.user.records;
						cloneList[1].tagNum = res.user.createTaps;
						cloneList[2].tagNum = res.user.collectTaps;
						this.list1 = cloneList;

						setTimeout(() => {
							this.animation = '';
						}, 1000);
					})
					.catch(error => {
						console.log(error, 'getRejInfo');
						if (error.statusCode == 408) {
							uni.$u.toast('会话过期，请重新登录');
							this.animation = 'slide-right';
							setTimeout(() => {
								this.userInfo.isLogin = false;
								this.btnValue = '微信登录';
								this.userInfo.username = '微信用户';
								this.userInfo.avatarImage = '';
								this.pointerEvents = 'initial';
								let cloneList = JSON.parse(JSON.stringify(this.list1));
								cloneList[0].tagNum = 0;
								cloneList[1].tagNum = 0;
								cloneList[2].tagNum = 0;
								this.list1 = cloneList;
								//重制state
								this.$store.dispatch('user/resetState');
								this.animation = '';
							}, 1000);
						}
					});
			}
		},
		async login() {
			//登录接口api
			uni.removeStorageSync('userToken');
			const apiLogin = this.$u.api.User.login;
			await this.$store.dispatch('user/login', apiLogin).then(res => {
				this.animation = 'slide-right';
				this.userInfo.isLogin = true;
				this.userInfo.avatarImage = res.user.avatarImage;
				this.userInfo.username = res.user.username;
				this.btnValue = res.user.quote;
				this.pointerEvents = 'none';
				let cloneList = JSON.parse(JSON.stringify(this.list1));
				cloneList[0].tagNum = res.user.records;
				cloneList[1].tagNum = res.user.createTaps;
				cloneList[2].tagNum = res.user.collectTaps;
				this.list1 = cloneList;
				setTimeout(() => {
					this.animation = '';
				}, 1000);
				console.log(res, 'dispatchres');
			});
		},
		toLog() {
			uni.navigateTo({
				url: '../../subpages/log/log'
			});
		}
	},
	onLoad() {
		//动态加载网络字体
		wx.loadFontFace({
			family: 'webfont',
			source: 'url("https://niuqi.lingche.net.cn/YunFengJingLongXingShu-2.ttf")'
		})
			.then(res => {
				this.checkTokenExpired();
			})
			.catch(err => {
				console.log(err);
			});
	},
	onShow() {
		this.monDay = getMonDay();
		this.week = toWeekName();
	}
};
</script>

<style lang="scss" scoped>
@import '../../colorui/animation.css';	
.wrap {
	background-color: rgba(195, 191, 191, 0.1);
	width: 100%;
	height: 100%;
	.top {
		height: 550upx;
		.content {
			height: 250upx;
			border: 1px #e4e6ec solid;
			border-radius: 15upx;
			margin: 30upx 30upx;
			background-color: white;
		}
	}
}
.tempalte {
	transform: rotate(90deg);
	opacity: 0;
}

.text {
	display: inline-block;
	font-family: 'webfont' !important;
	font-size: 65rpx;
	font-style: normal;
	-webkit-font-smoothing: antialiased;
	-webkit-text-stroke-width: 0.2rpx;
	-moz-osx-font-smoothing: grayscale;
}

//自定义btn
.userBtn {
	display: inline-block;
	position: relative;
	z-index: 999;
	width: 150rpx;
	height: 65rpx;
	color: white;
	background-color: hsl(340, 100%, 75%);
	text-shadow: rgb(0, 0, 0 / 35%) 0 -1px 0, rgb(0, 0, 0 / 70%) 0 0.15em 0.15em;
	box-shadow: inset rgba(255, 254, 255, 0.6) 0 0.3em 0.3em, inset rgba(0, 0, 0, 0.15) 0 -0.1em 0.3em, /* inner shadow */ hsl(340, 70%, 50%) 0 0.1em 3px,
		hsl(340, 80%, 40%) 0 0.3em 1px, /* color border */ rgba(0, 0, 0, 0.2) 0 0.5em 5px;

	border-radius: 8rpx;
	padding: 0;

	font-size: 30rpx;
}

.userBtn:after {
	content: '';
	position: absolute;
	width: 180%;
	height: 90%;
	top: 0;
	left: 5%;
	border-radius: 0.5em 0.5em 1em 1em / 0.5em 0.5em 2em 2em;
	background-image: -webkit-gradient(
		linear,
		0% 0,
		100% 0,
		from(rgba(255, 255, 255, 0.55)),
		to(rgba(255, 255, 255, 0.5)),
		color-stop(0.5, rgba(255, 255, 255, 0)),
		color-stop(0.8, rgba(255, 255, 255, 0))
	);
}
</style>
