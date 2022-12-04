<template>
	<view>
		<view v-if="type == 1" class="flex life justify-around align-center">
			<view class="warp flex justify-around flex-direction">
				<view class="flex justify-between align-center">
					<view class="flex justify-center align-center">
						<view class="circle" :style="{ backgroundColor: list.color }" style="margin: 0 5px;"></view>
						<span class="text">{{ list.name }}</span>
					</view>
				
					<image v-if="list.process == 100" :src="list.src" style="width: 50rpx;height: 50rpx;"></image>
					<view v-else class="flex justify-center align-center bigCircle"><view class="innerCircle"></view></view>
				</view>
	
				<view class="time">
					<u-icon name="bell" size="38"></u-icon><span>{{list.time}}</span>
				</view>
		
				<u-line-progress :striped="true" :percent="list.process" :striped-active="true" height="18"></u-line-progress>
				<u-tag :text="list.tag" shape="circle"  :color="list.color" :border-color="list.color"/>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'MyCard',
	props: {
		card: Object,
		types: Number
	},
	data(props) {
		// type 1为任务 2为生活 3为笔记
		return {
			type: 1,
			show: false,
			tempItem: {
				name: null,
				id: null,
				categroyId: null,
				image: '../../static/image/test.png'
			},
			list: {
				process:100,
				id: 'dfa',
				tag: '设计工作',
				src: '../../../static/image/finish.png',
				name: '准备本周周会演示文档',
				time: '12:00 PM,10月2日',
				color: '#23cc52',
				list: ['工作汇报', '技能分享']
			},
			backgroundColor: 'rgba(35,204,82,0.5)'
		};
	},

	methods: {}
};
</script>

<style lang="scss" scoped>
.life {
	width: 550rpx;
	height: 300rpx;
	border-radius: 8px;
	background-color: white;
	box-shadow: 0 25px 40px rgba(0, 0, 0, 0.7);
	.circle {
		width: 18rpx;
		height: 18rpx;
		border-radius: 50%;
	}
	.text {
		font-size: 36rpx;
		font-weight: bold;
	}

	.bigCircle {
		width: 50rpx;
		height: 50rpx;
		border-radius: 50%;
		background-color: #a9aeb8;
		.innerCircle {
			width: 42rpx;
			height: 42rpx;
			border-radius: 50%;
			background-color: white;
		}
	}
	
	
	.time{
		font-size: 26rpx;
		color:#a9aeb8;
	}
	
	.warp{
		width: 90%;
		height: 90%;
	}
}
</style>
