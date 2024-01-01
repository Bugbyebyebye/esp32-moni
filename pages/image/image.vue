<template>
	<view class="image_view">
		<u-list @scrolltolower="scrolltolower">
			<u-list-item v-for="(item, index) in indexList" :key="index" style="margin-bottom: 20rpx;">
				<view class="cell">
					<view class="header">
						<view class="title">
							{{item.title}}
						</view>
						<view class="time">
							{{item.create_time}}
						</view>
					</view>
					<view class="body">
						<view class="pic">
							<image :src="item.url" class="img" mode=""></image>
						</view>
						<view class="content">
							{{item.content}}
						</view>
					</view>
				</view>
			</u-list-item>
		</u-list>
	</view>
</template>

<script>
	import {timeToString} from '../../utils/tool.js'
	export default {
		data() {
			return {
				userId:'',
				indexList: []
			};
		},
		onLoad() {
			uni.getStorage({
				key: 'user',
				success: (res) => {
					console.log(res);
					this.userId = res.data.id
				}
			})
			
			this.getDataList()
		},
		methods: {
			getDataList(){
				uni.request({
					url:this.$baseUrl + "/getImageList?user_id="+this.userId,
					method:'GET',
					success: (res) => {
						console.log(res);
						let list = res.data.data;
						this.indexList = list.map(item=>{
							return {
								...item,
								create_time:timeToString(item.create_time)
							}
						})
					}
				})
			},
			scrolltolower(){
				console.log('触底')
			}
		}
	}
</script>

<style lang="scss">
.image_view{
	padding: 10rpx;
	background: #edeff6;
	.cell{
		padding: 20rpx;
		margin: 0 auto;
		width: 680rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		
		background: #fff;
		border-radius: 20rpx;
		box-shadow: 5px 4px 2px #ccc;
		
		.header{
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			padding-bottom: 10rpx;
			margin-bottom: 10rpx;
			border-bottom: solid 1px #ccc;
			.title{
				margin-left: 10rpx;
				font-weight: bold;
			}
		}
		.body{
			display: flex;
			flex-direction: row;
			justify-content: left;
			margin-top: 10rpx;
			.pic{
				margin-left: 20rpx;
				.img{
					height: 300rpx;
					width: 400rpx;
				}
			}
			.content{
				margin-left: 20rpx;
			}
		}
	}
}
</style>