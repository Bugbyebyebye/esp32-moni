<template>
	<view class="add">
		<view class="box">
			<view class="title">
				<view class="text">
					标题：
				</view>
				<u--input 
				placeholder="请输入标题" 
				v-model="title" 
				border="surround" 
				clearable 
				style="background: #fff;"
				@clear="clearTitle()"></u--input>
			</view>
			<view class="content">
				<view class="text">
					简介：
				</view>
				<u--textarea v-model="content" placeholder="请输入内容" count style="background: #fff;"></u--textarea>
			</view>
			<view class="data">
				<view class="text">
					图片/视频：
				</view>
				<view class="image">
					<image :src="dataUrl" mode="" v-if="show"></image>
				</view>
				<view class="video">
					<video :src="dataUrl" v-if="!show"></video>
				</view>
			</view>
			<view class="btn">
				<u-button type="error" text="取消"  style="width: 120rpx;height: 60rpx;" @click="goIndex()"></u-button>
				<u-button type="primary" text="确定" style="width: 120rpx;height: 60rpx;" @click="submitForm()"></u-button>
			</view>
		</view>
		
		<!-- 提示 -->
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
import image from '../../uni_modules/uview-ui/libs/config/props/image';
	export default {
		data() {
			return {
				show: true,
				title:'',
				content:'',
				dataUrl:'',
				type:'',
				userId:''
			};
		},
		onLoad(e) {
			console.log(e);
			this.type = e.type;
			if (e.type == 'image') {
				this.show = true;
			} else {
				this.show = false;
			}
			uni.getStorage({
				key:'user',
				success: (res) => {
					console.log(res);
					this.userId = res.data.id
				}
			})
			
			this.uploadFile();
		},
		methods: {
			clearTitle(){
				this.title = '';
			},
			clearContent(){
				this.content = '';
			},
			submitForm(){
				uni.request({
					header: {
						'Content-Type': 'application/json'
					},
					url: this.$baseUrl + "/addData",
					method: 'POST',
					data: JSON.stringify({
						user_id:this.userId,
						type:this.type,
						title:this.title,
						content:this.content,
						url:this.dataUrl
					}),
					dataType: 'json',
					success: (res) => {
						var result = res.data;
						console.log(result);
						this.$refs.uToast.show({
							type: 'success',
							title: this.type+'保存成功！',
							message: this.type+'保存成功！',
							iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png',
							complete(){
								uni.switchTab({
									url:'/pages/index/index'
								})
							}
						})
					},
					fail: (err) => {
						console.error('请求失败', err);
					}
				})
			},
			uploadFile(){
				let that = this;
				if(this.show){
					name = './image/image.jpg'
				}else{
					name = './video/video.mp4'
				}
				
				uni.request({
					header: {
						'Content-Type': 'application/json'
					},
					url: that.$baseUrl + "/upload",
					method: 'POST',
					data: JSON.stringify({
						path: name
					}),
					dataType: 'json',
					success: (res) => {
						console.log(res.data);
						this.dataUrl = res.data.url
					},
					fail: (err) => {
						console.error('请求失败', err);
					}
				})
			},
			goIndex(){
				uni.switchTab({
					url:'/pages/index/index'
				})
			}
		}
	}
</script>

<style lang="scss">
.add{
	padding: 20rpx;
	.box{
		border-radius: 20rpx;
		height: 1000rpx;
		width: 680rpx;
		background: #e9ebec;
		margin-bottom: 20rpx;
		
		box-shadow: 5px 4px 2px #ccc;
		
		padding:20rpx;
		.text{
			margin: 10rpx 20rpx;
		}
		.image{
			margin-top: 20rpx;
			margin-left: 20rpx;
		}
		.video{
			margin-top: 20rpx;
			margin-left: 20rpx;
		}
		.btn{
			margin-top: 20rpx;
			display: flex;
			flex-direction: row;
			justify-content: center;
		}
	}
}
</style>