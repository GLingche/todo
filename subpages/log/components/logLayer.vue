<template>
	<view class="layer">
		<view class="remind">
			<view class="badge" style="background-color: #F53F3F;"></view>
			<view class="badge" style="background-color: #F7BA1E;"></view>
			<view class="badge" style="background-color: #7BE188;"></view>
		</view>
		<view class="content">
			<view class="edition">v1.2.3</view>
			<view class="text">
				<view>
					<view class="ii"></view>
					支持从微信聊天会话中上传文件
				</view>
				<view>
					<view class="ii"></view>
					支持自动填充会议内容
				</view>
				<view>
					<view class="ii"></view>
					支持会议签到
				</view>
				<view>
					<view class="ii"></view>
					支持值日签到与签退
				</view>
				<view>
					<view class="ii"></view>
					支持自动显示值日安排
				</view>
				<view>
					<view class="ii"></view>
					支持月末推送本月签到情况
				</view>
				<view>
					<view class="ii"></view>
					支持微信推送新生面试结果
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'LogLayer',
	props: {
		version: String,
		logList: Array,
	},
	data() {
		// 2 代表可回收物 以此类推
		return {
			show: false,
			tempItem: {
				name: null,
				id: null,
				categroyId: null,
				image: '../../static/kehuishou.png'
			}
		};
	},

	methods: {}
};
</script>

<style lang="scss" scoped>
.layer {
	width: 100%;
	height: 400upx;
	background-color: white;
	border-radius: 12upx;
	box-shadow: 0 25px 40px rgba(0, 0, 0, 0.7);
}

.badge {
	display: inline-block;
	width: 7px;
	height: 7px;
	line-height: 5px;
	border-radius: 50%;
	margin: 2px;
	float: left;
}

.edition {
	font-size: 20px;
	margin: 5px auto;
	color: #23cc52;
}
.text {
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: flex-start;
	flex-wrap: wrap;
	text-indent: 2rem;
}

.ii {
	display: inline-block;
	width: 7px;
	height: 7px;
	line-height: 5px;
	background-color: #23cc52;
	border-radius: 50%;
	margin-right: 8px;
}

.content {
	width: 90%;
	height: 100px;
	margin: 10px auto;
}
  .remind {
    width: 90%;
    height: 15px;
    margin: 0 auto;
    padding-top: 6px;
  }
</style>
