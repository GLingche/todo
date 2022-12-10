<template>
	<u-popup v-model="show" mode="bottom" border-radius="14" :height="originWidth">
		<view class=" main">
			<view class="wrap" @tap="show = false" @touchmove="touchMove" @touchend="touchEnd" @touchstart="touchStart"><view class="move"></view></view>
			<span class="top">创建标签</span>
			<span class="text">标签名</span>
			<view style="width: 90%;margin:24rpx;"><u-input v-model="value" type="text" border="true" placeholder="请输入标签名" /></view>
			<span class="text">色彩</span>
			<view class="srollItem flex align-center" :class="className">
				<view
					:class="[item.status ? 'hoverItem' : '']"
					@tap="clickColorList(item, index)"
					v-for="(item, index) in coloritems"
					:key="index"
					class="circle"
					:style="{ backgroundColor: item.color }"
				></view>
			</view>
			<u-line class="u-line" color="#a9aeb8" margin="0 30rpx" length="90%" direction="row" />
			<span class="text">图标</span>
			<view class="srollItem flex align-center" :class="className">
				<view
					@tap="addIcon"
					style="flex-shrink: 0;width: 78rpx;height: 78rpx;border:1px #c9cdd4 dashed ;border-radius: 50%;margin: 0 20rpx 20rpx 0;"
					class="flex justify-center  align-center"
				>
					<u-icon name="plus" color="#c9cdd4" size="48"></u-icon>
				</view>
				<image
					@tap="clickImageList(item, index)"
					:class="[item.status ? 'hoverItemImage' : '']"
					v-for="(item, index) in imageItems"
					:key="item.id"
					class="imageItem"
					:src="item.src"
				></image>
			</view>
			<view class="flex justify-end" style="margin: 36rpx 24rpx 24rpx 24rpx">
				<u-button type="info" class="margin-right" size="medium" @click="show = false">取消</u-button>
				<u-button type="success" class="margin-right" size="medium">确认</u-button>
			</view>
		</view>
	</u-popup>
</template>

<script>
import { colorList, imageList } from '../color.js';
export default {
	name: 'CreateTag',
	props: {
		icon: Object
	},
	data(props) {
		return {
			tempImageSrc:'',
			imgTempIndex: 0,
			colorTempIndex: 0,
			coloritems: [],
			imageItems: [],
			className: '',
			beaginMS: '',
			endMS: '',
			startY: '',
			originWidth: 1000,
			distance: '',
			value: '',
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

	methods: {
		addIcon() {
			let that = this;
			wx.chooseMedia({
				count: 1,
				mediaType: ['image'],
				sourceType: ['album', 'camera'],
				maxDuration: 30,
				camera: 'back',
				success: function(res) {
					// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
					let picFilePath = res.tempFiles[0].tempFilePath;
					//启动上传等待中...
					// wx.showToast({
					//   title: '正在上传...',
					//   icon: 'loading',
					//   mask: true,
					//   duration: 10000
					// });
					console.log(picFilePath);
						
					that.tempImageSrc = picFilePath;
					let obj = {
						src:picFilePath,
						id:Math.random().toString(36).slice(2),
						status:false
					}
					that.imageItems[that.imgTempIndex].status = false;
					that.imgTempIndex = 0;
					that.imageItems.unshift(obj)
					console.log(that.imageItems)
					let penPictrue = 'data:image/png;base64,' + wx.getFileSystemManager().readFileSync(picFilePath, 'base64');
				}
			});
		},
		clickColorList(val, index) {
			this.coloritems[this.colorTempIndex].status = false;
			val.status = true;
			this.colorTempIndex = index;
		},
		clickImageList(val, index) {
			this.imageItems[this.imgTempIndex].status = false;
			val.status = true;
			this.imgTempIndex = index;
		},
		touchStart(e) {
			this.beaginMS = Date.now(); //记录用户开始的触摸时间
			this.startY = e.touches[0].pageY;

			console.log(this.startY, '手指当前的Y坐标');
		},
		touchMove(e) {
			this.distance = this.startY - e.touches[0].pageY;
			this.startY = e.touches[0].pageY;
			// console.log(this.originWidth,"origin")
			if (this.originWidth > 1000) {
				this.className = 'flex-wrap';
			}
			if (this.originWidth <= 1000) {
				this.className = '';
			}
			if (this.originWidth < 700 && this.distance < 0) {
				this.show = false;
				return;
			}
			if (this.originWidth > 1400 && this.distance > 0) {
				return;
			}
			this.originWidth = this.originWidth + this.distance;

			// console.log(e.touches[0].pageY,'移动的距离')
		},
		touchEnd(e) {
			this.endMS = Date.now(); //记录用户最后的触摸时间
			if (this.endMS - this.beaginMS < 500 && this.distance < -100) {
				console.log(222222);
				this.show = false;
			}
			console.log(this.originWidth, '手指松开了');
		}
	},
	watch: {
		show(val) {
			if (val) {
				this.$emit('perventTouch');
			} else {
				this.$emit('resetTouch');
			}
		}
	},
	created() {
		this.coloritems = colorList;
		this.imageItems = imageList;
	}
};
</script>

<style lang="scss" scoped>
.main {
	width: 100%;
	height: 100%;

	.wrap {
		margin: 0 auto;
		height: 60rpx;
		width: 200rpx;
		border: 1px solid transparent;
		.move {
			margin: 24rpx auto;
			height: 22%;
			width: 66%;
			background-color: #e5e6eb;
			border-radius: 32rpx;
			border: 1px solid #86909c;
		}
	}

	.top {
		margin: 24rpx;
		font-size: 42rpx;
		font-weight: bold;
	}

	.text {
		display: block;
		margin: 24rpx;
		font-size: 26rpx;
		color: #272e3b;
	}

	.srollItem {
		margin: 24rpx 24rpx 10rpx 32rpx;
		width: 700rpx;
		height: 16%;
		overflow: auto;
	}
	.circle {
		width: 78rpx;
		height: 78rpx;
		flex-shrink: 0;
		margin: 0 20rpx 20rpx 0;
		background-color: #000000;
		border-radius: 50%;
	}

	.imageItem {
		width: 78rpx;
		height: 78rpx;
		flex-shrink: 0;
		margin: 0 20rpx 20rpx 0;
	}

	.hoverItem {
		width: 100rpx;
		height: 100rpx;
	}
	.hoverItemImage{
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		background: linear-gradient(to bottom, transparent, #23C343),
	}
}
</style>
