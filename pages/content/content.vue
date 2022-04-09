<template>
	<view>
		content
		<u-tabbar v-model="current" :list="list" :mid-button="true" mid-button-size="65px" active-color="#23cc52"></u-tabbar>
	</view>
</template>

<script>
import {mapState} from 'vuex'	
	export default {
		data() {
			return {
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

</style>
