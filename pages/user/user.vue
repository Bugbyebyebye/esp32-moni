<template>
	<view class="user">
		<view class="top">
			<view class="group">
				<view class="userInfo">
					<view class="pic" @click="!hasLogin && toSetUserInfo">
						<u-avatar text="郝" fontSize="30" randomBgColor style="height: 120rpx;width: 120rpx;"></u-avatar>
					</view>
					<view class="text" v-if="hasLogin" style="margin-left: 20rpx;" @click="!hasLogin && toSetUserInfo">
						<view class="nickname" style="font-weight: bold;font-size: 20px;">
							{{username}}
						</view>
						<view class="year" style="font-size: 14px;">
							注册于{{createTime}}
						</view>
					</view>
					<view class="text" v-else @click="toSetUserInfo">
						<view class="nickname" style="font-weight: bold;font-size: 20px;margin-left: 20px;">
							点击登录
						</view>
					</view>
				</view>
				<view class="more" style="margin-right: 20rpx;font-weight: bold;font-size: 20px;" @click="toSetUserInfo"
					v-if="!hasLogin">
					<text>></text>
				</view>
			</view>
			<view class="bg">
				<image src="../../static/kyrie.png" mode=""></image>
			</view>
		</view>

		<view class="main">
			<view class="info">
				<view class="item">截图数：<text style="margin: 0 10rpx;">{{totalObj.imageNum}}</text></view>
				<view class="item">视频数：<text style="margin: 0 10rpx;">{{totalObj.videoNum}}</text></view>
				<view class="item">报警数：<text style="margin: 0 10rpx;">{{totalObj.warnNum}}</text></view>
			</view>

			<view class="list">
				<view class="group">
					<view class="item" @click="myImage">
						<view class="left">
							<u-icon name="photo" color="#018be7" size="28"></u-icon>
							<text class="text">我的截图</text>
						</view>
						<view class="right"><text class="text">></text></view>
					</view>
					<view class="item" @click="myVideo()">
						<view class="left">
							<u-icon name="play-circle" color="#018be7" size="28"></u-icon>
							<text class="text">我的视频</text>
						</view>
						<view class="right"><text class="text">></text></view>
					</view>
					<view class="item" @click="myWarn()">
						<view class="left">
							<u-icon name="warning" color="#018be7" size="30"></u-icon>
							<text class="text">报警记录</text>
						</view>
						<view class="right"><text class="text">></text></view>
					</view>
				</view>

				<view class="group">
					<view class="item">
						<view class="left">
							<u-icon name="question-circle" color="#018be7" size="26"
								style="margin-left: 5rpx;"></u-icon>
							<text class="text">关于我们</text>
						</view>
						<view class="right"><text class="text">></text></view>
					</view>
					<view class="item">
						<view class="left">
							<u-icon name="chat" color="#018be7" size="28"></u-icon>
							<text class="text">问题反馈</text>
						</view>
						<view class="right"><text class="text">></text></view>
					</view>
				</view>
				<view class="group">
					<view class="item" @click="logout">
						<view class="left">
							<u-icon name="account" color="#018be7" size="28"></u-icon>
							<text class="text">退出登录</text>
						</view>
						<view class="right"><text class="text">></text></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {timeToString} from '../../utils/tool.js'
	export default {
		onLoad() {
			uni.getStorage({
				key: 'user',
				success: (res) => {
					console.log(res);
					this.hasLogin = true
					this.userId = res.data.id
					this.username = res.data.username
					this.createTime = timeToString(res.data.create_time)
					console.log(this.createTime);
				},
				fail: (err) => {
					this.hasLogin = false
				}
			})
			
			this.getStats()
		},
		data() {
			return {
				hasLogin: false,
				totalObj: {
					imageNum: 0,
					videoNum: 0,
					warnNum: 0
				},
				userId:'',
				username: '',
				createTime: ''
			};
		},
		methods: {
			myImage() {
				if (this.checkLogin()) {
					return;
				}
				uni.navigateTo({
					url: '/pages/image/image'
				})
			},
			myVideo() {
				if (this.checkLogin()) {
					return;
				}
				uni.navigateTo({
					url: '/pages/video/video'
				})
			},
			myWarn() {
				if (this.checkLogin()) {
					return;
				}
				uni.navigateTo({
					url: '/pages/warn/warn'
				})
			},
			toSetUserInfo() {
				uni.navigateTo({
					url: '../login/login'
				})
			},
			logout() {
				if (this.checkLogin()) {
					return;
				}
				uni.showModal({
					title: "是否退出登录",
					success: res => {
						console.log(res);
						if (res.confirm) {
							uni.removeStorage({
								key: "user"
							})
							uni.navigateTo({
								url: '/pages/login/login'
							})
						}
					}
				})
			},
			checkLogin() {
				if (!this.hasLogin) {
					uni.showToast({
						title: "未登录！",
						icon: "none"
					})
					return true;
				}
				return false;
			},
			getStats(){
				uni.request({
					url:this.$baseUrl + "/stats",
					data:{
						"user_id":this.userId
					},
					method:'POST',
					success: (res) => {
						console.log(res);
						this.totalObj.imageNum = res.data.data.imageNum
						this.totalObj.videoNum = res.data.data.videoNum
						this.totalObj.warnNum = res.data.data.warnNum
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.user {
		.top {
			height: 300rpx;
			background: #bbb;
			padding: 0 30rpx;
			padding-top: var(--status-bar-height);
			position: relative;
			display: flex;
			align-items: center;

			.group {
				position: relative;
				z-index: 10;
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 100%;
				color: #fff;

				.userInfo {
					display: flex;
					width: 100%;
					align-items: center;

					.pic {
						width: 120rpx;
						height: 120rpx;
						border-radius: 50%;
						overflow: hidden;
						border: 2px solid #fff;

						image {
							width: 100%;
							height: 100%;
						}
					}
				}
			}

			.bg {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
					filter: blur(20px);
					transform: scale(2);
					opacity: 0.5;
				}
			}
		}

		.main {
			width: 100%;
			min-height: 200rpx;
			background: #fff;
			border-radius: 30rpx;
			transform: translateY(-30rpx);
			padding: 30rpx 0;

			.text {
				font-size: 16px;
			}

			.info {
				padding: 10rpx 30rpx;
				display: flex;
				font-size: 30rpx;

				.item {
					padding-right: 20rpx;
					color: #888;

					text {
						font-weight: 600;
						color: #333;
					}
				}
			}

			.list {
				.group {
					padding: 15rpx 30rpx;
					border-bottom: 15rpx solid #f4f4f4;

					.item {
						display: flex;
						justify-content: space-between;
						align-items: center;
						padding: 25rpx 0;
						font-size: 36rpx;
						color: #555;
						border-bottom: 1px solid #f8f8f8;

						.left {
							display: flex;
							justify-content: space-between;
							align-items: center;

							.text {
								margin-left: 20rpx;
							}
						}

						.right {
							.text {
								margin-right: 20rpx;
							}
						}
					}

					.item:last-child {
						border: none;
					}
				}

				.group:last-child {
					border: none;
				}
			}
		}
	}
</style>