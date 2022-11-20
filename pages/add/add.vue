<template>
	<view>
		add
		<u-tabbar v-model="current" :list="tabList" :mid-button="true" mid-button-size="65px" active-color="#23cc52"></u-tabbar>
	</view>
	
</template>

<script>
import {tabList} from '../../store/tabbar.js';
	export default {
		data() {
			return {
				tabList:tabList,
					current: 0
			}
		},
		methods: {
			
		},
		computed: {
		}
	}
</script>

<style lang="scss">

</style>
