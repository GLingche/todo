<template>
	<view>
		<calendar
			:config ="conf"
		/>
		<u-tabbar v-model="current" :list="tabList" :mid-button="true" mid-button-size="65px" active-color="#23cc52"></u-tabbar>
	</view>
</template>

<script>
import {tabList} from '../../store/tabbar.js';
import {mapState} from 'vuex'
export default {
		data() {
			const conf =  {
				      multi: true, // 是否开启多选,
				      weekMode: true, // 周视图模式
				      theme: 'elegant', // 日历主题，目前共两款可选择，默认 default 及 elegant，自定义主题色在参考 /theme 文件夹
				      showLunar: false, // 是否显示农历，此配置会导致 setTodoLabels 中 showLabelAlways 配置失效
				      inverse: true, // 单选模式下是否支持取消选中,
				      markToday: '今', // 当天日期展示不使用默认数字，用特殊文字标记
				      hideHeader: true, // 隐藏日历头部操作栏
				      takeoverTap: true, // 是否完全接管日期点击事件（日期不会选中)
				      emphasisWeek: true, // 是否高亮显示周末日期
				      chooseAreaMode: true, // 开启日期范围选择模式，该模式下只可选择时间段
				      showHolidays: false, // 显示法定节假日班/休情况，需引入holidays插件
				      showFestival: false, // 显示节日信息（如教师节等），需引入holidays插件
				      highlightToday: true, // 是否高亮显示当天，区别于选中样式（初始化时当天高亮并不代表已选中当天）
				      defaultDate: '2018-3-6', // 默认选中指定某天，如需选中需配置 autoChoosedWhenJump: true
				      preventSwipe: false, // 是否禁用日历滑动切换月份
				      firstDayOfWeek: 'Mon', // 每周第一天为周一还是周日，默认按周日开始
				      onlyShowCurrentMonth: true, // 日历面板是否只显示本月日期
				      autoChoosedWhenJump: true, // 设置默认日期及跳转到指定日期后是否需要自动选中
				      disableMode: {
				        // 禁用某一天之前/之后的所有日期
				        type: 'after', // [‘before’, 'after']
				        date: '2020-3-24' // 无该属性或该属性值为假，则默认为当天
				      }
				}
			return {
				conf,
				tabList:tabList,
				current: 0
			};
		},
		computed: {
			// ...mapState({
			// 	list:state => state.setting.list
			// })
		}
	}
</script>

<style lang="scss"></style>
