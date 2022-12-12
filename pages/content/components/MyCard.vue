<template>
	<view>
		<!-- 任务 -->
		<view v-if="card.type ==0" class="flex task justify-around align-center">
			<view class="warp flex justify-around flex-direction">
				<view class="flex justify-between align-center">
					<view style="padding-left:38rpx; text-indent:-38rpx;">
						<view class="circle" style="display: inline-block;margin: 0 12rpx;vertical-align:20%;" :style="{ backgroundColor: card.color }"></view>
						<span class="text">{{ card.name }}</span>
					</view>

					<image v-if="card.process == 100" :src="card.src" style="width: 50rpx;height: 50rpx;"></image>
					<view v-else class="flex justify-center align-center bigCircle"><view class="innerCircle"></view></view>
				</view>

				<view class="time">
					<u-icon name="bell" size="38" class="margin-right-xs"></u-icon>
					<span>{{ card.time }}</span>
				</view>

				<u-line-progress :striped="true" :percent="card.process" :striped-active="true" height="18"></u-line-progress>
				<u-tag :text="card.tag" shape="circle" :color="card.color" :border-color="card.color" />
			</view>
		</view>

		<!-- 生活 -->
		<view v-if="card.type == 1" class="flex life justify-around align-center">
			<view class="warp flex justify-around flex-direction">
				<view style="padding-left:38rpx; text-indent:-38rpx;">
					<view class="circle" style="display: inline-block;margin: 0 12rpx;vertical-align:20%;" :style="{ backgroundColor: card.color }"></view>
					<span class="text">{{ card.name }}</span>
				</view>
				<view class="time">
					<u-icon name="bell" size="38" class="margin-right-xs"></u-icon>
					<span>{{ card.time }}</span>
				</view>

				<view class="time">
					<u-icon name="map" size="38" class="margin-right-xs"></u-icon>
					<span>{{ card.locate }}</span>
				</view>

				<u-tag :text="card.tag" shape="circle" :color="card.color" :border-color="card.color" />
				<image v-if="card.src" :src="card.src" style="width: 450rpx;height: 200rpx;"></image>
			</view>
		</view>

		<!-- 笔记 -->
		<view v-if="card.content" class="flex note justify-around align-center">
			<view class="warp flex justify-around flex-direction">
				<view class="flex justify-between align-center">
					<view style="padding-left:38rpx; text-indent:-38rpx;">
						<view class="circle" style="display: inline-block;margin: 0 12rpx;vertical-align:20%;" :style="{ backgroundColor: card.color }"></view>
						<span class="text">{{ card.name }}</span>
					</view>

					<u-tag :text="card.tag" shape="circle" :color="card.color" :border-color="card.color" />
				</view>

				<view class="content flex flex-wrap">
					<span>{{ card.content }}</span>
				</view>

				<view class="time">
					<u-icon name="tags" size="38" class="margin-right-xs"></u-icon>
					<span>{{ card.time }}</span>
				</view>
			</view>
		</view>
		<!-- 笔记小卡片 -->
		<view v-if="card.type == 2" class="flex mini_node justify-around align-center padding-sm">
			<view class="warp flex justify-around flex-direction">
				<view style="padding-left:38rpx; text-indent:-38rpx;">
					<view class="circle" style="display: inline-block;margin: 0 12rpx;vertical-align:20%;" :style="{ backgroundColor: card.color }"></view>
					<span class="text">{{ card.name }}</span>
				</view>
				<u-tag :text="card.tag" shape="circle" class="margin-xs" :color="card.color" :border-color="card.color" />
				<view class="content flex flex-wrap margin-xs">
					<view v-if="card.list" class="list flex justify-around align-center margin-xs" v-for="(item, index) in card.list">
						<view style="width: 25rpx;height: 25rpx;border: 1px solid #a9aeb8;margin-right: 10rpx;"></view>
						<span>{{ item }}</span>
					</view>
				</view>

				<view class="time">
					<u-icon name="tags" size="38" class="margin-right-xs"></u-icon>
					<span>{{ card.time }}</span>
				</view>

				<image v-if="card.src" :src="card.src" style="width: 450rpx;height: 200rpx;"></image>
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
		// type 0为任务 1为生活 2为笔记
		return {
			type: 3,
			show: false,
			tempItem: {
				name: null,
				id: null,
				categroyId: null,
				image: '../../static/image/test.png'
			},
			backgroundColor: 'rgba(35,204,82,0.5)'
		};
	},

	methods: {},
};
</script>

<style lang="scss" scoped>
.task {
	width: 550rpx;
	height: 300rpx;
	border-radius: 8px;
	background-color: white;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
	.circle {
		width: 14rpx;
		height: 14rpx;
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

	.time {
		font-size: 26rpx;
		color: #a9aeb8;
	}

	.warp {
		width: 90%;
		height: 90%;
	}
}

.life {
	width: 400rpx;
	height: 550rpx;
	border-radius: 8px;
	background-color: white;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
	.circle {
		width: 14rpx;
		height: 14rpx;
		border-radius: 50%;
	}
	.text {
		font-size: 30rpx;
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


	.time {
		font-size: 26rpx;
		color: #a9aeb8;
	}

	.warp {
		width: 90%;
		height: 90%;
	}
}

.note {
	width: 600rpx;
	height: 300rpx;
	border-radius: 8px;
	background-color: white;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.7);

	.circle {
		width: 14rpx;
		height: 14rpx;
		border-radius: 50%;
	}
	.text {
		font-size: 30rpx;
		font-weight: bold;
	}
	.time {
		font-size: 26rpx;
		color: #a9aeb8;
	}

	.warp {
		width: 90%;
		height: 90%;
	}
	.content {
		height: 80rpx;
		line-height: 40rpx;
		font-size: 26rpx;
		color: #a9aeb8;
	}
}

.mini_node {
	width: 300rpx;
	height: auto;
	border-radius: 8px;
	background-color: white;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
	.circle {
		width: 14rpx;
		height: 14rpx;
		border-radius: 50%;
	}
	.text {
		font-size: 30rpx;
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

	.time {
		font-size: 22rpx;
		color: #a9aeb8;
	}
	
	.list {
		font-size: 22rpx;
		color: #a9aeb8;
	}
	
	.list:nth-of-type(3){
		  background-image: linear-gradient(to top, white, #a9aeb8);
		      -webkit-background-clip: text;
		      color: transparent;
			  opacity: 0.5;
	}
	
	.warp {
		width: 90%;
		height: 90%;
	}
}
</style>
