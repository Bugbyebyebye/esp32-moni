<template>
	<view class="index">
		<!-- 显示视频 -->
		<u-notice-bar v-if="showNotice" :text="'正在录制视频，已录制 ' + formatTime + '，点击结束按钮结束录制。'"
			style="margin-bottom: 10rpx;"></u-notice-bar>

		<u-sticky offset-top="5">
			<view class="video">
				<image :src="video_btn ? videoUrl:defaultUrl" mode="" class="video_play"></image>
				<view class="light">
					<view class="text">
						摄像头：<text v-if="video_btn" style="color: #2273f9;">开启</text><text v-else
							style="color: #e45656;">关闭</text>
					</view>
					<view class="btn">
						<u-switch v-model="video_btn" size="24" @change="videoChange"></u-switch>
					</view>
				</view>
				<view class="light">
					<view class="text">
						截图
					</view>
					<view class="btn">
						<u-button text="点击截图" type="primary" size="mini" style="width: 120rpx;" @click="capture"></u-button>
					</view>
				</view>
				<view class="light">
					<view class="text">
						录制视频
					</view>
					<view class="btn">
						<u-button text="开始" type="primary" size="mini" style="width: 120rpx;margin-right: 20rpx;"
							@click="clickStart"></u-button>
						<u-button text="结束" type="error" size="mini" style="width: 120rpx;" @click="clickClose"></u-button>
					</view>
				</view>
			</view>
		</u-sticky>
		<!-- 显示点亮led灯等操作 -->
		<view class="operate">
			<view class="light">
				<view class="text">
					闪光灯
				</view>
				<view class="btn">
					<u-switch v-model="light_btn" size="24" @change="lightChange"></u-switch>
				</view>
			</view>
			<view class="slide">
				<view class="slide1">
					<view class="title">
						<view class="text" style="font-weight: bold;">
							摄像头上下摆动
						</view>
						<view class="value">
							当前：<text style="color: #2273f9;">{{slide1}}</text>度
						</view>
					</view>
					<u-slider v-model="slide1" step="1" min="0" max="90" @change="slide1Change"></u-slider>
				</view>
				<view class="slide2">
					<view class="title">
						<view class="text" style="font-weight: bold;">
							摄像头左右摆动
						</view>
						<view class="value">
							当前：<text style="color: #2273f9;">{{slide2}}</text>度
						</view>
					</view>
					<u-slider v-model="slide2" step="10" min="0" max="180" @change="slide2Change"></u-slider>
				</view>
			</view>
		</view>
		<view class="log">
			<view class="title">
				报警日志
			</view>
			<view class="list">
				<view v-for="(item, index) in warnList" :key="index">
					<u-cell :title="item.name" :value="item.create_time"></u-cell>
				</view>
			</view>
		</view>
		<view class="message" v-if="!showMsg" @click="showMsg = true">
			<u-icon name="plus" style="margin: 0 auto;" color="#fff" size="20"></u-icon>
		</view>

		<!-- 提示 -->
		<u-toast ref="uToast"></u-toast>
		<!-- 弹出层 -->
		<u-popup :show="showSave" :round="10" mode="center" @close="closePop" :closeable="true">
			<view class="thePop">
				<view class="title">
					是否保存图片/视频到我的？
				</view>
				<view class="btn" style="margin-top: 80rpx;margin-bottom: 20rpx;">
					<u-button type="error" text="取消" size="mini" style="width: 120rpx;" @click="closePop()"></u-button>
					<u-button type="primary" text="保存" size="mini" style="width: 120rpx;" @click="goAdd()"></u-button>
				</view>
			</view>
		</u-popup>
		<u-popup :show="showMsg" :round="10" mode="center" @close="closePop" :closeable="true">
			<view class="thePop">
				<view class="title">
					发送消息：
				</view>
				<view class="content" style="margin-top: 10rpx;margin-bottom: 10rpx;">
					  <u--input
					  v-model="msg"
					    placeholder="请输入消息"
					    border="bottom"
					    clearable
					  ></u--input>
				</view>
				<view class="btn" style="margin-top: 20rpx;margin-bottom: 20rpx;">
					<u-button type="error" text="取消" size="mini" style="width: 120rpx;" @click="closePop()"></u-button>
					<u-button type="primary" text="发送" size="mini" style="width: 120rpx;" @click="sendMsg()"></u-button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {timeToString} from '../../utils/tool.js'
	export default {
		data() {
			return {
				videoUrl: this.$baseUrl + '/video',
				defaultUrl: '../../static/default.png',
				slide1: '0',
				slide2: '0',
				light_btn: false,
				video_btn: false,
				showNotice: false,
				isTiming: false,
				time: 0,
				timer: null,
				showSave: false,
				showMsg:false,
				popType: '',
				warnList: [],
				userId:'',
				msg:''
			}
		},
		computed: {
		    formatTime() {
		      let hours = Math.floor(this.time / 3600);
		      let minutes = Math.floor((this.time % 3600) / 60);
		      let seconds = this.time % 60;
		
		      // 补零操作
		      hours = (hours < 10 ? '0' : '') + hours;
		      minutes = (minutes < 10 ? '0' : '') + minutes;
		      seconds = (seconds < 10 ? '0' : '') + seconds;
		
		      return `${hours}:${minutes}:${seconds}`;
		    }
		  },
		onLoad() {
			uni.getStorage({
				key:'user',
				success: (res) => {
					console.log(res);
					this.userId = res.data.id
				}
			})
			this.getWarnList()
		},
		methods: {
			getWarnList(){
				uni.request({
					url:this.$baseUrl + "/getWarnList?user_id="+this.userId,
					method:'GET',
					success: (res) => {
						console.log(res);
						let list = res.data.data;
						this.warnList = list.map(item=>{
							return {
								...item,
								create_time:timeToString(item.create_time)
							}
						})
						this.warnList = this.warnList.slice(0,4);
					}
				})
			},
			capture() {
				let that = this

				uni.request({
					url: that.$baseUrl + "/capture",
					method: 'GET',
					success: (res) => {
						this.$refs.uToast.show({
							type: 'success',
							title: '截图成功',
							message: "截图成功",
							iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png',
							complete() {
								that.showSave = true;
								that.popType = 'image'
							}
						})

						console.log(res.data)
					},
					fail: (err) => {
						this.$refs.uToast.show({
							type: 'error',
							title: '截图失败',
							message: "截图失败",
							iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png',
							complete() {
								that.showSave = true;
							}
						})

						console.log(err)
					}
				})
			},
			clickStart() {
				let that = this
				console.log('开始录制')
				this.startTimer();
				this.showNotice = true;

				uni.request({
					url: that.$baseUrl + "/video_start",
					method: 'GET',
					success: (res) => {
						console.log(res)
					},
					fail: (err) => {
						console.log(err)
					}
				})
			},
			clickClose() {
				console.log('结束录制')
				let that = this
				this.stopTimer()
				this.showNotice = false;

				uni.request({
					url: that.$baseUrl + "/video_end",
					method: 'GET',
					success: (res) => {
						this.$refs.uToast.show({
							type: 'success',
							title: '视频录制成功',
							message: "视频录制成功",
							iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png',
							complete() {
								that.showSave = true;
								that.popType = 'video'
							}
						})

						console.log(res)
					},
					fail: (err) => {
						this.$refs.uToast.show({
							type: 'error',
							title: '视频录制失败',
							message: "视频录制失败",
							iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png'
						})
						console.log(err)
					}
				})
			},
			lightChange(e) {
				if (e) {
					this.fastMQTTMessage('light', 'yes')
					this.$refs.uToast.show({
						type: 'success',
						title: '闪光灯开启',
						message: "闪光灯开启",
						iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png',
					})
				} else {
					this.fastMQTTMessage('light', 'no')
					this.$refs.uToast.show({
						type: 'success',
						title: '闪光灯关闭',
						message: "闪光灯关闭",
						iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png',
					})
				}
			},
			videoChange(e) {
				if (e) {
					this.fastMQTTMessage('video', 'yes')
					this.$refs.uToast.show({
						type: 'success',
						title: '摄像头开启',
						message: "摄像头开启",
						iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png',
					})
				} else {
					this.fastMQTTMessage('video', 'no')
					this.$refs.uToast.show({
						type: 'success',
						title: '摄像头关闭',
						message: "摄像头关闭",
						iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png',
					})
				}
			},
			slide1Change(e) {
				console.log(e)
				this.fastMQTTMessage('sub_data2', e)
			},
			slide2Change(e) {
				console.log(e)
				this.fastMQTTMessage('sub_data1', e)
			},
			sendMsg(){
				let that = this;
				this.fastMQTTMessage('info',this.msg);
				that.showMsg = false;
				this.$refs.uToast.show({
					type: 'success',
					title: '消息发送成功',
					message: "消息发送成功",
					iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png'
				})
			},
			fastMQTTMessage(topic, msg) {
				let that = this
				uni.request({
					header: {
						'Content-Type': 'application/json'
					},
					url: that.$baseUrl + "/publish",
					method: 'POST',
					data: JSON.stringify({
						topic: topic,
						msg: msg
					}),
					dataType: 'json',
					success: (res) => {
						var result = res.data;
						console.log(result);
					},
					fail: (err) => {
						console.error('请求失败', err);
					}
				});
			},
			startTimer() {
				this.isTiming = true
				this.timer = setInterval(() => {
					this.time++
				}, 1000)
			},
			stopTimer() {
				this.isTiming = false
				this.time = 0
				clearInterval(this.timer)
			},
			closePop() {
				this.showSave = false;
				this.showMsg = false;
			},
			goAdd() {
				this.showSave = false;
				uni.navigateTo({
					url: '/pages/add/add?type=' + this.popType
				})
			}
		}
	}
</script>

<style lang="scss">
	.index {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 20rpx 20rpx;
		background: #edeff6;

		.video {
			margin: 0 auto;
			border-radius: 20rpx;
			height: 600rpx;
			width: 700rpx;
			background: #fff;
			margin-bottom: 20rpx;
			box-shadow: 5px 4px 2px #ccc;

			padding: 10rpx 10rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;

			.video_play {
				margin-top: 10rpx;
				margin-left: 5rpx;
				margin-right: 5rpx;
				height: 450rpx;
				width: 690rpx;
			}

			.light {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				margin-top: 10rpx;

				.text {
					margin-left: 20rpx;
					margin-bottom: 10rpx;
					font-weight: bold;
				}

				.btn {
					display: flex;
					flex-direction: row;
					margin-right: 20rpx;
				}
			}
		}

		.operate {
			margin: 0 auto;
			border-radius: 20rpx;
			height: 400rpx;
			width: 700rpx;
			background: #fff;
			margin-bottom: 20rpx;

			box-shadow: 5px 4px 2px #ccc;

			padding: 10rpx;

			.light {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				padding: 10rpx;

				.text {
					margin-left: 10rpx;
					margin-bottom: 10rpx;
					font-weight: bold;
				}

				.btn {
					display: flex;
					flex-direction: row;
					margin-right: 20rpx;
				}

				border-bottom: solid 1px #ccc;
				margin-bottom: 10rpx;
			}

			.slide {
				.title {
					margin-top: 5rpx;
					margin-left: 20rpx;
				}
			}
		}

		.log {
			padding: 10rpx;
			border-radius: 20rpx;
			height: 400rpx;
			width: 700rpx;
			background: #fff;
			margin: 0 auto;
			margin-bottom: 20rpx;

			box-shadow: 5px 4px 2px #ccc;

			.title {
				margin-left: 20rpx;
				margin-top: 10rpx;
				font-weight: bold;
			}
		}
		.message{
			position: fixed; /* 使用fixed定位使元素相对于浏览器窗口定位 */
			right: 30rpx; /* 设置距离右侧边距为20像素 */
		    bottom: 150rpx; /* 设置距离底部边距为20像素 */
			
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
			background: #2273f9;
			
			box-shadow: 5px 4px 2px #ccc;
			display: flex;
			flex-direction: column;
			justify-content: center;
		}
	}

	.thePop {
		height: auto;
		width: 500rpx;
		padding: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		.title {
			margin-top: 30rpx;
			margin-left: 10rpx;
		}

		.btn {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
		}
	}
</style>