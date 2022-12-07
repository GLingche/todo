<template>
	<view>
		<u-navbar :background="background" :is-back="false" title-color="#696969" is-fixed="true" :border-bottom="false" z-index="9999">
			<view class="slot-wrap">
				<span class="monDaySpan">{{ monDay }}</span>
				<u-tag :text="week" shape="circle" type="success" />
			</view>
		</u-navbar>
		<!-- 搜索 -->
		<view style="width: 100%;position: fixed ;z-index:999" class="flex justify-center align-center">
			<u-search
				placeholder="搜索你想要知道的笔记事项"
				style="width: 80%;margin: 10px;"
				:animation="true"
				@custom="searchItem"
				@search="searchItem"
				v-model="keywords"
			></u-search>
			<view class="flex align-center justify-center boxCard"><u-icon name="calendar" color="#23cc52" size="42"></u-icon></view>
		</view>
		<!-- 内容 -->
		<view class="wrap">
			<!-- 标签 -->
			<u-tabs :list="list" gutter="0" bar-width="160" :is-scroll="false" active-color="#23cc52" inactive-color="#606266" :current="currentTab" @change="change"></u-tabs>
			<!-- 事项 -->
			<view class="flex scorll_item" style="width: 650rpx;height: 150rpx;margin:10px">
				<view v-for="(v, i) in list1" :key="i" style="margin: 10px;"><MinIcon :icon="v"></MinIcon></view>
				<view class="flex justify-center  align-center boxCard2"><u-icon name="plus" color="#c9cdd4" size="48"></u-icon></view>
			</view>

			<!-- 详情 -->
			<view style="margin-left:20px;">
				<u-dropdown active-color="#23cc52" title-size="32" style="font-weight: bold;">
					<u-dropdown-item v-model="value1" :title="dropdownTitle" :options="options1" @change="changeDropdown"></u-dropdown-item>
				</u-dropdown>

				<view class="flex scorll_item" style="width: 650rpx;height: 350rpx;">
					<MyCard v-for="(item, index) in list2" :key="index" style="margin:16px 10px 0px 10px;" :card="item"></MyCard>
				</view>

					<u-waterfall v-model="flowList">
					<template v-slot:left="{leftList}">
						<view v-for="(item, index) in leftList" :key="index" style="margin-top: 30rpx;">
							<MyCard :card="item"></MyCard>
						</view>
					</template>
					<template v-slot:right="{rightList}">
						<view v-for="(item, index) in rightList" :key="index" style="margin-top: 30rpx;">
							<MyCard :card="item"></MyCard>
						</view>
					</template>
				</u-waterfall>
				<image src="../../static/image/report.png" style="width: 96%;height: 260rpx;margin: 10rpx 0;"></image>
			</view>
		</view>
		<u-loadmore bg-color="rgb(240, 240, 240)" :status="loadStatus"></u-loadmore>
		<u-tabbar v-model="current" :list="tabList" :mid-button="true" mid-button-size="65px" active-color="#23cc52"></u-tabbar>
	</view>
</template>
s
<script>
import { tabList } from '../../store/tabbar.js';
import { testList, scrollerList } from './test.js';
import { mapState } from 'vuex';
import { getMonDay, toWeekName } from '../../utils/formatter.js';
import MinIcon from './components/MinIcon.vue';
import MyCard from './components/MyCard.vue';
export default {
	components: {
		MinIcon,
		MyCard
	},
	data() {
		return {
			loadStatus: 'loadmore',
			flowList: [],
			list2: [],
			dropdownTitle: '今日',
			value1: 1,
			options1: [
				{
					label: '今日',
					value: '今日'
				},
				{
					label: '本周',
					value: '本周'
				},
				{
					label: '所有',
					value: '所有'
				}
			],
			keywords: '',
			monDay: 'Oct 2',
			week: '星期一',
			tabList: tabList,
			current: 0,
			background: {
				backgroundColor: '#ffffff'
			},
			list: [
				{
					name: '任务'
				},
				{
					name: '生活'
				},
				{
					name: '笔记'
				}
			],
			list1: [
				{
					src: '../../../static/image/test.png',
					name: '设计工作',
					number: 12,
					color: 'rgba(35,204,82,0.2)'
				},
				{
					src: '../../../static/image/test.png',
					name: '设计工作',
					number: 12,
					color: 'rgba(35,204,82,0.2)'
				},
				{
					src: '../../../static/image/test.png',
					name: '设计工作',
					number: 12,
					color: 'rgba(35,204,82,0.2)'
				},
				{
					src: '../../../static/image/test.png',
					name: '设计工作',
					number: 12,
					color: 'rgba(35,204,82,0.2)'
				},
				{
					src: '../../../static/image/test.png',
					name: '设计工作',
					number: 12,
					color: 'rgba(35,204,82,0.2)'
				}
			],
			currentTab: 0
		};
	},
	computed: {},
	onShow() {
		console.log(testList);
		// console.log(scrollerList);
		this.monDay = getMonDay();
		this.week = toWeekName();
	},
	onLoad() {
		this.list2 = scrollerList;
		this.addRandomData();
	},
	methods: {
		change(index) {
			this.currentTab = index;
		},
		changeDropdown(value) {
			this.dropdownTitle = value;
		},
		itemTap(item) {
			console.log(item);
		},
		addRandomData() {
			for (let i = 0; i < testList.length; i++) {
				let index = this.$u.random(0, testList.length - 1);
				// 先转成字符串再转成对象，避免数组对象引用导致数据混乱
				let item = JSON.parse(JSON.stringify(testList[i]));
				item.id = this.$u.guid();
				this.flowList.push(item);
			}
		}
	},
	onReachBottom() {
		this.loadStatus = 'loading';
		// 模拟数据加载
		setTimeout(() => {
			this.addRandomData();
			this.loadStatus = 'loadmore';
		}, 1000);
	}
};
</script>

<style lang="scss">
.scorll_item {
	overflow-x: scroll;
}

.boxCard {
	width: 32px;
	height: 32px;
	background-color: white;
	border-radius: 50%;
	box-shadow: 0 5px 5px rgba(122, 122, 122, 0.7);
}

.boxCard2 {
	border-radius: 5px;
	top: 25%;
	right: 3%;
	opacity: 0.8;
	position: absolute;
	z-index: 999;
	width: 68rpx;
	height: 68rpx;
	background-color: white;
	box-shadow: 0 5px 5px rgba(122, 122, 122, 0.7);
}
.wrap {
	padding: 0;
	margin: 100rpx 0;
}
</style>
