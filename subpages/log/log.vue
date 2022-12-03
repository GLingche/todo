<template>
	<view>
		  <u-navbar back-icon-size="35rpx" back-text="首页" title="更新日志" :is-fixed="true" border-bottom="false"></u-navbar>
		  <view class="margin">
			  	  <LogLayer></LogLayer>
		  </view>	
	</view>
</template>

<script>
import {mapState} from 'vuex'
 import LogLayer from './components/logLayer.vue';
export default {
	components: {
	  LogLayer
	},
	data() {
			return {
			};
		}
	}
</script>

<style lang="scss">
	page{
		width: 100%;
		height: 100%;
		background-color: #f2f3f5;
	}	
	
</style>
