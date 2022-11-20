<template>
	<view class="flex justify-center align-center" :style="bag"><u-icon :name="name" :size="size" :color="color"></u-icon></view>
</template>

<script>
export default {
	props: ['color', 'size', 'name', 'bgColor'],
	name: 'iconWrap',
	data(props) {
		let size = parseInt(props.size) + 40;
		console.log(props.bgColor);
		return {
			bag: {
				width: size + 'upx',
				height: size + 'upx',
				borderRadius: '50%',
				backgroundColor: props.bgColor
			}
		};
	}
};
</script>

<style lang="scss"></style>
