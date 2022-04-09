<template>
	<view>
		<view class="content">
			<view class="flex  align-center">
				<u-avatar :src="src" class="margin" size="large"></u-avatar>
				 <h3 class="padding">lingche</h3>
				 <u-button type="default" size="medium" plain  style="padding:10px;" >登录/退出登录</u-button>
			</view>
			<view></view>
		</view>
		<view>
		<u-tabbar v-model="current" :list="list" :mid-button="true" mid-button-size="65px" active-color="#23cc52"></u-tabbar>
		</view>
	</view>
</template>

<script>
import {mapState} from 'vuex'	
	export default {
		data() {
			return {
					src: '../../static/image/02.jpg',
					current: 0
			};
		},
		computed: {
			...mapState({
				list:state => state.setting.list
			})
		}
	}
</script>

<style lang="scss">
	.content{
		background-color:#E4E6EC;
		height:500px;
	}	
</style>
