<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
		@import "uview-ui/index.scss";	
		@import './colorui/animation.css';	
	.monDaySpan{
		font-size: 36rpx;
		font-weight: bold;
		color: #272e3b;
		margin:0 10px 0 0;
	}
	
	.slot-wrap {
			display: flex;
			align-items: center;
			/* 如果您想让slot内容占满整个导航栏的宽度 */
			/* flex: 1; */
			/* 如果您想让slot内容与导航栏左右有空隙 */
			 padding: 0 20rpx; 
		}
</style>
