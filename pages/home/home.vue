<template>
	<view>
		<u-navbar
			:background="background"
			back-icon-name="map"
			back-icon-size="55rpx"
			back-icon-color="#696969"
			title="个人主页"
			title-color="#696969"
			is-fixed="true"
			:border-bottom="false"
			z-index="9999"
		></u-navbar>
		<view class="wrap">
			<view class="top">
				<view class="flex align-center">
					<u-avatar :src="userInfo.avatarImage" class="margin" size="large"></u-avatar>
					<span class="padding text">{{userInfo.username}}</span>
					<button  @tap="login" class="userBtn" style="background-color: #f40;" :style="{pointerEvents:pointerEvents}"  v-text="btnValue"></button>
				</view>
				<view class="content flex justify-center align-center">
					<view class="flex align-center" v-for="(v, i) in list1" :key="i">
						<view class="flex flex-direction align-center">
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
					<u-cell-item icon="share" title="停车坐爱枫林晚" :arrow="true" arrow-direction="left"></u-cell-item>
					<u-cell-item icon="map" title="霜叶红于二月花" :arrow="false"></u-cell-item>
				</u-cell-group>
			</view>
			<u-tabbar v-model="current" :list="tabList" :mid-button="true" mid-button-size="65px" active-color="#23cc52"></u-tabbar>
		</view>
	</view>
</template>

<script>
import { tabList } from '../../store/tabbar.js';
import IconWrap from '../../components/iconWrap.vue';
export default {
	components: {
		IconWrap
	},
	data() {
		return {
			animation:'',
			pointerEvents:'initial',//鼠标事件
			userInfo: {
			  isLogin: true,
			  username: '微信用户',
			  avatarImage: ''
			},
			background: {
				backgroundColor: '#F5F5F5'
			},
			bg: 'rgba(255,165,30,0.5)',
			tabList: tabList,
			btnValue: '微信登录',
			list1: [
				{
					iconSize: 65,
					color: '#FFA51E',
					iconName: 'file-text',
					tagName: '记录天数',
					tagNum: 200,
					bg: 'rgba(255,165,30,0.5)'
				},
				{
					iconSize: 65,
					color: '#23CC52',
					iconName: 'tags-fill',
					tagName: '创建标签',
					tagNum: 15,
					bg: 'rgba(35,204,82,0.5)'
				},
				{
					iconSize: 65,
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
	onLoad() {
		
	},

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
		     cloneList[0].tagNum =  0;
		     cloneList[1].tagNum =  0;
		     cloneList[2].tagNum =  0;
		     this.list1 =  cloneList;
		      //重制state
		      this.$store.dispatch('user/resetState');
		    } else {
		      //获取用户信息api
		      const apiGetInfo = this.$u.api.User.getInfo;
		      await this.$store
		        .dispatch('user/getInfo', apiGetInfo)
		        .then(res => {
		          console.log(res, 'dispatchres');
		
		          this.userInfo.isLogin = true;
		          this.userInfo.avatarImage = res.user.avatarImage;
		          this.userInfo.username = res.user.username;
				  this.btnValue = res.user.quote;
				  this.pointerEvents = 'none';
				  let cloneList = JSON.parse(JSON.stringify(this.list1));
				  cloneList[0].tagNum =  res.user.records;
				  cloneList[1].tagNum =  res.user.createTaps;
				  cloneList[2].tagNum =  res.user.collectTaps;
				  this.list1 =  cloneList;
		        })
		        .catch(error => {
		          console.log(error, 'getRejInfo');
		          if (error.statusCode == 408) {
		            uni.$u.toast('会话过期，请重新登录');
		
		            this.userInfo.isLogin = false;
					this.btnValue = '微信登录';
		            this.userInfo.username = '微信用户';
		            this.userInfo.avatarImage = '';
					this.pointerEvents = 'initial';
					let cloneList = JSON.parse(JSON.stringify(this.list1));
					cloneList[0].tagNum =  0;
					cloneList[1].tagNum =  0;
					cloneList[2].tagNum =  0;
					this.list1 =  cloneList;
		            //重制state
		            this.$store.dispatch('user/resetState');
		          }
		        });
		    }
		  },
		  async login() {
		      //登录接口api
		      uni.removeStorageSync('userToken');
		      const apiLogin = this.$u.api.User.login;
		      await this.$store.dispatch('user/login', apiLogin).then(res => {
		        console.log(res, 'dispatchres');
				
		        this.userInfo.isLogin = true;
		        this.userInfo.avatarImage = res.user.avatarImage;
		        this.userInfo.username = res.user.username;
				this.btnValue = res.user.quote;
				this.pointerEvents = 'none';
				let cloneList = JSON.parse(JSON.stringify(this.list1));
				cloneList[0].tagNum =  res.user.records;
				cloneList[1].tagNum =  res.user.createTaps;
				cloneList[2].tagNum =  res.user.collectTaps;
				this.list1 =  cloneList;
		      }); 
		  },
	},
  async	onLoad() {
		//动态加载网络字体
	await	wx.loadFontFace({
			family: 'webfont',
			source: 'url("https://niuqi.lingche.net.cn/YunFengJingLongXingShu-2.ttf")',
			success: function(res) {
				console.log(res, 'success'); //  loaded
			},
			fail: function(res) {
				console.log(res); //  error
			},
			complete: function(res) {
				console.log(res);
			}
		});
		
	await this.checkTokenExpired();	
	}
};
</script>

<style lang="scss" scoped>
.wrap {
	background-color: rgba(195, 191, 191, 0.1);
	.top {
		height: 600upx;
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
	font-family: 'webfont' !important;
	font-size: 65rpx;
	font-style: normal;
	-webkit-font-smoothing: antialiased;
	-webkit-text-stroke-width: 0.2rpx;
	-moz-osx-font-smoothing: grayscale;
}


//自定义btn
.userBtn {
	display: flex;
	align-items: center;
	justify-content: center;
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
