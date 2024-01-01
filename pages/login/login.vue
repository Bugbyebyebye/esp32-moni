<template>
	<view class="login">
		<view class="box">
			<view class="header">
				<text style="align-content: center;margin: 0 auto;" v-if="flag">欢迎登录!</text>
				<text style="align-content: center;margin: 0 auto;" v-else>欢迎注册!</text>
			</view>
			<view class="account">
				<u--input
					prefixIcon="account"
				    placeholder="请输入账号"
				    border="bottom"
					v-model="username"
				    clearable
				  ></u--input>
			</view>
			<view class="password">
				<u--input
					prefixIcon="lock"
				    placeholder="请输入密码"
				    border="bottom"
					v-model="password"
				    clearable
					password
				  ></u--input>
			</view>
			<view class="btn">
				<u-button type="primary" v-if="flag" @click="login()">登录</u-button>
				<u-button type="primary" v-else @click="register()">注册</u-button>
			</view>
		</view>
		
		<!-- 提示 -->
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				flag:true,
				username:'',
				password:''
			};
		},
		methods:{
			login(){
				console.log(this.username);
				console.log(this.password);
				uni.request({
					url:this.$baseUrl + "/login",
					method:'POST',
					data:{
						username:this.username,
						password:this.password
					},
					success: (res) => {
						console.log(res);
						
						if(res.data.code == 200){
							uni.setStorage({
								data:{
									'id':res.data.data.user_id,
									'username':this.username,
									'create_time':res.data.data.create_time
								},
								key:"user"
							})
							this.$refs.uToast.show({
								type: 'success',
								title: '登录成功',
								message: "登录成功",
								iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png',
								complete() {
									uni.switchTab({
										url:'/pages/index/index'
									})
								}
							})
						}else{
							this.$refs.uToast.show({
								type: 'error',
								title: '登录失败',
								message: "登录失败",
								iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png',
							})
						}
					},
					fail: (err) => {
						console.log(err);
					}
				})
			},
			register(){
				console.log(this.username);
				console.log(this.password);
				uni.request({
					url:this.$baseUrl + "/register",
					method:'POST',
					data:{
						username:this.username,
						password:this.password
					},
					success: (res) => {
						console.log(res);
						uni.setStorage({
							data:{
								'id':res.data.data.user_id,
								'username':this.username,
								'create_time':res.data.data.create_time
							},
							key:"user_id"
						})
						this.$refs.uToast.show({
							type: 'success',
							title: '注册成功',
							message: "注册成功",
							iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png',
							complete() {
								uni.switchTab({
									url:'/pages/index/index'
								})
							}
						})
					},
					fail: (err) => {
						console.log(err);
					}
				})
			}
		}
	}
</script>

<style lang="scss">
.login{
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 20rpx 20rpx;
	background: #edeff6;
	height: 100vh;
	
	.box{
		margin: 0 auto;
		height: auto;
		width: 600rpx;
		background-color: #fff;
		
		border-radius: 20rpx;
		box-shadow: 5px 4px 2px #ccc;
		padding: 20rpx;
		.header{
			display: flex;
			flex-direction: row;
			justify-content: center;
			
			font-size: 20px;
			font-weight: bold;
			margin-bottom: 20rpx;
		}
		.account{
			margin-bottom: 20rpx;
		}
		.btn{
			margin-top: 100rpx;
		}
	}
}
</style>
