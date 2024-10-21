<template>
	<view class="container">
		<!-- 小程序状态下登录 -->
		<!-- #ifdef MP-WEIXIN -->
		<view class="mp_wxBox">
			<view>
				<view class="headers">
					<image src="../../static/img/logo.png" style="border-radius: 50%;"></image>
				</view>
				<view class="content">
					<view>申请获取以下权限</view>
					<text>获得你的公开信息(昵称，头像、地区等)</text>
				</view>
				<button v-show="weixinPhone" style="background: #E10A07;background-color: #E10A07;color: #FFFFFF;"
					class="bottom" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
					授权手机号
				</button>
				<!-- <button v-show="!weixinPhone" style="background: #FF3530; color: #FFF;" class="bottom"
					open-type="getUserInfo" withCredentials="true" lang="zh_CN" @getuserinfo="wxGetUserInfo">
					立即登录
				</button> -->
				<button v-show="!weixinPhone" style="background: #E10A07;color: #FFFFFF;" class='bottom'
					bindtap="getUserProfile" @tap="wxGetUserInfo">
					授权登录
				</button>
			</view>
		</view>
		<!-- #endif -->

		<!-- #ifndef MP-WEIXIN -->
		<view class="wrapper">
			<view class="input-content">
				<view class="cu-form-group"
					style="border: 2upx solid whitesmoke;margin-bottom: 20px;border-radius: 30px">
					<view class="title">手机号</view>
					<input type="number" :value="mobile" placeholder="请输入手机号" maxlength="11" data-key="mobile"
						@input="inputChange" />
				</view>
				<view class="cu-form-group" style="border: 2upx solid whitesmoke;border-radius: 30px">
					<view class="title">密码</view>
					<input type="password" placeholder="请输入密码" maxlength="20" :value="code" data-key="code"
						@input="inputChange" @confirm="toLogin" />
					<text class="send-msg" @click="forget">忘记密码</text>
				</view>
			</view>
			<button class="confirm-btn" @click="toLogin">登录</button>

			<view style="margin-top: 32px;text-align: center">
				<view>
					没有账号？
					<text style="color: #e10a07" @click="register()">立即注册</text>
				</view>
			</view>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				mobile: '',
				code: '',
				sessionkey: '',
				flag: '1',
				weixinPhone: false,
				sending: false,
				sendDataList: {},
				phone: '',
				sendTime: '获取验证码',
				count: 60
			};
		},

		methods: {
			//小程序微信登录后获取手机号
			getPhoneNumber: function(e) {
				console.log(e);
				if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
					console.log('用户拒绝提供手机号');
				} else {
					console.log('用户同意提供手机号');
					this.setPhoneByInsert(e.detail.encryptedData, e.detail.iv);
				}
			},
			//小程序微信登录后获取手机号
			setPhoneByInsert(decryptData, iv) {
				this.$queue.showLoading('登录中...');

				let data = {
					decryptData: decryptData,
					key: this.sessionkey,
					iv: iv
				};
				this.$Request.getT('/appLogin/selectPhone', data).then(res => {
					if (res.code === 0) {
						uni.hideLoading();
						res.data = JSON.parse(res.data)
						this.phone = res.data.phoneNumber;
						this.getWeixinInfo(this.sendDataList);
					} else {
						uni.hideLoading();
						this.$queue.showToast(res.msg);
					}
				});
			},
			//第一授权获取用户信息===》按钮触发
			wxGetUserInfo(e) {
				let that = this;

				wx.getUserProfile({
					desc: '业务需要',
					success: infoRes => {
						console.log("infoRes.encryptedData__________:" + JSON.stringify(infoRes.userInfo))
						let nickName = infoRes.userInfo.nickName; //昵称
						let avatarUrl = infoRes.userInfo.avatarUrl; //头像
						let sex = infoRes.userInfo.gender; //头像
						try {
								that.login(nickName, avatarUrl, sex);
						} catch (e) {}
					}
				})



				// uni.showLoading({
				// 	title: '请等待',
				// 	mask: false
				// });
				// if (e.detail.errMsg == 'getUserInfo:ok') {
				// 	uni.hideLoading();
				// 	var openid = that.yu.getCache('openid');
				// 	console.log('opdenid', openid);
				// 	// return
				// 	if (openid) {
				// 		var sendData = {
				// 			openid: that.yu.getCache('openid'), //小程序openid
				// 			unionid: that.yu.getCache('unionid'), //小程序openid
				// 			nickName: e.detail.userInfo.nickName, //微信名称
				// 			imageUrl: e.detail.userInfo.avatarUrl, //头像
				// 			gender: e.detail.userInfo.gender, //性别
				// 			invitation: that.yu.getCache('relationInvitePeople') //别人登录进来携带你的邀请码
				// 		};
				// 		console.log('有 opendid');
				// 		that.getWeixinInfo(sendData);
				// 	} else {
				// 		console.log('无 opendid');
				// 		that.login();
				// 	}
				// } else {
				// 	uni.hideLoading();
				// 	uni.showModal({
				// 		title: '提示',
				// 		content: '您已拒绝授权，请重新点击并授权！',
				// 		showCancel: false,
				// 		confirmText: '确定',
				// 		confirmColor: '#FF2A46',
				// 		success: function(res) {
				// 			if (res.confirm) {
				// 				console.log('用户点击确定');
				// 			}
				// 		}
				// 	});
				// }
			}, //登录
			getWeixinInfo(sendData) {
				console.log(sendData);
				let that = this;
				let url = '/user/mp/update';
				uni.showLoading({
					title: '登录中...'
				});
				var postData = {
					wxId: sendData.openid, //小程序openid
					unionid: sendData.unionid, //unionId
					nickName: sendData.nickName, //微信名称
					imageUrl: sendData.imageUrl, //头像
					sex: sendData.gender, //性别
					phone: that.phone,
					invitation: sendData.invitation
				};
				console.log(postData);

				that.$Request.postJson('/appLogin/insertWxUser', postData).then(res => {
					console.log(res);
					if (res.code === 0) {
						uni.hideLoading();
						that.yu.setCache('token', res.token);
						that.yu.setCache('userId', res.user.userId);

						that.yu.setCache("avatar", res.user.imageUrl ? res.user.imageUrl : '/static/img/logo.png');
						that.yu.setCache("nickName", res.user.nickName ? res.user.nickName : res.user.phone);
						that.yu.setCache("mobile", res.user.phone);
						that.yu.setCache("invitationCode", res.user.invitationCode);
						that.yu.setCache("relation_id", res.user.relationId);
						that.yu.setCache("relation", res.user.invitationCode);
						that.yu.setCache("grade", res.user.grade);
						that.yu.setCache("isInvitation", res.user.isInvitation);
						that.yu.setCache("gender", parseInt(res.user.gender));
						that.yu.setCache("sex", res.user.sex);
						that.yu.setCache("campus", res.user.campus);
						that.yu.setCache("campusName", res.user.campusName);

						uni.navigateBack();
						// that.initUserInfo(res.user.userId, res.token);
					} else {
						uni.hideLoading();
						uni.showModal({
							showCancel: false,
							title: '登录失败',
							content: res.msg
						});
					}
				});
			},

			login(nickName, avatarUrl, sex) {
				let that = this;
				let url = '/wx/mp/login';
				uni.showLoading({
					title: '登录中...'
				});
				// 1.wx获取登录用户code
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						var getParams = {
							code: loginRes.code
						};
						that.$Request.getT('/appLogin/wx/login', getParams).then(res => {
							console.log(res);
							if (res.code == 0) {
								that.yu.setCache('openid', res.data.open_id);
								that.yu.setCache('unionid', res.data.unionid);
								that.sessionkey = res.data.session_key;
								that.flag = res.data.flag;
								console.log(res.data.unionid, res.data.open_id);
								uni.hideLoading();
								//非第一次授权获取用户信息
								//获取用户信息后向调用信息更新方法
								var sendData = {
									openid: that.yu.getCache('openid'),
									unionid: that.yu.getCache('unionid'),
									nickName: nickName,
									imageUrl: avatarUrl,
									gender: sex, //性别
									invitation: that.yu.getCache(
										'relationInvitePeople'
									) //别人登录进来携带你的邀请码
								};
								that.sendDataList = sendData;
								if (that.flag === '1') {
									that.weixinPhone = true;
								} else {
									that.getWeixinInfo(sendData);
								}
							}
						});
					}
				});
			},
			forget() {
				uni.navigateTo({
					url: '/pages/public/forgetPwd'
				});
			},
			register() {
				uni.navigateTo({
					url: '/pages/public/register'
				});
			},
			inputChange(e) {
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			navBack() {
				uni.navigateBack();
			},
			toLogin() {
				this.$queue.loginClear();
				let openid = this.$queue.getData('openid');
				const {
					mobile,
					code
				} = this;
				if (!mobile) {
					this.$queue.showToast('请输入手机号');
				} else if (mobile.length != 11) {
					this.$queue.showToast('请输入手机号');
				} else if (!code) {
					this.$queue.showToast('请输入密码');
				} else {
					this.$queue.showLoading('正在登录中...');
					this.$Request
						.postJson('/appLogin/login', {
							password: code,
							mobile: mobile,
							openid: openid
						})
						.then(res => {
							if (res.code === 0) {
								this.yu.setCache('token', res.token);
								this.yu.setCache('userId', res.userId);
								this.getUserInfo(res.userId, res.token);
							} else {
								uni.hideLoading();
								this.$queue.showToast(res.msg);
							}
						});
				}
			},
			getUserInfo(userId, token) {
				this.yu.request('/app/selectUserById?userId=' + userId, 'POST').then(res => {
					if (res.code === 0) {
						this.yu.setCache('avatar', res.data.imageUrl ? res.data.imageUrl : '/static/img/logo.png');
						this.yu.setCache('nickName', res.data.nickName ? res.data.nickName : res.data.phone);
						this.yu.setCache('mobile', res.data.phone);
						this.yu.setCache('invitationCode', res.data.invitationCode);
						//
						this.yu.setCache('relation_id', res.data.relationId);
						this.yu.setCache('relation', res.data.invitationCode);
						this.yu.setCache('grade', res.data.grade);
						this.yu.setCache('isInvitation', res.data.isInvitation);
						this.yu.setCache('gender', parseInt(res.data.gender));
						this.yu.setCache('sex', res.data.sex);
						this.yu.setCache('campus', res.data.campus);
						this.yu.setCache('campusName', res.data.campusName);
						let href = this.yu.getCache('href');
						if (href) {
							if (href === '/pages/index/index') {
								this.yu.removeCache('href');
								uni.switchTab({
									url: '/pages/index/index'
								});
							} else if (href === '/pages/errands/index') {
								this.yu.removeCache('href');
								uni.switchTab({
									url: '/pages/errands/index'
								});
							} else if (href === '/pages/order/index') {
								this.yu.removeCache('href');
								uni.switchTab({
									url: '/pages/order/index'
								});
							} else if (href === '/pages/my/index') {
								this.yu.removeCache('href');
								uni.switchTab({
									url: '/pages/my/index'
								});
							} else {
								this.yu.removeCache('href');
								uni.redirectTo({
									url: href
								});
							}
						} else {
							uni.switchTab({
								url: '/pages/index/index'
							});
						}
					} else {
						uni.showModal({
							showCancel: false,
							title: '登录失败',
							content: res.msg
						});
					}
					uni.hideLoading();
				});
			}
		}
	};
</script>

<style lang="scss">
	.headers {
		text-align: center;
	}

	.headers>image {
		width: 400upx;
		height: 400upx;
	}

	.footer {
		padding-left: 140upx;
		margin-top: 32upx;
		font-size: 24upx;
		color: #666666;
		text-align: center;
		display: flex;
	}

	page {
		background: #fff;
	}

	.send-msg {
		border-radius: 30px;
		color: black;
		background: white;
		height: 30px;
		font-size: 14px;
		line-height: 30px;
	}

	.container {
		top: 0;
		padding-top: 32upx;
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: #fff;

		.mp_wxBox {
			.headers {
				margin: 35% auto 50rpx;
				text-align: center;
				border-radius: 60rpx;
				width: 650rpx;
				height: 300rpx;
				line-height: 450rpx;

				image {
					width: 300rpx;
					height: 300rpx;
				}
			}

			.content {
				text-align: center;
			}

			text {
				display: block;
				color: #9d9d9d;
				margin-top: 40rpx;
			}

			.bottom {
				line-height: 80upx;
				border-radius: 80upx;
				margin: 70rpx 50rpx;
				height: 80upx;
				font-size: 35rpx;
			}
		}
	}

	.wrapper {
		position: relative;
		z-index: 90;
		background: #fff;
		padding-bottom: 20px;
	}

	.back-btn {
		position: absolute;
		left: 20px;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 20px;
		font-size: 20px;
		color: $font-color-dark;
	}

	.left-top-sign {
		font-size: 80px;
		color: $page-color-base;
		position: relative;
	}

	.right-top-sign {
		position: absolute;
		top: 40px;
		right: -15px;
		z-index: 95;

		&:before,
		&:after {
			display: block;
			content: '';
			width: 20px;
			height: 40px;
			background: #e10a07;
		}

		&:before {
			transform: rotate(50deg);
			border-radius: 0 50px 0 0;
		}

		&:after {
			position: absolute;
			right: -198px;
			top: 0;
			transform: rotate(-50deg);
			border-radius: 50px 0 0 0;
			/* background: pink; */
		}
	}

	.left-bottom-sign {
		position: absolute;
		left: -270px;
		bottom: -320px;
		/*border: 100upx solid #d0d1fd;*/
		border-radius: 50%;
		padding: 90px;
	}

	.welcome {
		position: relative;
		left: 30px;
		top: -55px;
		font-size: 28px;
		color: #555;
		text-shadow: 1px 0px 1px rgba(0, 0, 0, 0.3);
	}

	.input-content {
		padding: 0 20px;
	}

	.input-item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding: 0 30px;
		background: $page-color-light;
		height: 64px;
		border-radius: 4px;
		margin-bottom: 30px;

		&:last-child {
			margin-bottom: 0;
		}

		.tit {
			height: 30px;
			line-height: 28px;
			font-size: $font-sm + 2upx;
			color: $font-color-base;
		}

		input {
			height: 40px;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			width: 100%;
		}
	}

	.confirm-btn {
		width: 300px;
		height: 42px;
		line-height: 42px;
		border-radius: 30px;
		margin-top: 40px;
		background: -moz-linear-gradient(left, #f15b6c, #e10a07 100%);
		background: -webkit-gradient(linear, left top, left right, color-stop(0, #f15b6c), color-stop(100%, #e10a07));
		background: -webkit-linear-gradient(left, #f15b6c 0, #e10a07 100%);
		background: -o-linear-gradient(left, #f15b6c 0, #e10a07 100%);
		background: -ms-linear-gradient(left, #f15b6c 0, #e10a07 100%);
		background: linear-gradient(to left, #f15b6c 0, #e10a07 100%);
		color: #fff;
		font-size: $font-lg;

		&:after {
			border-radius: 60px;
		}
	}

	.confirm-btn1 {
		width: 300px;
		height: 42px;
		line-height: 42px;
		border-radius: 30px;
		margin-top: 40px;
		background: whitesmoke;
		color: grey;
		font-size: $font-lg;

		&:after {
			border-radius: 60px;
		}
	}

	.forget-section {
		font-size: $font-sm + 2upx;
		color: $font-color-spec;
		text-align: center;
		margin-top: 40px;
	}

	.register-section {
		left: 0;
		margin-top: 30px;
		bottom: 30px;
		width: 100%;
		font-size: $font-sm + 2upx;
		color: $font-color-base;
		text-align: center;

		text {
			color: $font-color-spec;
			margin-left: 10px;
		}
	}
</style>
