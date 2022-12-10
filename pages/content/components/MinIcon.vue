<template>
	<view class="flex justify-around align-center" style="width: 250rpx;height: 100rpx;">
		<view class="flex justify-center align-center" :style="{backgroundColor:icon.color}" style="width: 100rpx;height: 100rpx;border-radius:15rpx;"><image style="width: 80rpx;height: 100rpx;" :src="icon.src"></image></view>
		<view class="flex justify-center align-center flex-direction">
			<span style="font-size: 32rpx;font-weight: bold;color: #000000;">{{icon.name}}</span>
			<span style="font-size: 28rpx;font-weight: bold; color:#a9aeb8 ;">{{icon.number}}项完成</span>
		</view>
	</view>
</template>

<script>
export default {
	name: 'MinIcon',
	props: {
		icon: Object
	},
	data(props) {
		return {
			show: false,
			tempItem: {
				name: null,
				id: null,
				categroyId: null,
				image: '../../static/image/test.png'
			},
			list: {
				src: '../../static/image/test.png',
				name: '设计工作',
				number: 12,
				color: '#23cc52'
			},
			backgroundColor: 'rgba(35,204,82,0.5)'
		};
	},

	methods: {}
};
</script>

<style lang="scss" scoped>
	
	
</style>
